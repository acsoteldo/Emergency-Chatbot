"""
api.py — Climate-Humanitarian Resource Optimization API
Serves the landing page dashboard and chatbot.

Install:
    pip install fastapi uvicorn pandas

Run locally:
    uvicorn api:app --reload --port 8000
    Run the command from the same directory where api.py lives

Docs:
    http://localhost:8000/docs
"""

from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import pandas as pd
import numpy as np
from pathlib import Path

# ── Paths — update for local use ─────────────────────────────────────────────
DATA = Path("/data")
INTERIM   = DATA / "interim"
PROCESSED = DATA / "processed"

app = FastAPI(
    title="Climate-Humanitarian Resource Optimization API",
    description="Serves allocation results, need scores, displacement flows, and humanitarian funding data for Caribbean and Central America (2019–2024).",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten for production
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Load data at startup ──────────────────────────────────────────────────────
print("Loading data...")

summary    = pd.read_csv(PROCESSED / "optimization_summary.csv")
need       = pd.read_csv(PROCESSED / "need_scores.csv")
master     = pd.read_csv(PROCESSED / "country_month_master.csv")
fts        = pd.read_csv(INTERIM   / "fts_flows_clean.csv")
emdat      = pd.read_csv(INTERIM   / "emdat_country_month.csv")
inflows    = pd.read_csv(INTERIM   / "unhcr_clean_inflows.csv")
outflows   = pd.read_csv(INTERIM   / "unhcr_clean_outflows.csv")

# Normalise ISO3 column name in emdat
if "ISO3" in emdat.columns:
    emdat = emdat.rename(columns={"ISO3": "iso3"})

TIER1 = [
    "BHS","BLZ","BRB","CRI","CUB","DOM","GTM","GUY",
    "HND","HTI","JAM","NIC","PAN","PRI","SLV","SUR","TTO"
]

print("Data loaded ✓")

# ── Helpers ───────────────────────────────────────────────────────────────────
def filter_iso3(df: pd.DataFrame, iso3: Optional[str]) -> pd.DataFrame:
    if iso3:
        iso3 = iso3.upper()
        if iso3 not in df["iso3"].values:
            raise HTTPException(status_code=404, detail=f"iso3 '{iso3}' not found")
        return df[df["iso3"] == iso3]
    return df

def filter_year(df: pd.DataFrame, year: Optional[int]) -> pd.DataFrame:
    if year:
        return df[df["year"] == year]
    return df

def to_records(df: pd.DataFrame) -> list:
    return df.replace({np.nan: None}).to_dict(orient="records")

# ═════════════════════════════════════════════════════════════════════════════
# HEALTH
# ═════════════════════════════════════════════════════════════════════════════
@app.get("/", tags=["Health"])
def root():
    return {"status": "ok", "version": "1.0.0"}

# ═════════════════════════════════════════════════════════════════════════════
# ALLOCATION  (dashboard)
# ═════════════════════════════════════════════════════════════════════════════
@app.get("/allocation", tags=["Allocation"])
def get_allocation(
    iso3: Optional[str] = Query(None, description="Filter by country ISO3 (e.g. HTI)"),
    year: Optional[int] = Query(None, description="Filter by year (2019–2024)"),
):
    """
    Optimal vs actual allocation by country-month.
    Returns: iso3, month, year, funding_usd, optimal_alloc_usd,
             allocation_delta_usd, over_under, need_score, shock_flag.
    """
    df = filter_iso3(summary, iso3)
    df = filter_year(df, year)
    return {"count": len(df), "data": to_records(df)}


@app.get("/allocation/summary", tags=["Allocation"])
def get_allocation_summary(
    year: Optional[int] = Query(None, description="Filter by year"),
):
    """
    6-year (or single year) actual vs optimal totals by country.
    """
    df = filter_year(summary, year)
    agg = (df.groupby("iso3")
             .agg(
                 actual_usd  = ("funding_usd",          "sum"),
                 optimal_usd = ("optimal_alloc_usd",    "sum"),
                 delta_usd   = ("allocation_delta_usd", "sum"),
             )
             .reset_index())
    agg["over_under"] = agg["delta_usd"].apply(
        lambda x: "under_allocated" if x > 0 else "over_allocated"
    )
    agg = agg.sort_values("delta_usd", ascending=False)
    return {"count": len(agg), "data": to_records(agg)}


# ═════════════════════════════════════════════════════════════════════════════
# NEED SCORES  (dashboard)
# ═════════════════════════════════════════════════════════════════════════════
@app.get("/need-scores", tags=["Need Scores"])
def get_need_scores(
    iso3: Optional[str] = Query(None),
    year: Optional[int] = Query(None),
):
    """
    Monthly need scores with contributing components.
    """
    df = filter_iso3(need, iso3)
    df = filter_year(df, year)
    return {"count": len(df), "data": to_records(df)}


@app.get("/recurrence-risk", tags=["Need Scores"])
def get_recurrence_risk():
    """
    Country-level recurrence risk proxy based on compound event frequency,
    INFORM hazard exposure, and lack of coping capacity.
    Higher score = more prone to repeated crises.
    """
    tier1_master = master[master["country_role"] == "tier1"].copy()

    risk = (tier1_master
        .groupby("iso3")
        .agg(
            compound_event_months = ("compound_event", "sum"),
            avg_hazard_exposure   = ("hazard_exposure", "mean"),
            avg_coping_gap        = ("lack_coping_capacity", "mean"),
            avg_inform_risk       = ("inform_risk_score", "mean"),
            total_events          = ("event_count", "sum"),
        )
        .reset_index())

    # Normalise 0-1 and combine
    for col in ["compound_event_months","avg_hazard_exposure","avg_coping_gap","avg_inform_risk"]:
        mn, mx = risk[col].min(), risk[col].max()
        risk[f"{col}_norm"] = (risk[col] - mn) / (mx - mn) if mx > mn else 0.0

    risk["recurrence_risk_score"] = (
        0.30 * risk["compound_event_months_norm"] +
        0.25 * risk["avg_hazard_exposure_norm"]   +
        0.25 * risk["avg_coping_gap_norm"]         +
        0.20 * risk["avg_inform_risk_norm"]
    ).round(4)

    risk = risk.sort_values("recurrence_risk_score", ascending=False)
    return {"count": len(risk), "data": to_records(risk)}


# ═════════════════════════════════════════════════════════════════════════════
# DISASTERS  (dashboard + chatbot)
# ═════════════════════════════════════════════════════════════════════════════
@app.get("/disasters", tags=["Disasters"])
def get_disasters(
    iso3: Optional[str] = Query(None),
    year: Optional[int] = Query(None),
):
    """
    Disaster events by country-month.
    Filters to months with at least one event.
    """
    df = emdat.copy()
    if iso3:
        df = filter_iso3(df, iso3)
    if year:
        df = df[df["year_month"].str.startswith(str(year))]
    df = df[df["event_count"] > 0]
    return {"count": len(df), "data": to_records(df)}


@app.get("/disasters/most-common", tags=["Disasters"])
def get_most_common_disaster(
    iso3: Optional[str] = Query(None, description="Filter by country"),
):
    """
    Most common disaster type(s) per country (or overall).
    Used by chatbot: 'What disaster is most common in Haiti?'
    """
    df = emdat[emdat["event_count"] > 0].copy()
    if iso3:
        df = filter_iso3(df, iso3)

    # Explode pipe-separated disaster_types
    df = df[df["disaster_types"].notna() & (df["disaster_types"] != "")]
    df["disaster_type"] = df["disaster_types"].str.split("|")
    df = df.explode("disaster_type")
    df["disaster_type"] = df["disaster_type"].str.strip()

    agg = (df.groupby(["iso3","disaster_type"])
             .agg(occurrences=("event_count","sum"))
             .reset_index()
             .sort_values(["iso3","occurrences"], ascending=[True,False]))
    return {"count": len(agg), "data": to_records(agg)}


@app.get("/disasters/deadliest", tags=["Disasters"])
def get_deadliest_events(
    iso3: Optional[str] = Query(None),
    top_n: int = Query(5, description="Number of top events to return"),
):
    """
    Events with most deaths and most affected people.
    Used by chatbot: 'What event caused the most deaths in Guatemala?'
    """
    df = emdat[emdat["event_count"] > 0].copy()
    if iso3:
        df = filter_iso3(df, iso3)

    deadliest = (df.nlargest(top_n, "sum_deaths")
                   [["iso3","year_month","disaster_types","sum_deaths","sum_affected"]])
    most_affected = (df.nlargest(top_n, "sum_affected")
                       [["iso3","year_month","disaster_types","sum_deaths","sum_affected"]])

    return {
        "deadliest":      to_records(deadliest),
        "most_affected":  to_records(most_affected),
    }


# ═════════════════════════════════════════════════════════════════════════════
# ORGS & SECTORS  (dashboard + chatbot)
# ═════════════════════════════════════════════════════════════════════════════
@app.get("/orgs", tags=["Funding"])
def get_orgs(
    iso3: Optional[str] = Query(None, description="Filter by destination country"),
    year: Optional[int] = Query(None),
    top_n: int = Query(10),
):
    """
    Top destination orgs by USD for a country.
    Used by chatbot: 'What orgs are active in Haiti?'
    """
    df = fts.copy()
    if iso3:
        df = filter_iso3(df, iso3)
    if year:
        df = filter_year(df, year)

    agg = (df.groupby("dest_org")
             .agg(total_usd=("amount_usd","sum"), flow_count=("amount_usd","count"))
             .reset_index()
             .nlargest(top_n, "total_usd"))
    return {"count": len(agg), "data": to_records(agg)}


@app.get("/donors", tags=["Funding"])
def get_donors(
    iso3: Optional[str] = Query(None, description="Filter by destination country"),
    year: Optional[int] = Query(None),
    top_n: int = Query(10),
):
    """
    Top donor countries by USD for a country.
    Used by chatbot: 'Who funds Haiti?'
    """
    df = fts.copy()
    if iso3:
        df = filter_iso3(df, iso3)
    if year:
        df = filter_year(df, year)

    agg = (df.groupby("source_country")
             .agg(total_usd=("amount_usd","sum"), flow_count=("amount_usd","count"))
             .reset_index()
             .nlargest(top_n, "total_usd"))
    return {"count": len(agg), "data": to_records(agg)}


@app.get("/sectors", tags=["Funding"])
def get_sectors(
    iso3: Optional[str] = Query(None),
    year: Optional[int] = Query(None),
):
    """
    Funding by sector for a country.
    Used by chatbot: 'What food security orgs are active in Honduras?'
    Dashboard: top funded sector by tier1 country.
    """
    df = fts.copy()
    if iso3:
        df = filter_iso3(df, iso3)
    if year:
        df = filter_year(df, year)

    agg = (df.groupby(["iso3","sector"])
             .agg(total_usd=("amount_usd","sum"), flow_count=("amount_usd","count"))
             .reset_index()
             .sort_values(["iso3","total_usd"], ascending=[True,False]))
    return {"count": len(agg), "data": to_records(agg)}


@app.get("/sectors/orgs", tags=["Funding"])
def get_orgs_by_sector(
    iso3: str  = Query(..., description="Country ISO3 (required)"),
    sector: str = Query(..., description="Sector name e.g. 'Food Security'"),
    year: Optional[int] = Query(None),
):
    """
    Orgs active in a specific sector for a country.
    Used by chatbot: 'I need food in Panama — who can help?'
    """
    df = fts.copy()
    df = filter_iso3(df, iso3)
    if year:
        df = filter_year(df, year)

    df = df[df["sector"].str.lower() == sector.lower()]
    if len(df) == 0:
        raise HTTPException(status_code=404, detail=f"No flows found for sector '{sector}' in {iso3}")

    agg = (df.groupby("dest_org")
             .agg(total_usd=("amount_usd","sum"))
             .reset_index()
             .sort_values("total_usd", ascending=False))
    return {"iso3": iso3, "sector": sector, "count": len(agg), "data": to_records(agg)}


# ═════════════════════════════════════════════════════════════════════════════
# DISPLACEMENT  (dashboard + chatbot)
# ═════════════════════════════════════════════════════════════════════════════
@app.get("/displacement/inflows", tags=["Displacement"])
def get_inflows(
    iso3: Optional[str] = Query(None, description="Country receiving displaced people"),
    year: Optional[int] = Query(None),
    top_n: int = Query(10),
):
    """
    Where displaced people in a country come from.
    Used by chatbot: 'Where do people in Costa Rica come from?'
    """
    df = inflows.copy()
    if iso3:
        iso3 = iso3.upper()
        df = df[df["asylum_iso3"] == iso3]
        if len(df) == 0:
            raise HTTPException(status_code=404, detail=f"No inflow data for '{iso3}'")
    if year:
        df = df[df["year"] == year]

    agg = (df.groupby(["asylum_iso3","origin_iso3","country_origin"])
             .agg(total_displaced=("total_displaced_in","sum"))
             .reset_index()
             .sort_values("total_displaced", ascending=False))
    if top_n:
        agg = agg.head(top_n)
    return {"count": len(agg), "data": to_records(agg)}


@app.get("/displacement/outflows", tags=["Displacement"])
def get_outflows(
    iso3: Optional[str] = Query(None, description="Country people are leaving from"),
    year: Optional[int] = Query(None),
    top_n: int = Query(10),
):
    """
    Where displaced people from a country go to.
    Used by chatbot: 'Where do Haitians go when they flee?'
    """
    df = outflows.copy()
    if iso3:
        iso3 = iso3.upper()
        df = df[df["origin_iso3"] == iso3]
        if len(df) == 0:
            raise HTTPException(status_code=404, detail=f"No outflow data for '{iso3}'")
    if year:
        df = df[df["year"] == year]

    agg = (df.groupby(["origin_iso3","asylum_iso3","country_asylum"])
             .agg(total_displaced=("total_displaced_out","sum"))
             .reset_index()
             .sort_values("total_displaced", ascending=False))
    if top_n:
        agg = agg.head(top_n)
    return {"count": len(agg), "data": to_records(agg)}


# ═════════════════════════════════════════════════════════════════════════════
# SCENARIO SIMULATION  (dashboard)
# ═════════════════════════════════════════════════════════════════════════════
@app.post("/scenario", tags=["Scenario"])
def run_scenario(
    budget_scalar:    float = Query(1.0,  description="Multiply actual budget (e.g. 1.2 = +20%)"),
    w_displacement:   float = Query(0.30, description="Weight for displacement (must sum to 1 with others)"),
    w_inform_risk:    float = Query(0.25),
    w_coping_gap:     float = Query(0.25),
    w_disaster_shock: float = Query(0.15),
    w_pri_proxy:      float = Query(0.05),
    year: Optional[int] = Query(None, description="Run for single year only"),
):
    """
    Re-run the LP with custom weights and/or budget scalar.
    Returns allocation summary (actual vs optimal) for the scenario.
    """
    from scipy.optimize import linprog

    weights = [w_displacement, w_inform_risk, w_coping_gap, w_disaster_shock, w_pri_proxy]
    if abs(sum(weights) - 1.0) > 0.01:
        raise HTTPException(status_code=400, detail=f"Weights must sum to 1.0, got {sum(weights):.3f}")

    PARAMS = {
        "w_displacement":   w_displacement,
        "w_inform_risk":    w_inform_risk,
        "w_coping_gap":     w_coping_gap,
        "w_disaster_shock": w_disaster_shock,
        "w_pri_proxy":      w_pri_proxy,
        "budget_scalar":    budget_scalar,
        "shock_threshold":  0.5,
        "min_floor_share":  0.001,
        "max_cap_share":    0.25,
        "surge_multiplier": 3.0,
    }

    df = master[master["country_role"] == "tier1"].copy()
    df["month_dt"] = pd.to_datetime(df["month"])
    df["year"] = df["month_dt"].dt.year
    if year:
        df = df[df["year"] == year]

    def norm_col(s):
        mn, mx = s.min(), s.max()
        return (s - mn) / (mx - mn) if mx > mn else pd.Series(0.0, index=s.index)

    disp = df["displaced_monthly"].copy()
    pan_mask = df["iso3"] == "PAN"
    disp.loc[pan_mask] = df.loc[pan_mask, "unhcr_displaced_in"].fillna(0)
    pri_proxy = df["major_dr_declared"].fillna(0)
    disaster_shock = df["max_severity"].fillna(0) + df["peak_wind_score"].fillna(0) * 0.3

    df["need_score"] = (
        PARAMS["w_displacement"]   * norm_col(disp.fillna(0)) +
        PARAMS["w_inform_risk"]    * norm_col(df["inform_risk_score"].fillna(df["inform_risk_score"].median())) +
        PARAMS["w_coping_gap"]     * norm_col(df["lack_coping_capacity"].fillna(df["lack_coping_capacity"].median())) +
        PARAMS["w_disaster_shock"] * norm_col(disaster_shock) +
        PARAMS["w_pri_proxy"]      * norm_col(pri_proxy)
    )

    results = []
    for yr, ydf in df.groupby("year"):
        countries = sorted(ydf["iso3"].unique())
        months    = sorted(ydf["month_dt"].unique())
        C, T = len(countries), len(months)
        N = C * T

        budget      = ydf["funding_usd"].sum() * PARAMS["budget_scalar"]
        min_floor   = budget * PARAMS["min_floor_share"]
        max_cap     = budget * PARAMS["max_cap_share"]
        surge_floor = min_floor * PARAMS["surge_multiplier"]

        need_arr  = np.zeros((C, T))
        shock_arr = np.zeros((C, T), dtype=int)
        actual_arr= np.zeros((C, T))

        for ci, c in enumerate(countries):
            for ti, t in enumerate(months):
                row = ydf[(ydf["iso3"] == c) & (ydf["month_dt"] == t)]
                if len(row):
                    need_arr[ci, ti]   = row["need_score"].values[0]
                    actual_arr[ci, ti] = row["funding_usd"].values[0]
                    if row["max_severity"].values[0] >= PARAMS["shock_threshold"]:
                        shock_arr[ci, ti] = 1

        c_obj = -need_arr.flatten()
        A_ub  = [np.ones(N)]
        b_ub  = [budget]
        for ci in range(C):
            for ti in range(T):
                row = np.zeros(N); row[ci * T + ti] = 1.0
                A_ub.append(row); b_ub.append(max_cap)

        bounds = [(surge_floor if shock_arr[ci, ti] else min_floor, max_cap)
                  for ci in range(C) for ti in range(T)]

        res = linprog(-need_arr.flatten(), A_ub=np.array(A_ub), b_ub=np.array(b_ub),
                      bounds=bounds, method="highs")

        alloc = res.x.reshape(C, T)
        for ci, c in enumerate(countries):
            results.append({
                "iso3":        c,
                "year":        int(yr),
                "actual_usd":  float(actual_arr[ci].sum()),
                "optimal_usd": float(alloc[ci].sum()),
                "delta_usd":   float(alloc[ci].sum() - actual_arr[ci].sum()),
            })

    out = pd.DataFrame(results).groupby("iso3").agg(
        actual_usd  = ("actual_usd",  "sum"),
        optimal_usd = ("optimal_usd", "sum"),
        delta_usd   = ("delta_usd",   "sum"),
    ).reset_index().sort_values("delta_usd", ascending=False)

    return {
        "params": PARAMS,
        "count":  len(out),
        "data":   to_records(out),
    }