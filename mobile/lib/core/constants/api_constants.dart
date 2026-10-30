class ApiConstants {
  // Configured default base URL (can be customized via environment)
  static const String baseUrl = 'http://localhost:8000';

  // Endpoint routes (v1 API Contract)
  static const String sessions = '/v1/sessions';
  static const String drafts = '/v1/drafts';
  static const String services = '/v1/services';

  static String draftDetails(String draftId) => '/v1/drafts/$draftId';
  static String draftFields(String draftId) => '/v1/drafts/$draftId/fields';
  static String draftSummary(String draftId) => '/v1/drafts/$draftId/summary';
  static String draftValidate(String draftId) => '/v1/drafts/$draftId/validate';
  static String draftDocuments(String draftId) => '/v1/drafts/$draftId/documents';
  static String draftReconcile(String draftId) => '/v1/drafts/$draftId/reconcile';
  static String draftConflicts(String draftId) => '/v1/drafts/$draftId/conflicts';
  static String documentExtract(String docId) => '/v1/documents/$docId/extract';
}

