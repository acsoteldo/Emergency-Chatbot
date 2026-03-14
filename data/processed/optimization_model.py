import json
import numpy as np
import pandas as pd
from scipy.optimize import linprog
from pathlib import Path

MASTER    = Path("/data/processed/country_month_master.csv")
OUT       = Path("/data/processed/")

# ── Parameters ────────────────────────────────────────────────────────────────
PARAMS = {
    "w_displacement":  0.30,
    "w_inform_risk":   0.25,
    "w_coping_gap":    0.25,
    "w_disaster_shock":0.15,
    "w_pri_proxy":     0.05,
    "budget_scalar":   1.0,
    "shock_threshold": 0.5,
    "min_floor_share": 0.001,
    "max_cap_share":   0.25,
    "surge_multiplier":3.0,
}

TIER1 = [
    "BHS","BLZ","BRB","CRI","CUB","DOM","GTM","GUY",
    "HND","HTI","JAM","NIC","PAN","PRI","SLV","SUR","TTO"
]

# ── Load master ───────────────────────────────────────────────────────────────
df = pd.read_csv(MASTER, parse_dates=["month"])
df = df[df["country_role"] == "tier1"].copy()
df["year"] = df["month"].dt.year

# ── Need score helpers ────────────────────────────────────────────────────────
def norm_col(series):
    mn, mx = series.min(), series.max()
    if mx == mn:
        return pd.Series(0.0, index=series.index)
    return (series - mn) / (mx - mn)

def build_need_scores(df, params):
    d = df.copy()

    # PAN: use unhcr_displaced_in only (R4V transit excluded)
    disp = d["displaced_monthly"].copy()
    pan_mask = d["iso3"] == "PAN"
    disp.loc[pan_mask] = d.loc[pan_mask, "unhcr_displaced_in"].fillna(0)

    # PRI proxy: FEMA major disaster declarations as displacement stand-in
    pri_proxy = d["major_dr_declared"].fillna(0)

    disaster_shock = (
        d["max_severity"].fillna(0) +
        d["peak_wind_score"].fillna(0) * 0.3
    )

    n_disp  = norm_col(disp.fillna(0))
    n_risk  = norm_col(d["inform_risk_score"].fillna(d["inform_risk_score"].median()))
    n_cope  = norm_col(d["lack_coping_capacity"].fillna(d["lack_coping_capacity"].median()))
    n_shock = norm_col(disaster_shock)
    n_pri   = norm_col(pri_proxy)

    d["need_score"] = (
        params["w_displacement"]   * n_disp  +
        params["w_inform_risk"]    * n_risk  +
        params["w_coping_gap"]     * n_cope  +
        params["w_disaster_shock"] * n_shock +
        params["w_pri_proxy"]      * n_pri
    )
    return d

df = build_need_scores(df, PARAMS)

# ── Solve per year ────────────────────────────────────────────────────────────
results = {}
summaries = []

