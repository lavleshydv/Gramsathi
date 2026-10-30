import 'package:flutter/material.dart';
import '../application_draft/draft_summary_screen.dart';
import '../conflict_resolution/conflict_resolution_screen.dart';

class FieldReviewScreen extends StatefulWidget {
  final String draftId;
  final Map<String, dynamic> initialSummary;

  const FieldReviewScreen({
    super.key,
    required this.draftId,
    required this.initialSummary,
  });

  @override
  State<FieldReviewScreen> createState() => _FieldReviewScreenState();
}

class _FieldReviewScreenState extends State<FieldReviewScreen> {
  late Map<String, dynamic> _summary;

  @override
  void initState() {
    super.initState();
    _summary = widget.initialSummary;
  }

  @override
  Widget build(BuildContext context) {
    final Map<String, dynamic> fieldStates = _summary['field_states'] ?? {};

    return Scaffold(
      appBar: AppBar(
        title: const Text('ओसीआर निष्कर्षण समीक्षा (OCR Review)'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: const Color(0xFFEFF6FF),
                borderRadius: BorderRadius.circular(10),
                border: Border.all(color: const Color(0xFF3B82F6)),
              ),
              child: const Row(
                children: [
                  Text('🔍', style: TextStyle(fontSize: 20)),
                  SizedBox(width: 10),
                  Expanded(
                    child: Text(
                      'Phase 3 Review: नीचे निकाले गए फ़ील्ड्स, उनका स्रोत दस्तावेज़ और ओसीआर विश्वास स्तर (OCR Confidence) दर्शित है।',
                      style: TextStyle(fontSize: 12, color: Color(0xFF1E40AF)),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            const Text(
              'निकाले गए फ़ील्ड्स (Extracted Fields):',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12),

            ...fieldStates.entries.map((entry) {
              final key = entry.key;
              final data = entry.value;
              final String val = data['candidate_value']?.toString() ?? '—';
              final double conf = (data['ocr_confidence'] as num?)?.toDouble() ?? 0.95;
              final String status = data['status']?.toString() ?? 'EXTRACTED';
              final bool isLowConf = conf < 0.70 || status == 'NEEDS_REVIEW' || val.contains('?');

              return Card(
                elevation: 2,
                margin: const EdgeInsets.only(bottom: 12),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                  side: BorderSide(
                    color: isLowConf ? const Color(0xFFEF4444) : const Color(0xFFCBD5E1),
                    width: isLowConf ? 2.0 : 1.0,
                  ),
                ),
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            data['display_name_hi'] ?? key,
                            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                            decoration: BoxDecoration(
                              color: isLowConf ? const Color(0xFFFEE2E2) : const Color(0xFFDCFCE7),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Text(
                              isLowConf
                                  ? '⚠️ समीक्षा आवश्यक (${(conf * 100).toInt()}%)'
                                  : '✓ उच्च विश्वास (${(conf * 100).toInt()}%)',
                              style: TextStyle(
                                fontSize: 11,
                                fontWeight: FontWeight.bold,
                                color: isLowConf ? const Color(0xFFB91C1C) : const Color(0xFF15803D),
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Text(
                        val,
                        style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
                      ),
                      const SizedBox(height: 6),
                      const Divider(),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text(
                            '📍 बॉक्स निर्देशांक: [X:120, Y:210, W:240, H:35]',
                            style: TextStyle(fontSize: 11, color: Color(0xFF64748B)),
                          ),
                          TextButton(
                            onPressed: () {
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(content: Text('फ़ील्ड $key की पुष्टि की गई')),
                              );
                            },
                            child: const Text('सत्यापित करें ✓', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              );
            }).toList(),

            const SizedBox(height: 24),

            if ((_summary['conflicts'] as List?)?.isNotEmpty ?? false) ...[
              ElevatedButton.icon(
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFFD97706),
                ),
                icon: const Icon(Icons.compare_arrows),
                label: Text('विसंगति समाधान करें (${(_summary['conflicts'] as List).length} Conflicts) →'),
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => ConflictResolutionScreen(
                        draftId: widget.draftId,
                        initialSummary: _summary,
                      ),
                    ),
                  );
                },
              ),
              const SizedBox(height: 10),
            ],

            ElevatedButton(
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => DraftSummaryScreen(
                      draftId: widget.draftId,
                      initialSummary: _summary,
                    ),
                  ),
                );
              },
              child: const Text('सत्यापित ड्राफ्ट सारांश देखें (Proceed to Summary) →'),
            ),
          ],
        ),
      ),
    );
  }
}

