import 'dart:convert';
import 'package:http/http.dart' as http;
import '../core/constants/api_constants.dart';

class ApiClient {
  final String baseUrl;

  ApiClient({this.baseUrl = ApiConstants.baseUrl});

  Future<Map<String, dynamic>> createSession(String phone, {bool consent = true}) async {
    final response = await http.post(
      Uri.parse('$baseUrl${ApiConstants.sessions}'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'citizen_phone': phone,
        'consent_given': consent,
        'purpose_id': 'POST_MATRIC_SCHOLARSHIP_2026',
        'preferred_language': 'hi',
      }),
    );
    if (response.statusCode >= 200 && response.statusCode < 300) {
      return jsonDecode(response.body);
    }
    throw Exception('Failed to create session: ${response.body}');
  }

  Future<Map<String, dynamic>> createDraft({String serviceId = 'POST_MATRIC_STATE_SCHOLARSHIP'}) async {
    final response = await http.post(
      Uri.parse('$baseUrl${ApiConstants.drafts}'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'service_id': serviceId,
        'rule_version': '1.0',
      }),
    );
    if (response.statusCode >= 200 && response.statusCode < 300) {
      return jsonDecode(response.body);
    }
    throw Exception('Failed to create draft: ${response.body}');
  }

  Future<Map<String, dynamic>> saveFields(String draftId, Map<String, dynamic> fields) async {
    final response = await http.patch(
      Uri.parse('$baseUrl${ApiConstants.draftFields(draftId)}'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'fields': fields}),
    );
    if (response.statusCode >= 200 && response.statusCode < 300) {
      return jsonDecode(response.body);
    }
    throw Exception('Failed to save fields: ${response.body}');
  }

  Future<List<dynamic>> validateDraft(String draftId) async {
    final response = await http.post(
      Uri.parse('$baseUrl${ApiConstants.draftValidate(draftId)}'),
      headers: {'Content-Type': 'application/json'},
    );
    if (response.statusCode >= 200 && response.statusCode < 300) {
      return jsonDecode(response.body);
    }
    throw Exception('Failed to validate draft: ${response.body}');
  }

  Future<Map<String, dynamic>> extractDocument(String docId) async {
    final response = await http.post(
      Uri.parse('$baseUrl${ApiConstants.documentExtract(docId)}'),
      headers: {'Content-Type': 'application/json'},
    );
    if (response.statusCode >= 200 && response.statusCode < 300) {
      return jsonDecode(response.body);
    }
    throw Exception('Failed to extract document: ${response.body}');
  }

  Future<Map<String, dynamic>> getDraftEvidence(String draftId) async {
    final response = await http.get(
      Uri.parse('$baseUrl${ApiConstants.draftFields(draftId)}'),
      headers: {'Content-Type': 'application/json'},
    );
    if (response.statusCode >= 200 && response.statusCode < 300) {
      return jsonDecode(response.body);
    }
    throw Exception('Failed to fetch evidence: ${response.body}');
  }

  Future<Map<String, dynamic>> getDraftSummary(String draftId) async {
    final response = await http.get(
      Uri.parse('$baseUrl${ApiConstants.draftSummary(draftId)}'),
      headers: {'Content-Type': 'application/json'},
    );
    if (response.statusCode >= 200 && response.statusCode < 300) {
      return jsonDecode(response.body);
    }
    throw Exception('Failed to fetch draft summary: ${response.body}');
  }
}