for year in sorted(df["year"].unique()):
    ydf = df[df["year"] == year].copy()
    countries = sorted(ydf["iso3"].unique())
    months    = sorted(ydf["month"].unique())
    C = len(countries)
    T = len(months)
    N = C * T

    # index helper
    def idx(ci, ti): return ci * T + ti

    # budget = sum of actual paid flows this year × scalar
    budget = ydf["funding_usd"].sum() * PARAMS["budget_scalar"]
    min_floor   = budget * PARAMS["min_floor_share"]
    max_cap     = budget * PARAMS["max_cap_share"]
    surge_floor = min_floor * PARAMS["surge_multiplier"]

    # need scores as array [C x T]
    need = np.zeros((C, T))
    shock_flag = np.zeros((C, T), dtype=int)
    actual_funding = np.zeros((C, T))

    for ci, c in enumerate(countries):
        for ti, t in enumerate(months):
            row = ydf[(ydf["iso3"] == c) & (ydf["month"] == t)]
            if len(row):
                need[ci, ti] = row["need_score"].values[0]
                actual_funding[ci, ti] = row["funding_usd"].values[0]
                if row["max_severity"].values[0] >= PARAMS["shock_threshold"]:
                    shock_flag[ci, ti] = 1

    # ── LP: maximise sum(need * alloc)  ──────────────────────────────────────
    # scipy linprog minimises, so negate
    c_obj = -need.flatten()

    # Inequality constraints: A_ub @ x <= b_ub
    # 1. Annual budget cap: sum(all) <= budget
    A_ub = [np.ones(N)]
    b_ub = [budget]

    # 2. Per country-month cap: alloc[c,t] <= max_cap
    for ci in range(C):
        for ti in range(T):
            row = np.zeros(N); row[idx(ci,ti)] = 1.0
            A_ub.append(row); b_ub.append(max_cap)

    A_ub = np.array(A_ub)
    b_ub = np.array(b_ub)

    # Bounds: floor <= alloc <= max_cap
    bounds = []
    for ci in range(C):
        for ti in range(T):
            floor = surge_floor if shock_flag[ci, ti] else min_floor
            bounds.append((floor, max_cap))

    res = linprog(
        c_obj,
        A_ub=A_ub, b_ub=b_ub,
        bounds=bounds,
        method="highs"
    )

    if res.status != 0:
        print(f"  WARNING year {year}: solver status {res.status} — {res.message}")

    alloc = res.x.reshape(C, T)

    # Store results
    yr_result = {}
    for ci, c in enumerate(countries):
        yr_result[c] = {}
        for ti, t in enumerate(months):
            month_str = t.strftime("%Y-%m-%d")
            opt = float(alloc[ci, ti])
            act = float(actual_funding[ci, ti])
            yr_result[c][month_str] = {
                "optimal_alloc_usd": round(opt, 2),
                "actual_funding_usd": round(act, 2),
                "need_score": round(float(need[ci, ti]), 6),
                "shock_flag": int(shock_flag[ci, ti]),
                "allocation_delta_usd": round(opt - act, 2),
                "over_under": "over_allocated" if act > opt else "under_allocated"
            }
            # summary row
            row = ydf[(ydf["iso3"] == c) & (ydf["month"] == t)]
            if len(row):
                r = row.iloc[0]
                summaries.append({
                    "iso3": c,
                    "month": month_str,
                    "year": year,
                    "funding_usd": act,
                    "need_score": round(float(need[ci, ti]), 6),
                    "inform_risk_score": r["inform_risk_score"],
                    "displaced_monthly": r["displaced_monthly"],
                    "max_severity": r["max_severity"],
                    "lack_coping_capacity": r["lack_coping_capacity"],
                    "optimal_alloc_usd": round(opt, 2),
                    "shock_flag": int(shock_flag[ci, ti]),
                    "allocation_delta_usd": round(opt - act, 2),
                    "over_under": "over_allocated" if act > opt else "under_allocated"
                })

    results[str(year)] = yr_result
    total_opt = alloc.sum()
    print(f"  {year}: budget=${budget/1e6:.1f}M  optimal_total=${total_opt/1e6:.1f}M  solver={res.message[:30]}")

# ── Write outputs ─────────────────────────────────────────────────────────────
with open(OUT / "allocation_results.json", "w") as f:
    json.dump(results, f, indent=2)

summ_df = pd.DataFrame(summaries)
summ_df.to_csv(OUT / "optimization_summary.csv", index=False)

need_df = df[["iso3","month","year","need_score","displaced_monthly",
              "inform_risk_score","lack_coping_capacity","max_severity",
              "peak_wind_score","funding_usd"]].copy()
need_df["month"] = need_df["month"].dt.strftime("%Y-%m-%d")
need_df.to_csv(OUT / "need_scores.csv", index=False)

print("\n=== DONE ===")
print(f"  allocation_results.json: {len(results)} years")
print(f"  optimization_summary.csv: {len(summ_df)} rows")
print(f"  need_scores.csv: {len(need_df)} rows")

# ── Quick summary table ───────────────────────────────────────────────────────
print("\n=== 6-YEAR ACTUAL vs OPTIMAL (USD millions) ===")
agg = summ_df.groupby("iso3")[["funding_usd","optimal_alloc_usd"]].sum() / 1e6
agg["delta"] = agg["optimal_alloc_usd"] - agg["funding_usd"]
agg.columns = ["actual_$M", "optimal_$M", "delta_$M"]
print(agg.sort_values("delta_$M").round(1).to_string())
print(f"\nTotal actual:  ${summ_df['funding_usd'].sum()/1e6:.1f}M")
print(f"Total optimal: ${summ_df['optimal_alloc_usd'].sum()/1e6:.1f}M")