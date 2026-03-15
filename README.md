# Resource Allocation Optimization Under Climate Stress Scenarios
Data-driven dashboard and NLP chatbot for humanitarian funding gaps and climate risk optimization across the Caribbean & Central America (2019–2024).

> Disclaimer: This project is an independent academic analysis intended for portfolio and research purposes only. Funding figures, optimal allocations, and gap estimates are derived from publicly available datasets and a linear programming model. They do not represent official positions of OCHA, UNHCR, EM-DAT, INFORM, or any humanitarian organization. Data limitations are documented in the Data Notes section. This model should not be used as a basis for operational funding decisions.

## Getting Started: 
1. Report and presentation
2. data/: Contains cleaned datasets used for the analysis and model development (LP optimization)
3. notebooks/: Python pipeline for data cleaning
5. frontend/: Dashboard with embedded chatbot
6. api/: FastAPI backend serving allocation, sector, displacement, and risk endpoints
7. assets/: chatbot and datasets logos
8. webscrape/: for FTS country-level data

### Tools:
Python, FastAPI, pandas, scipy (HiGHS solver), HTML/CSS/JS

### Data Sources:
This project integrates four humanitarian and climate datasets, standardized at the country-month level across 17 Caribbean and Central American countries:
* EM-DAT International Disaster Database [^1] — disaster events, deaths, and people affected by hazard type
* NOAA IBTrACS — Hurricane Tracks [^2]
* UNHCR Refugee Data Finder [^3] — bilateral displacement flows, refugee populations, and asylum seekers
* R4V — Venezuelan Flow Data by Destination Country [^4]
* INFORM Risk Index [^5] — composite country-level risk scores covering hazard exposure, vulnerability, and coping capacity
* OCHA Financial Tracking Service (FTS) [^6] — humanitarian funding flows, donor organizations, and sector-level allocations
* FEMA OpenFEMA — Puerto Rico Supplement [^7]

All datasets are joined at the iso3 country code level and aggregated by year. The master dataset covers 17 countries × 6 years with fields including:
* iso3: ISO 3166-1 alpha-3 country code. Join key.
* actual_usd: Total humanitarian funding received (USD millions)
* optimal_usd: LP-estimated optimal allocation based on need-weighted distribution
* delta_usd: Funding gap (positive = underfunded, negative = overfunded)
* inform_risk: INFORM composite risk score (0–10)
* disaster_deaths: EM-DAT reported deaths by disaster event
* displaced_total: UNHCR total displaced population (outflows + inflows)
* sector_breakdown: FTS funding by sector (food security, protection, shelter, health, etc.)

## Problem Definition
Although the Caribbean and Central America are among the most climate-exposed regions in the world, humanitarian funding is unevenly distributed across countries. Many nations face compounding crises driven by overlapping hazard exposure, fragile institutions, and chronic displacement yet receive funding that bears little relationship to their actual need.

### Relevance:
Understanding how humanitarian funding gaps translate into real outcomes at the country level matters for several reasons:
* Donors and multilateral agencies need country-level evidence on where funding shortfalls intersect with high climate risk and social fragility to move beyond reactive, crisis-driven allocation toward proactive, need-weighted distribution.
* Humanitarian planners and NGOs can use the optimization model to stress-test budget scenarios, identify which countries absorb disproportionate cuts under funding constraints, and make the case for rebalancing sector priorities.
* Policy researchers and economists working on climate-humanitarian linkages can use the integrated dataset (spanning disaster exposure, displacement, risk scores, and funding flows) to build more rigorous models of how climate shocks propagate into humanitarian need.
* Advocacy and accountability organizations can leverage the funding gap estimates to document which countries are systematically under-resourced relative to their vulnerability, and to hold donors accountable to need-based allocation principles.

## Hypothesis
Countries receiving humanitarian funding below their need-weighted optimal allocation (particularly those with high INFORM risk scores, recurring disaster exposure, and limited institutional coping capacity) experience compounding resource gaps that deepen vulnerability over time. 

## Vision
To strengthen humanitarian decision-making by making the relationship between climate risk and funding allocation visible, quantifiable, and actionable so that resources reach the countries that need them most.

## Objective
The primary objective of this analysis is to build a rigorous, data-driven understanding of how humanitarian funding is distributed across the Caribbean and Central America relative to actual climate and vulnerability need. By integrating displacement, disaster, risk, and funding data and applying linear programming optimization, this project aims to:
* Map actual versus optimal humanitarian funding across 17 countries to identify where allocation gaps are largest and most consequential given underlying risk profiles.
* Examine how climate hazard exposure, displacement pressure, and institutional fragility interact at the country level to shape humanitarian need and where current donor behavior diverges from that need.
* Quantify the regional funding gap using a linear programming model that estimates optimal allocation under realistic budget and sector constraints, producing a country-level delta between what is received and what is warranted.
* Identify the countries where underfunding and high climate risk intersect most severely, providing an evidence base for reallocation advocacy, donor strategy, and humanitarian planning across the region.

