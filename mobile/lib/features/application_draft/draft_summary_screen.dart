import 'package:flutter/material.dart';

class DraftSummaryScreen extends StatelessWidget {
  final String draftId;
  final Map<String, dynamic> initialSummary;

  const DraftSummaryScreen({
    super.key,
    required this.draftId,
    required this.initialSummary,
  });

  @override
  Widget build(BuildContext context) {
    final bool isReady = initialSummary['is_ready_for_draft'] ?? false;
    final Map<String, dynamic> fields = initialSummary['fields'] ?? {};
    final List<dynamic> conflicts = initialSummary['conflicts'] ?? [];
    final List<dynamic> issues = initialSummary['validation_issues'] ?? [];

    return Scaffold(
      appBar: AppBar(
        title: const Text('आवेदन ड्राफ्ट सारांश (Draft Summary)'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Status Badge Banner
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: isReady ? const Color(0xFFDCFCE7) : const Color(0xFFFEE2E2),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: isReady ? const Color(0xFF16A34A) : const Color(0xFFDC2626), width: 1.5),
              ),
              child: Row(
                children: [
                  Icon(
                    isReady ? Icons.check_circle : Icons.error,
                    color: isReady ? const Color(0xFF15803D) : const Color(0xFFB91C1C),
                    size: 32,
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          isReady ? 'ड्राफ्ट तैयार है (Eligible for Final Draft)' : 'ड्राफ्ट समीक्षा आवश्यक (Review Required)',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: isReady ? const Color(0xFF15803D) : const Color(0xFFB91C1C),
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          isReady
                              ? 'सभी आवश्यक फ़ील्ड्स सत्यापित हैं और कोई विसंगति नहीं पाई गई।'
                              : 'कृपया नीचे दी गई चेतावनियों या त्रुटियों का समाधान करें।',
                          style: const TextStyle(fontSize: 12, color: Color(0xFF334155)),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Validation issues if any
            if (issues.isNotEmpty) ...[
              const Text('⚠️ वैधानिक नियम त्रुटियां (Validation Issues):', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
              const SizedBox(height: 8),
              ...issues.map((iss) => Container(
                    margin: const EdgeInsets.only(bottom: 8),
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: const Color(0xFFFFFBEB),
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: const Color(0xFFF59E0B)),
                    ),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('• ', style: TextStyle(fontWeight: FontWeight.bold, color: Color(0xFFB45309))),
                        Expanded(
                          child: Text(
                            iss['message_hi'] ?? iss['message_en'] ?? '',
                            style: const TextStyle(fontSize: 13, color: Color(0xFF78350F)),
                          ),
                        ),
                      ],
                    ),
                  )),
              const SizedBox(height: 16),
            ],

            // Fields Review Card
            const Text('📋 भरे गए विवरण (Application Fields):', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
            const SizedBox(height: 10),
            Card(
              elevation: 2,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  children: [
                    _buildFieldRow('आवेदक का नाम', fields['full_name']?.toString() ?? '—'),
                    const Divider(),
                    _buildFieldRow('जन्म तिथि', fields['date_of_birth']?.toString() ?? '—'),
                    const Divider(),
                    _buildFieldRow('वार्षिक पारिवारिक आय', '₹${fields['annual_income']?.toString() ?? '—'}'),
                    const Divider(),
                    _buildFieldRow('प्राप्तांक प्रतिशत', '${fields['marks_percentage']?.toString() ?? '—'}%'),
                    const Divider(),
                    _buildFieldRow('सामाजिक श्रेणी', fields['category']?.toString() ?? '—'),
                    const Divider(),
                    _buildFieldRow('संस्थान का नाम', fields['institution_name']?.toString() ?? '—'),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 28),

            // Proceed Action Button
            ElevatedButton(
              onPressed: isReady
                  ? () {
                      showDialog(
                        context: context,
                        builder: (ctx) => AlertDialog(
                          title: const Text('सत्यापित ड्राफ्ट तैयार! 🎉'),
                          content: const Text('आपका छात्रवृत्ति आवेदन पत्र सुरक्षित हो गया है। आधिकारिक पोर्टल पर प्रेषण हेतु डाउनलोड कर सकते हैं।'),
                          actions: [
                            TextButton(
                              onPressed: () => Navigator.pop(ctx),
                              child: const Text('ठीक है (OK)'),
                            ),
                          ],
                        ),
                      );
                    }
                  : null,
              child: const Text('आधिकारिक पोर्टल पर जमा करें (Submit to Portal)'),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFieldRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(fontSize: 13, color: Color(0xFF64748B))),
          Text(value, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Color(0xFF0F172A))),
        ],
      ),
    );
  }
}

