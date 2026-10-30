# 📂 GramSathi AI — Synthetic Document Test Fixtures

This directory houses the controlled synthetic test dataset utilized for evaluating OCR accuracy, field provenance, and cross-document reconciliation.

## Privacy & Ethical Standards
Under the Digital Personal Data Protection (DPDP) Act, 2023, **no real citizen identity documents, real Aadhaar cards, or real bank account numbers may ever be placed in this repository**. All documents in this directory are fictional, synthetic constructs.

## Dataset Test Cases

| Dataset ID | Document Type | Injected Scenario | Purpose | Fixture File |
| :--- | :--- | :--- | :--- | :--- |
| **`CASE_01_HAPPY_PATH`** | Aadhaar + Class 12 Marksheet + Income Cert | Clean scans, 100% consistent names, dates, and numbers. | Verifies baseline auto-reconciliation and immediate draft eligibility. | [`CASE_01_HAPPY_PATH.json`](./synthetic-documents/CASE_01_HAPPY_PATH.json) |
| **`CASE_02_NAME_VARIATION`** | Aadhaar (`Yash Sharma`) + Marksheet (`Yash S Sharma`) | Minor spelling / initial variation. | Verifies detection of `SPELLING_OR_TRANSLITERATION_VARIATION` and user review trigger. | [`CASE_02_NAME_VARIATION.json`](./synthetic-documents/CASE_02_NAME_VARIATION.json) |
| **`CASE_03_LOW_CONFIDENCE`** | Blurry Income Certificate scan | Incomplete glyphs, low OCR confidence score (< 0.70). | Verifies that low OCR confidence triggers `NEEDS_REVIEW` and prompts manual user confirmation. | [`CASE_03_LOW_CONFIDENCE.json`](./synthetic-documents/CASE_03_LOW_CONFIDENCE.json) |
| **`CASE_04_CONTRADICTION`** | Marksheet (`DOB: 12/04/2005`) vs Aadhaar (`DOB: 15/08/2004`) | Material contradiction on statutory age attribute. | Verifies detection of `MATERIAL_CONTRADICTION` and hard blocking of draft generation. | [`CASE_04_CONTRADICTION.json`](./synthetic-documents/CASE_04_CONTRADICTION.json) |
| **`CASE_05_INCOME_CEILING`** | Income Certificate (`₹3,20,000`) | Exceeds scholarship statutory income ceiling of ₹2,50,000. | Verifies that dependency-aware validation flags statutory ineligibility. | [`CASE_05_INCOME_CEILING.json`](./synthetic-documents/CASE_05_INCOME_CEILING.json) |

The complete field specification and multi-source mappings are defined in [`field_evidence_matrix.json`](./synthetic-documents/field_evidence_matrix.json).