## Review of the Literature
Research on humanitarian resource allocation consistently finds that funding is driven by donor political priorities and media visibility as much as by measurable need. The literature identifies three groups of factors that influence aid allocations: needs in recipient countries, donor interests, and agenda-setting driven by media coverage [^8]. Recent work applies multi-criteria decision analysis (MCDA) using INFORM Severity data to prioritize funding across fragile countries, finding systematic misalignment, with countries like DRC and Myanmar under-assessed for need while Ukraine and Syria receive disproportionate support. The IFRC's World Disasters Report documents that climate and disaster risk funding does not consistently prioritize the highest-risk countries. Many highly vulnerable nations receive little adaptation support despite acute exposure [^9]. For the Caribbean specifically, finance is identified as the binding constraint on climate adaptation, closely interacting with governance and capacity limitations that create compounding barriers for the most vulnerable SIDS [^10]. This project builds on these findings by applying linear programming optimization to the Caribbean and Central America, producing country-level funding gap estimates grounded in INFORM, FTS, EM-DAT, and UNHCR data.

## Key Insights
* Despite the highest composite need score in the region across all six years, Haiti received $1.02B against a model-optimal $1.60B. The gap of $581M represents 21% of the entire regional budget left undeployed where it was most needed.
* Honduras, Panama, and Costa Rica together received $575M more than their need scores justify. Donor priorities around migration management systematically displaced acute humanitarian investment.
* As a US territory, Puerto Rico is excluded from UNHCR and OCHA coverage. The model estimates $32.6M in unmet need over six years. US territorial status creates a structural blind spot in global humanitarian architecture.
* The LP model identifies a reallocation of ~$1.2B that would reduce the regional funding gap by 38% without increasing total expenditure

## Ávila Chatbot
Rule-based NLP chatbot with 24 intents across 4 languages (English, Spanish, French, Haitian Creole). Data responses are powered by live API calls to the FastAPI backend (no hardcoded answers).

### Intents include:
| Intent | Type | API Endpoint |
| --- | --- | --- |
| `allocation` | Data | `GET /allocation/summary` |
| `top_funders` | Data | `GET /orgs?iso3=` |
| `sectors` | Data | `GET /sectors?iso3=` |
| `deadliest` | Data | `GET /disasters/most-common?iso3=` |
| `natural_disaster` | Data | `GET /disasters?iso3=&year=` |
| `recurrence_risk` | Data | `GET /recurrence-risk` |
| `displacement_out` | Data | `GET /displacement/outflows?iso3=` |
| `displacement_in` | Data | `GET /displacement/inflows?iso3=` |
| `trend` | Data | `GET /allocation?iso3=&year=` |
| `compare` | Data | `GET /allocation/summary` × 2 |
| `health` | Data | `GET /sectors/orgs?iso3=&sector=Health` |
| `food` | Data | `GET /sectors/orgs?iso3=&sector=Food+Security` |
| `water` | Data | `GET /sectors/orgs?iso3=&sector=WASH` |
| `shelter` | Data | `GET /sectors/orgs?iso3=&sector=Emergency+Shelter` |
| `hygiene` | Data | `GET /sectors/orgs?iso3=&sector=WASH` |
| `education` | Data | `GET /sectors/orgs?iso3=&sector=Education` |
| `feelings` | Support | — |
| `isolated` | Support | — |
| `crisis` | Support | — |
| `emergency` | Support | — |
| `pet` | Support | — |
| `meta_languages` | Meta | — |
| `meta_countries` | Meta | — |
| `meta_sources` | Meta | — |

### Other features:
* Automatic language detection
* Tracks country, language, and step across turns without a backend session
* Single message fires multiple intents sequentially and returns combined responses
* High-priority intents skip triage entirely, reducing latency for direct queries
* Detects distress language and routes to support responses before any data intent fires

<img width="2844" height="1552" alt="Image" src="https://github.com/user-attachments/assets/0a459ad4-8ff2-46e2-b9ce-8e378db14dc8" />
<img width="2844" height="1550" alt="Image" src="https://github.com/user-attachments/assets/0b7c6428-b9e2-4b6d-8350-d9b40e7eb9cf" />

### Demo
https://github.com/user-attachments/assets/01e756da-3822-4d77-af2c-1d560b7e60bb

### Demo (2022, good ol'times)
https://user-images.githubusercontent.com/76544489/205655200-820dcf9b-dd2b-41b9-ad94-3646f190b370.mov

