/**
 * GramSathi AI — Live Backend API Client
 * Connects the Next.js frontend to the FastAPI Evidence Intelligence backend.
 */

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export interface SessionResponse {
  session_id: string;
  token?: string;
  preferred_locale: string;
  created_at?: string;
}

export interface DraftResponse {
  draft_id: string;
  service_id: string;
  rule_version: string;
  status: string;
  required_documents: string[];
  required_fields: string[];
}

export interface UploadDocumentResponse {
  document_id: string;
  draft_id: string;
  document_type: string;
  file_name: string;
  sha256_checksum: string;
  page_count: number;
  uploaded_at: string;
}

export interface ExtractedFieldCandidate {
  field_key: string;
  raw_text: string;
  normalized_value: string;
  confidence: number;
  page_number: number;
  bounding_box: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface ExtractResponse {
  document_id: string;
  engine_used: string;
  extracted_fields_count: number;
  candidates: ExtractedFieldCandidate[];
}

export interface ReconcileResponse {
  draft_id: string;
  reconciliation_status: string;
  total_fields_matched: number;
  conflicts_detected: number;
  conflicts: Array<{
    conflict_id: string;
    field_key: string;
    conflict_type: string;
    requires_user_review: boolean;
    evidence_records: Array<{
      evidence_id: string;
      document_type: string;
      candidate_value: string;
      ocr_confidence: number;
    }>;
    explanation_hi: string;
    explanation_en: string;
  }>;
}

export interface DraftSummaryResponse {
  draft_id: string;
  service_id: string;
  status: string;
  readiness_score: number;
  is_eligible_for_draft: boolean;
  blocking_issues_count: number;
  fields: Array<{
    field_key: string;
    value: string;
    reliability_status: string;
    evidence_sources_count: number;
    conflict_flag: boolean;
  }>;
}

export class GramSathiApiClient {
  private baseUrl: string;

  constructor(baseUrl = BACKEND_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Health Check
   */
  async checkHealth(): Promise<boolean> {
    try {
      const res = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  /**
   * 1. Create Session with DPDP Consent
   */
  async createSession(locale: string = 'hi'): Promise<SessionResponse> {
    const res = await fetch(`${this.baseUrl}/v1/sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        device_fingerprint: 'web_browser_client',
        preferred_locale: locale,
        dpdp_consent: {
          consent_granted: true,
          purpose: 'GOVERNMENT_APPLICATION_PREPARATION',
          timestamp: new Date().toISOString(),
        },
      }),
    });

    if (!res.ok) {
      throw new Error(`Failed to create session: ${res.statusText}`);
    }
    return res.json();
  }

  /**
   * 2. Create Application Draft
   */
  async createDraft(
    sessionId: string,
    serviceId: string = 'SCHOLARSHIP_POST_MATRIC_2026'
  ): Promise<DraftResponse> {
    const res = await fetch(`${this.baseUrl}/v1/drafts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Session-ID': sessionId,
      },
      body: JSON.stringify({
        service_id: serviceId,
      }),
    });

    if (!res.ok) {
      throw new Error(`Failed to create draft: ${res.statusText}`);
    }
    return res.json();
  }

  /**
   * 3. Live Document File Upload (FormData)
   */
  async uploadDocument(
    draftId: string,
    file: File,
    documentType: string
  ): Promise<UploadDocumentResponse> {
    const formData = new FormData();
    formData.append('document_type', documentType);
    formData.append('file', file);

    const res = await fetch(`${this.baseUrl}/v1/drafts/${draftId}/documents`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      throw new Error(`Document upload failed: ${res.statusText}`);
    }
    return res.json();
  }

  /**
   * 4. Trigger OCR Field Extraction & Bounding Box Coordinates
   */
  async extractDocument(documentId: string): Promise<ExtractResponse> {
    const res = await fetch(`${this.baseUrl}/v1/documents/${documentId}/extract`, {
      method: 'POST',
      headers: { Accept: 'application/json' },
    });

    if (!res.ok) {
      throw new Error(`Extraction failed: ${res.statusText}`);
    }
    return res.json();
  }

  /**
   * 5. Run Cross-Document Reconciliation
   */
  async reconcileDraft(draftId: string): Promise<ReconcileResponse> {
    const res = await fetch(`${this.baseUrl}/v1/drafts/${draftId}/reconcile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      throw new Error(`Reconciliation failed: ${res.statusText}`);
    }
    return res.json();
  }

  /**
   * 6. Confirm / Resolve a Conflicting Field
   */
  async confirmField(
    draftId: string,
    fieldKey: string,
    confirmedValue: string,
    evidenceId?: string
  ): Promise<{ status: string; field_key: string; new_status: string }> {
    const res = await fetch(`${this.baseUrl}/v1/drafts/${draftId}/fields/${fieldKey}/confirm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        selected_evidence_id: evidenceId,
        confirmed_value: confirmedValue,
        action: 'CONFIRMED_EVIDENCE',
        actor: 'APPLICANT',
      }),
    });

    if (!res.ok) {
      throw new Error(`Field confirmation failed: ${res.statusText}`);
    }
    return res.json();
  }

  /**
   * 7. Get Draft Summary & Readiness
   */
  async getDraftSummary(draftId: string): Promise<DraftSummaryResponse> {
    const res = await fetch(`${this.baseUrl}/v1/drafts/${draftId}/summary`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch draft summary: ${res.statusText}`);
    }
    return res.json();
  }

  /**
   * 7b. Generate and Fetch Final Verified Draft Package
   */
  async generateFinalDraftPackage(draftId: string): Promise<any> {
    const res = await fetch(`${this.baseUrl}/v1/drafts/${draftId}/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    });

    if (!res.ok) {
      throw new Error(`Failed to generate final draft: ${res.statusText}`);
    }
    return res.json();
  }

  /**
   * 8. Bilingual Voice Intent Classification (Hindi & English)
   */
  async classifyVoiceIntent(
    queryText: string,
    language: 'hi' | 'en' = 'hi',
    userName?: string
  ): Promise<{
    intent: string;
    confidence: number;
    user_name?: string;
    spoken_reply?: string;
    spoken_reply_hi?: string;
    spoken_reply_en?: string;
    suggested_actions?: string[];
  }> {
    const res = await fetch(`${this.baseUrl}/v1/voice/intent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query_text: queryText,
        language: language,
        user_name: userName,
      }),
    });

    if (!res.ok) {
      throw new Error(`Voice intent classification failed: ${res.statusText}`);
    }
    return res.json();
  }

  /**
   * Alias for backward compatibility
   */
  async classifyHindiIntent(queryText: string): Promise<{
    intent: string;
    confidence: number;
    detected_scheme?: string;
  }> {
    return this.classifyVoiceIntent(queryText, 'hi');
  }
}

export const apiClient = new GramSathiApiClient();
