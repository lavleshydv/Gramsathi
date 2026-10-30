# 🔒 GramSathi AI — Privacy, Security & Data Retention Specification

**Document Version:** 1.0.0  
**Regulatory Framework:** Digital Personal Data Protection (DPDP) Act, 2023 (India)  
**Classification:** Sensitive Identity & Welfare Documentation Governance  

---

## 1. Compliance Principles & DPDP Act Alignment

GramSathi AI processes sensitive identity documents (Aadhaar cards, Caste Certificates, Marksheets, Income Certificates). The platform strictly enforces four core privacy principles:

1. **Purpose Limitation**: Document data is processed exclusively for preparing the specific government scheme application initiated by the applicant. Secondary analytics or model training on raw citizen documents is strictly prohibited.
2. **Data Minimization**: Only the specific fields required by the statutory scholarship rules are extracted and persisted. Irrelevant document sections are discarded immediately following OCR segmentation.
3. **Storage Limitation & Right to Erasure**: Citizens retain full ownership of their data. Calling the deletion API immediately triggers a cryptographic hard purge of document files and associated evidence records.
4. **Explicit Verifiable Consent**: Every session captures timestamped, explicit digital consent prior to document ingestion.

---

## 2. Aadhaar & Sensitive Identity Protection

Under Indian Supreme Court rulings and UIDAI guidelines:
- **No Raw Aadhaar Storage**: GramSathi AI **never** stores the full 12-digit Aadhaar number in plain text, database columns, or logs.
- **Client-Side / Ingestion Masking**: The system extracts only the last 4 digits (e.g. `XXXX-XXXX-1234`) or the 16-digit Virtual ID (VID) where identity verification is mandatory.
- **Biometrics Prohibited**: Fingerprint scans, iris scans, and biometric modalities are never accepted or processed by the system.

---

## 3. Storage Architecture & Encryption

- **Private Encrypted Object Storage**: Uploaded files are saved to an isolated storage tier outside the public web server directory.
- **Encryption at Rest**: All persisted documents and database records utilize AES-256 encryption.
- **Encryption in Transit**: All communication between the Flutter mobile client and FastAPI backend requires TLS 1.3 (HTTPS / WSS).
- **Pre-Signed Ephemeral Access**: File viewing links provided to the citizen during the review flow expire after exactly 15 minutes.

---

## 4. Document Purge & Retention Schedule

| Data Category | Retention Period | Purge Trigger | Destruction Method |
| :--- | :--- | :--- | :--- |
| **Uploaded Binary Files (PDF/JPG)** | Maximum 72 hours (or on session close) | User deletes document OR Session expires | Overwrite with zeros and unlink inode (`shred`) |
| **Field Evidence Nodes** | Retained during active draft lifecycle | Application draft completed or deleted | Cascade delete in PostgreSQL |
| **Audit Logs** | 180 days (Statutory compliance) | Automated retention cron worker | Pseudonymized export to cold audit archive |
