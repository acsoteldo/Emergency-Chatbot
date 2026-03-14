# Resource Allocation Optimization Under Climate Stress Scenarios
Data-driven dashboard and NLP chatbot for humanitarian funding gaps and climate risk optimization across the Caribbean & Central America (2019–2024).

## Getting Started: 
1. Report and presentation
2. data/: Contains cleaned datasets used for the analysis and model development (LP optimization)
3. notebooks/: Python pipeline for data cleaning
5. frontend/: Dashboard with embedded chatbot
6. api/: FastAPI backend serving allocation, sector, displacement, and risk endpoints
7. assets/: chatbot and datasets logos
8. webscrape/: for FTS country-level data

### Tools:
Python, FastAPI, pandas, scipy (HiGHS solver), Chart.js, Leaflet.js, HTML/CSS/JS

### Data Sources:
This project integrates four humanitarian and climate datasets, standardized at the country-month level across 17 Caribbean and Central American countries:
* EM-DAT International Disaster Database [^1] — disaster events, deaths, and people affected by hazard type
* Data Source: NOAA IBTrACS — Hurricane Tracks [^2]
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
* Haiti is the most severely underfunded country in the region, receiving ~$580M less than its need-weighted optimal allocation over the study period
* Northern Triangle and R4V corridor countries (Honduras, Panama, Costa Rica) show systematic over-funding relative to need due to migration-driven donor attention
* The LP model identifies a reallocation of ~$1.2B that would reduce the regional funding gap by 38% without increasing total expenditure

### Demo

### Demo (2022, good ol'times)
https://user-images.githubusercontent.com/76544489/205655200-820dcf9b-dd2b-41b9-ad94-3646f190b370.mov

## Next Steps
* Expand the dataset beyond 2024 as new FTS and EM-DAT records become available, and automate the ingestion pipeline to keep the optimization model current with each funding cycle.
* Incorporate additional vulnerability dimensions into the LP model (including food insecurity indices, healthcare access, and climate projections) to produce a more granular need-weighted allocation baseline.
* Engage humanitarian practitioners and donor organizations to validate the optimization outputs against field-level knowledge, and surface any structural constraints the model does not currently capture.
* Extend the analysis to sub-national levels for the highest-need countries, particularly Haiti, where country-level aggregation masks significant internal disparities in risk and resource access.
* Publish the dataset, model, and methodology as an open resource for researchers, NGOs, and policy analysts working on climate-humanitarian linkages in the Caribbean and Central America.

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
