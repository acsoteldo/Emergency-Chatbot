"""
Fetches humanitarian funding flows from the OCHA FTS v1 API for all 19 project
countries, 2019–2024.

All 12 fields match exactly what the FTS website shows:
  Flow ID, Source org., Source Country, Destination org., Destination Country,
  Description, Sector, Amount (US$), Funding status, Boundary,
  Destination usage year, Flow date

Field mapping (JSON → CSV column):
  id                                        → flow_id
  sourceObjects[type=Organization].name     → source_org
  sourceObjects[type=Location].name         → source_country
  destinationObjects[type=Organization].name→ dest_org
  destinationObjects[type=Location].name    → dest_country
  description                               → description
  destinationObjects[type=GlobalCluster].name → sector
  amountUSD                                 → amount_usd
  status                                    → funding_status
  boundary                                  → boundary
  destinationObjects[type=UsageYear].name   → dest_usage_year
  date[:10]                                 → flow_date

───────────────────────────────────────────────────────────────────────────────
"""

import requests
import pandas as pd
import time
from pathlib import Path

# ── Config ────────────────────────────────────────────────────────────────────
OUT = Path("/data/raw")
OUT.mkdir(parents=True, exist_ok=True)

# If HTTP 401: email ocha-hpc@un.org for a free API key, then set:
# AUTH = ("your_client_id", "your_password")
AUTH = None

# ── Country IDs — verified from fts.unocha.org/countries/{ID}/flows/YEAR ─────
COUNTRIES = {
    "BHS": 17,   # Bahamas
    "BLZ": 23,   # Belize
    "BRB": 20,   # Barbados
    "COL": 49,   # Colombia
    "CRI": 54,   # Costa Rica
    "CUB": 57,   # Cuba
    "DOM": 64,   # Dominican Rep.
    "SLV": 67,   # El Salvador
    "GTM": 91,   # Guatemala
    "GUY": 95,   # Guyana
    "HTI": 96,   # Haiti
    "HND": 99,   # Honduras
    "JAM": 111,  # Jamaica
    "NIC": 161,  # Nicaragua
    "PAN": 172,  # Panama
    "PRI": 180,  # Puerto Rico
    "SUR": 213,  # Suriname
    "TTO": 227,  # Trinidad & Tobago
    "VEN": 242,  # Venezuela
}

YEARS = [2019, 2020, 2021, 2022, 2023, 2024]

BASE = "https://api.hpc.tools/v1/public/fts/flow"


# ── Helpers ───────────────────────────────────────────────────────────────────
def extract_obj(objects, obj_type):
    """
    Extract the name from a sourceObjects or destinationObjects list
    by matching the 'type' field. Returns first match as string.
    Known types: Organization, Location, UsageYear, GlobalCluster,
                 Emergency, Plan, Project
    """
    for o in objects:
        if o.get("type") == obj_type:
            return o.get("name", "")
    return ""


def parse_flow(flow, iso3):
    """
    Flatten one raw flow dict into the 12 website-equivalent fields
    plus iso3 for downstream joining.
    """
    src  = flow.get("sourceObjects", [])
    dest = flow.get("destinationObjects", [])

    return {
        "iso3":           iso3,
        "flow_id":        flow.get("id"),
        "source_org":     extract_obj(src,  "Organization"),
        "source_country": extract_obj(src,  "Location"),
        "dest_org":       extract_obj(dest, "Organization"),
        "dest_country":   extract_obj(dest, "Location"),
        "description":    str(flow.get("description", ""))[:300],
        "sector":         extract_obj(dest, "GlobalCluster"),
        "amount_usd":     flow.get("amountUSD"),
        "funding_status": flow.get("status"),               # "paid" | "commitment"
        "boundary":       flow.get("boundary"),             # "incoming" | "internal" | "outgoing"
        "dest_usage_year":extract_obj(dest, "UsageYear"),
        "flow_date":      (flow.get("date") or "")[:10],    # "YYYY-MM-DD"
    }


# ── Fetch ─────────────────────────────────────────────────────────────────────
def fetch_flows(iso3, country_id, year):
    """
    Fetch all flows for a country-year with pagination.
    Returns list of raw flow dicts, or None on auth error.
    """
    params = {
        "locationID": country_id,
        "year":       year,
        "limit":      500,
        "page":       1,
    }

    all_flows = []
    while True:
        try:
            r = requests.get(
                BASE, params=params, timeout=30,
                auth=AUTH if AUTH else None
            )
        except requests.exceptions.RequestException as e:
            print(f"network error: {e}")
            return []

        if r.status_code == 401:
            print(f"\n  HTTP 401 — authentication required.")
            print(f"  Email ocha-hpc@un.org for a free API key.")
            print(f"  Then set AUTH = ('client_id', 'password') at the top of this script.")
            return None

        if r.status_code == 404:
            print(f"no data")
            return []

        if r.status_code != 200:
            print(f"HTTP {r.status_code}")
            return []

        data  = r.json()
        flows = data.get("data", {}).get("flows", [])
        if not flows:
            break

        all_flows.extend(flows)

        # Pagination — stop when we have everything or page is short
        total = data.get("data", {}).get("total")
        if total is not None and len(all_flows) >= int(total):
            break
        if len(flows) < params["limit"]:
            break

        params["page"] += 1
        time.sleep(0.3)

    return all_flows


# ── Main ──────────────────────────────────────────────────────────────────────
def main():
    all_rows   = []
    auth_error = False

    print("=" * 55)
    print("FTS FLOWS FETCH — 19 countries x 6 years")
    print("=" * 55)

    for iso3, country_id in COUNTRIES.items():
        for year in YEARS:
            print(f"  {iso3} ({country_id}) {year} ... ", end="", flush=True)

            flows = fetch_flows(iso3, country_id, year)

            if flows is None:
                auth_error = True
                break

            print(f"{len(flows)} flows")
            for f in flows:
                all_rows.append(parse_flow(f, iso3))

            time.sleep(0.5)

        if auth_error:
            break

    if not all_rows:
        print("\nNo data fetched — check errors above.")
        return

    df = pd.DataFrame(all_rows)
    out_path = OUT / "fts_flows_raw.csv"
    df.to_csv(out_path, index=False)

    print(f"\n{'=' * 55}")
    print(f"Total flows:        {len(df):,}")
    print(f"Output:             {out_path}")

    print(f"\nFlows by country:")
    print(df.groupby("iso3").size().sort_values(ascending=False).to_string())

    print(f"\nFunding status breakdown:")
    print(df["funding_status"].value_counts().to_string())

    print(f"\nBoundary breakdown:")
    print(df["boundary"].value_counts().to_string())

    print(f"\nSector breakdown (top 15):")
    sectors = df[df["sector"] != ""]["sector"]
    if len(sectors):
        print(sectors.value_counts().head(15).to_string())
    else:
        print("  (no sector tags found)")

    tagged_pct = (df["sector"] != "").mean() * 100
    print(f"\n  {tagged_pct:.1f}% of flows have a sector tag")


if __name__ == "__main__":
    main()