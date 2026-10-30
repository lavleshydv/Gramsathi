# 📡 GramSathi AI — REST API Contract Specification

**Document Version:** 1.0.0  
**Base URL:** `/v1`  
**Authentication:** Bearer Session Token (`Authorization: Bearer <session_token>`)  
**Data Format:** `application/json` (Multipart for document uploads)  

---

## 1. Session & Consent Management

### 1.1 Create Session
- **Endpoint:** `POST /v1/sessions`
- **Request Body:**
  ```json
  {
    "device_fingerprint": "android_pixel_7a_a1b2",
    "preferred_locale": "hi",
    "dpdp_consent": {
      "consent_granted": true,
      "purpose": "GOVERNMENT_APPLICATION_PREPARATION",
      "timestamp": "2026-10-30T10:00:00Z"
    }
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "session_id": "ses_7f8a9b1c-3d2e-4f5a-8b9c-1d2e3f4a5b6c",
    "token": "gs_sess_token_xyz123...",
    "expires_at": "2026-10-30T14:00:00Z"
  }
  ```

---

## 2. Application Draft Management

### 2.1 Create Application Draft
- **Endpoint:** `POST /v1/drafts`
- **Request Body:**
  ```json
  {
    "service_id": "SCHOLARSHIP_POST_MATRIC_2026"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "draft_id": "dft_1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d",
    "service_id": "SCHOLARSHIP_POST_MATRIC_2026",
    "rule_version": "1.0",
    "status": "DRAFT_INIT",
    "required_documents": [
      "AADHAAR",
      "MARKSHEET_CLASS_12",
      "INCOME_CERTIFICATE"
    ],
    "required_fields": [
      "full_name",
      "date_of_birth",
      "annual_income",
      "percentage",
      "category"
    ]
  }
  ```

### 2.2 Patch Application Fields (Manual Entry / Override)
- **Endpoint:** `PATCH /v1/drafts/{id}/fields`
- **Request Body:**
  ```json
  {
    "fields": {
      "full_name": "Yash Sharma",
      "date_of_birth": "2005-04-12",
      "annual_income": "120000",
      "percentage": "82.5"
    }
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "draft_id": "dft_1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d",
    "updated_fields_count": 4,
    "status": "IN_PROGRESS"
  }
  ```

### 2.3 Retrieve Draft Summary & Readiness
- **Endpoint:** `GET /v1/drafts/{id}/summary`
- **Response (200 OK):**
  ```json
  {
    "draft_id": "dft_1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d",
    "service_id": "SCHOLARSHIP_POST_MATRIC_2026",
    "status": "REVIEW_PENDING",
    "readiness_score": 0.80,
    "is_eligible_for_draft": false,
    "blocking_issues_count": 1,
    "fields": [
      {
        "field_key": "full_name",
        "value": "Yash Sharma",
        "reliability_status": "NEEDS_REVIEW",
        "evidence_sources_count": 2,
        "conflict_flag": true
      },
      {
        "field_key": "annual_income",
        "value": "120000",
        "reliability_status": "USER_CONFIRMED",
        "evidence_sources_count": 1,
        "conflict_flag": false
      }
    ]
  }
  ```

---

## 3. Document Management & OCR Extraction

### 3.1 Upload Document
- **Endpoint:** `POST /v1/drafts/{id}/documents`
- **Content-Type:** `multipart/form-data`
- **Form Data:**
  - `document_type`: `"INCOME_CERTIFICATE"`
  - `file`: `<binary PDF/JPG/PNG>`
- **Response (201 Created):**
  ```json
  {
    "document_id": "doc_9z8y7x6w-5v4u-3t2s-1r0q-9p8o7n6m5l4k",
    "document_type": "INCOME_CERTIFICATE",
    "file_name": "income_cert.pdf",
    "page_count": 1,
    "sha256_checksum": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "uploaded_at": "2026-10-30T10:05:00Z"
  }
  ```

### 3.2 Trigger OCR Extraction
- **Endpoint:** `POST /v1/documents/{id}/extract`
- **Response (200 OK):**
  ```json
  {
    "document_id": "doc_9z8y7x6w-5v4u-3t2s-1r0q-9p8o7n6m5l4k",
    "engine_used": "TESSERACT_5",
    "extracted_fields_count": 3,
    "candidates": [
      {
        "field_key": "annual_income",
        "raw_text": "Rs. 1,20,000/-",
        "normalized_value": "120000",
        "confidence": 0.94,
        "page_number": 1,
        "bounding_box": { "x": 140, "y": 280, "width": 180, "height": 30 }
      }
    ]
  }
  ```

---

## 4. Evidence Intelligence & Reconciliation

### 4.1 Trigger Cross-Document Reconciliation
- **Endpoint:** `POST /v1/drafts/{id}/reconcile`
- **Response (200 OK):**
  ```json
  {
    "draft_id": "dft_1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d",
    "reconciliation_status": "COMPLETED",
    "total_fields_matched": 4,
    "conflicts_detected": 1,
    "conflicts": [
      {
        "conflict_id": "cnf_3344-5566",
        "field_key": "full_name",
        "conflict_type": "SPELLING_OR_TRANSLITERATION_VARIATION",
        "requires_user_review": true,
        "evidence_records": [
          {
            "evidence_id": "evi_001",
            "document_type": "AADHAAR",
            "candidate_value": "Yash Sharma",
            "ocr_confidence": 0.98
          },
          {
            "evidence_id": "evi_002",
            "document_type": "MARKSHEET_CLASS_12",
            "candidate_value": "Yash S Sharma",
            "ocr_confidence": 0.91
          }
        ],
        "explanation_hi": "आधार कार्ड और अंकतालिका में नाम में हल्का अंतर है ('Yash Sharma' बनाम 'Yash S Sharma')। कृपया सही नाम चुनें।",
        "explanation_en": "Slight variation in name between Aadhaar and Marksheet ('Yash Sharma' vs 'Yash S Sharma'). Please select the correct name."
      }
    ]
  }
  ```

### 4.2 Record User Confirmation / Conflict Resolution
- **Endpoint:** `POST /v1/drafts/{id}/fields/{field_key}/confirm`
- **Request Body:**
  ```json
  {
    "selected_evidence_id": "evi_001",
    "confirmed_value": "Yash Sharma",
    "action": "CONFIRMED_EVIDENCE",
    "actor": "APPLICANT"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "field_key": "full_name",
    "new_status": "USER_CONFIRMED",
    "is_eligible_for_draft": true,
    "audit_event_id": "aud_9988-7766"
  }
  ```

---

## 5. Scheme Rules & Statutory Validation

### 5.1 Run Scheme Validation
- **Endpoint:** `POST /v1/drafts/{id}/validate`
- **Response (200 OK):**
  ```json
  {
    "draft_id": "dft_1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d",
    "overall_valid": true,
    "rule_version": "1.0",
    "validation_results": [
      {
        "rule_code": "SCHOLARSHIP_INCOME_CEILING",
        "status": "PASSED",
        "evaluated_value": 120000,
        "threshold": 250000,
        "message": "Annual income is within the eligible limit of ₹2,50,000."
      },
      {
        "rule_code": "SCHOLARSHIP_MINIMUM_MARKS",
        "status": "PASSED",
        "evaluated_value": 82.5,
        "threshold": 60.0,
        "message": "Marks percentage exceeds the 60.0% threshold."
      }
    ]
  }
  ```