## Next Steps
* Expand the dataset beyond 2024 as new FTS and EM-DAT records become available, and automate the ingestion pipeline to keep the optimization model current with each funding cycle.
* Extend the model to 20 countries by incorporating Colombia, Venezuela, and Mexico using UNHCR internal displacement stock data, reframing the budget constraint to reflect the full humanitarian envelope of the displacement corridor from Caracas through the Caribbean and Central America.
* Replace Ávila's rule-based regex intent detection with a trained text classifier (spaCy or fine-tuned BERT) to improve robustness on typos, mixed-language inputs, and phrasing variations across all 24 intents and 4 languages.
* Engage humanitarian practitioners and donor organizations to validate the optimization outputs against field-level knowledge, and surface any structural constraints the model does not currently capture.
* Publish the dataset, model, and methodology as an open resource for researchers, NGOs, and policy analysts working on climate-humanitarian linkages in the Caribbean and Central America.

## Data Notes & Limitations
* Study Window (2019–2024): Chosen to align with consistent FTS reporting and R4V displacement data. 2025 is excluded. All four source datasets publish on an annual lag and current-year figures remain incomplete until mid-to-late the following year.
* OCHA FTS: Voluntary reporting means smaller NGOs and bilateral transfers are frequently missing. Committed and paid figures are used interchangeably by some reporters, introducing noise in the actual vs. optimal gap calculations.
* UNHCR Displacement: Ten countries (BHS, BLZ, BRB, CUB, HTI, JAM, NIC, PRI, SLV, SUR) use annual totals divided by 12, a flat monthly baseline with no within-year variation. Panama's Darien Gap transit population is largely absent from UNHCR statistics, likely underestimating its operational burden. R4V figures may undercount irregular flows through the same corridor.
* INFORM Risk Index: Forward-filled from 2021 through 2024. Does not reflect post-2021 structural changes. A meaningful gap for Haiti after the Moise assassination and the Bahamas post-Dorian.
* EM-DAT: Records without a start month are assigned to June by convention. Monthly shock precision is reduced but the annual signal is preserved. Smaller events below reporting thresholds are undercounted.
* NOAA IBTrACS: Used for peak wind scores and landfall counts. Inland wind decay is not modeled. Storm impact may be understated for Haiti and Guatemala.
* Country Selection: The 17-country scope follows OCHA's Latin America and Caribbean humanitarian response cluster. Guyana and Suriname are included despite their South American geography because both appear consistently in FTS flows and absorb significant Venezuelan displacement tracked under R4V. 
* Puerto Rico: Excluded from UNHCR and FTS as a US territory. Federal disaster spending doesn't appear in international humanitarian tracking. FEMA disaster declarations are used as a proxy. Estimated $32.6M in unmet need over six years.
* Colombia and Venezuela: Excluded by design. Origin and transit countries whose conflict-driven funding profiles would distort the need score weighting applied to destination-country recipients.
* Mexico: Excluded by design. A transit and destination country with lower INFORM scores and FTS flows skewed toward development rather than emergency response. Corridor pressure is captured upstream through Colombia and Venezuela.
* LP Model: The need score is a weighted combination of proxy variables. Weights reflect analytical judgment, not empirically validated parameters. The optimal allocation is what the data implies, not a prescription for donor behavior.

## Contact
For any inquiries or feedback, please contact acsoteldo01@gmail.com.

## References
[^1]: Data Source: EM-DAT
https://www.emdat.be/

[^2]: Data Source: NOAA IBTrACS — Hurricane Tracks
https://www.ncei.noaa.gov/products/international-best-track-archive

[^3]: Data Source: UNHCR Annual Displacement Stocks
https://www.unhcr.org/refugee-statistics/download/

[^4]: Data Source: R4V — Venezuelan Flow Data by Destination Country
https://data.humdata.org/organization/r4v

[^5]: Data Source: INFORM Risk Index
https://drmkc.jrc.ec.europa.eu/inform-index/INFORM-Risk/Results-and-data

[^6]: Data Source: OCHA FTS — Humanitarian Funding Flows
https://fts.unocha.org/global-funding/countries/2019

[^7]: Data Source: FEMA OpenFEMA — Puerto Rico Supplement
https://www.fema.gov/openfema-data-page/disaster-declarations-summaries-v2

[^8]: Prioritising humanitarian aid funding for multi-risk disasters
https://www.sciencedirect.com/science/article/abs/pii/S2212420925005758

[^9]: Tackling the humanitarian impacts of the climate crisis
https://www.ifrc.org/sites/default/files/2021-09/IFRC_WDR_ExecutiveSummary_EN_Web.pdf

[^10]: Interacting adaptation constraints in the Caribbean
https://www.sciencedirect.com/science/article/pii/S2212096323000098
