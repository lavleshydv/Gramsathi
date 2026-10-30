import 'package:flutter/material.dart';
import '../../services/api_client.dart';
import '../field_review/field_review_screen.dart';

class DocumentUploadScreen extends StatefulWidget {
  final String draftId;
  final String sessionId;

  const DocumentUploadScreen({
    super.key,
    required this.draftId,
    required this.sessionId,
  });

  @override
  State<DocumentUploadScreen> createState() => _DocumentUploadScreenState();
}

class _DocumentUploadScreenState extends State<DocumentUploadScreen> {
  final ApiClient _apiClient = ApiClient();
  bool _isProcessing = false;

  // Track upload status of required documents
  final Map<String, Map<String, dynamic>> _docs = {
    'AADHAAR': {
      'titleHi': 'आधार कार्ड (Aadhaar Card)',
      'status': 'READY_TO_UPLOAD',
      'fileName': 'synthetic_aadhaar_clean.pdf',
      'docId': 'DOC-SYN-001',
    },
    'MARKSHEET': {
      'titleHi': '12वीं कक्षा का अंकपत्र (Class 12 Marksheet)',
      'status': 'READY_TO_UPLOAD',
      'fileName': 'synthetic_marksheet_clean.pdf',
      'docId': 'DOC-SYN-002',
    },
    'INCOME_CERTIFICATE': {
      'titleHi': 'तहसीलदार द्वारा जारी आय प्रमाण पत्र (Income Cert)',
      'status': 'READY_TO_UPLOAD',
      'fileName': 'synthetic_income_cert_clean.pdf',
      'docId': 'DOC-SYN-003',
    },
  };

  void _runExtractionAndReview() async {
    setState(() => _isProcessing = true);
    try {
      // Run OCR extraction across all documents
      for (var entry in _docs.entries) {
        final docId = entry.value['docId'];
        if (docId != null) {
          try {
            await _apiClient.extractDocument(docId);
          } catch (_) {
            // Ignore if already extracted in mock
          }
        }
      }

      final summary = await _apiClient.getDraftSummary(widget.draftId);

      if (!mounted) return;
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (context) => FieldReviewScreen(
            draftId: widget.draftId,
            initialSummary: summary,
          ),
        ),
      );
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('त्रुटि: $e')),
      );
    } finally {
      if (mounted) setState(() => _isProcessing = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('दस्तावेज़ अपलोड (Upload Documents)'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'आवश्यक सहायक दस्तावेज़:',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 6),
            const Text(
              'Phase 3: ओसीआर इंजन दस्तावेज़ों से स्वतः फ़ील्ड्स और बाउंडिंग बॉक्स निकालेगा।',
              style: TextStyle(fontSize: 12, color: Color(0xFF64748B)),
            ),
            const SizedBox(height: 16),

            // Document cards list
            Expanded(
              child: ListView(
                children: _docs.entries.map((entry) {
                  final data = entry.value;
                  return Card(
                    elevation: 2,
                    margin: const EdgeInsets.only(bottom: 12),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                      side: const BorderSide(color: Color(0xFFE2E8F0)),
                    ),
                    child: Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Row(
                        children: [
                          const Icon(Icons.picture_as_pdf, color: Color(0xFFDC2626), size: 36),
                          const SizedBox(width: 14),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  data['titleHi'],
                                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  'फ़ाइल: ${data['fileName']}',
                                  style: const TextStyle(fontSize: 12, color: Color(0xFF475569)),
                                ),
                                const SizedBox(height: 4),
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                                  decoration: BoxDecoration(
                                    color: const Color(0xFFDCFCE7),
                                    borderRadius: BorderRadius.circular(4),
                                  ),
                                  child: const Text('SHA-256 सुरक्षित', style: TextStyle(fontSize: 10, color: Color(0xFF15803D), fontWeight: FontWeight.bold)),
                                ),
                              ],
                            ),
                          ),
                          const Icon(Icons.check_circle, color: Color(0xFF16A34A)),
                        ],
                      ),
                    ),
                  );
                }).toList(),
              ),
            ),

            // Process Button
            ElevatedButton(
              onPressed: _isProcessing ? null : _runExtractionAndReview,
              child: _isProcessing
                  ? const CircularProgressIndicator(color: Colors.white)
                  : const Text('ओसीआर निष्कर्षण प्रारंभ करें (Run OCR Extraction) →'),
            ),
          ],
        ),
      ),
    );
  }
}

