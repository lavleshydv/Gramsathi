import 'package:flutter/material.dart';
import '../application_draft/manual_entry_screen.dart';
import '../document_upload/document_upload_screen.dart';

class SchemeSelectionScreen extends StatelessWidget {
  final String sessionId;
  final String draftId;

  const SchemeSelectionScreen({
    super.key,
    required this.sessionId,
    required this.draftId,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('योजना का चयन (Select Scheme)'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'उपलब्ध सरकारी सेवाएं:',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),

            // Target Scholarship Card
            Card(
              elevation: 3,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16),
                side: const BorderSide(color: Color(0xFF16A34A), width: 2),
              ),
              child: Padding(
                padding: const EdgeInsets.all(20.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          '🎓 छात्रवृत्ति सेवा',
                          style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Color(0xFF15803D)),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: const Color(0xFFDCFCE7),
                            borderRadius: BorderRadius.circular(20),
                          ),
                          child: const Text('Phase 1 Active', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF166534))),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    const Text(
                      'पोस्ट-मैट्रिक राज्य छात्रवृत्ति योजना',
                      style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
                    ),
                    const SizedBox(height: 4),
                    const Text(
                      'Post-Matric State Scholarship for SC/ST/OBC/EWS',
                      style: TextStyle(fontSize: 13, color: Color(0xFF64748B)),
                    ),
                    const Divider(height: 24),
                    const Text('📌 मुख्य पात्रता मानदंड:', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                    const SizedBox(height: 6),
                    const Text('• अधिकतम पारिवारिक आय: ₹2,50,000 वार्षिक', style: TextStyle(fontSize: 12)),
                    const Text('• न्यूनतम प्राप्तांक: 50% या अधिक', style: TextStyle(fontSize: 12)),
                    const Text('• आवश्यक दस्तावेज़: आधार कार्ड, 12वीं अंकपत्र, आय प्रमाण पत्र', style: TextStyle(fontSize: 12)),
                    const SizedBox(height: 20),

                    ElevatedButton(
                      onPressed: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => DocumentUploadScreen(
                              draftId: draftId,
                              sessionId: sessionId,
                            ),
                          ),
                        );
                      },
                      child: const Text('दस्तावेज़ अपलोड व ओसीआर (Upload Docs & Run OCR) →'),
                    ),
                    const SizedBox(height: 10),
                    OutlinedButton(
                      style: OutlinedButton.styleFrom(
                        minimumSize: const Size(double.infinity, 48),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      onPressed: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => ManualEntryScreen(
                              draftId: draftId,
                              sessionId: sessionId,
                            ),
                          ),
                        );
                      },
                      child: const Text('मैनुअल प्रविष्टि द्वारा भरें (Manual Entry)'),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

