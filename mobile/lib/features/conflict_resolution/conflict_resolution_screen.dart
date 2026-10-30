import 'package:flutter/material.dart';
import '../../services/api_client.dart';
import '../application_draft/draft_summary_screen.dart';

class ConflictResolutionScreen extends StatefulWidget {
  final String draftId;
  final Map<String, dynamic> initialSummary;

  const ConflictResolutionScreen({
    super.key,
    required this.draftId,
    required this.initialSummary,
  });

  @override
  State<ConflictResolutionScreen> createState() => _ConflictResolutionScreenState();
}

class _ConflictResolutionScreenState extends State<ConflictResolutionScreen> {
  final ApiClient _apiClient = ApiClient();
  late Map<String, dynamic> _summary;
  bool _isResolving = false;

  @override
  void initState() {
    super.initState();
    _summary = widget.initialSummary;
  }

  void _resolveConflict(String fieldKey, String chosenValue) async {
    setState(() => _isResolving = true);
    try {
      // Find field_id from fieldStates
      final fieldStates = _summary['field_states'] as Map<String, dynamic>? ?? {};
      final fieldData = fieldStates[fieldKey];
      final fieldId = fieldData?['field_id'] ?? fieldKey;

      // Send confirmation to backend
      await _apiClient.confirmField(widget.draftId, fieldId, chosenValue);

      // Refresh draft summary
      final updatedSummary = await _apiClient.getDraftSummary(widget.draftId);
      if (!mounted) return;
      setState(() {
        _summary = updatedSummary;
      });

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('फ़ील्ड $fieldKey को "$chosenValue" के साथ सफलतापूर्वक सत्यापित किया गया')),
      );
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('त्रुटि: $e')),
      );
    } finally {
      if (mounted) setState(() => _isResolving = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final List<dynamic> conflicts = _summary['conflicts'] ?? [];

    return Scaffold(
      appBar: AppBar(
        title: const Text('दस्तावेज़ विसंगति समाधान (Reconciliation)'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: const Color(0xFFFEF3C7),
                borderRadius: BorderRadius.circular(10),
                border: Border.all(color: const Color(0xFFF59E0B)),
              ),
              child: const Row(
                children: [
                  Text('⚖️', style: TextStyle(fontSize: 20)),
                  SizedBox(width: 10),
                  Expanded(
                    child: Text(
                      'Phase 4 Core IP: बहु-दस्तावेज़ साक्ष्य मिलान। यदि अलग-अलग दस्तावेज़ों में जानकारी भिन्न है, तो सही मान चुनकर सत्यापित करें।',
                      style: TextStyle(fontSize: 12, color: Color(0xFF92400E), fontWeight: FontWeight.bold),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            if (conflicts.isEmpty) ...[
              Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  color: const Color(0xFFDCFCE7),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: const Color(0xFF16A34A)),
                ),
                child: const Column(
                  children: [
                    Icon(Icons.check_circle_outline, color: Color(0xFF15803D), size: 48),
                    SizedBox(height: 12),
                    Text(
                      'कोई विसंगति नहीं पाई गई (Zero Conflicts)',
                      style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Color(0xFF15803D)),
                    ),
                    SizedBox(height: 6),
                    Text(
                      'सभी सहायक दस्तावेज़ों में दी गई जानकारी सुसंगत है।',
                      style: TextStyle(fontSize: 13, color: Color(0xFF334155)),
                      textAlign: TextAlign.center,
                    ),
                  ],
                ),
              ),
            ] else ...[
              Text(
                'पहचानी गई विसंगतियां (${conflicts.length}):',
                style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 12),

              ...conflicts.map((cnf) {
                final String fieldKey = cnf['field_key'] ?? '';
                final String cType = cnf['conflict_type'] ?? '';
                final String severity = cnf['severity'] ?? '';
                final bool isBlocking = severity == 'BLOCKING_ERROR';
                final List<dynamic> vals = cnf['conflicting_values'] ?? [];

                return Card(
                  elevation: 3,
                  margin: const EdgeInsets.only(bottom: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(14),
                    side: BorderSide(
                      color: isBlocking ? const Color(0xFFDC2626) : const Color(0xFFF59E0B),
                      width: 1.5,
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
                              'फ़ील्ड: $fieldKey',
                              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
                            ),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                              decoration: BoxDecoration(
                                color: isBlocking ? const Color(0xFFFEE2E2) : const Color(0xFFFEF3C7),
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: Text(
                                isBlocking ? 'गंभीर विरोध (Blocking)' : 'वर्तनी भिन्नता (Warning)',
                                style: TextStyle(
                                  fontSize: 11,
                                  fontWeight: FontWeight.bold,
                                  color: isBlocking ? const Color(0xFFB91C1C) : const Color(0xFFB45309),
                                ),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Text(
                          cnf['message_hi'] ?? cnf['message_en'] ?? '',
                          style: const TextStyle(fontSize: 13, color: Color(0xFF475569)),
                        ),
                        const SizedBox(height: 14),

                        const Text('साक्ष्य तुलना (Select Authoritative Value):', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                        const SizedBox(height: 8),

                        // Side-by-side source buttons
                        ...vals.map((v) {
                          final docType = v['document_type'] ?? 'DOC';
                          final rawText = v['raw_text'] ?? '';
                          return Container(
                            margin: const EdgeInsets.only(bottom: 6),
                            child: OutlinedButton(
                              style: OutlinedButton.styleFrom(
                                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                                alignment: Alignment.centerLeft,
                                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                              ),
                              onPressed: _isResolving ? null : () => _resolveConflict(fieldKey, rawText),
                              child: Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text('[$docType]', style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF166534))),
                                      Text(rawText, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Color(0xFF0F172A))),
                                    ],
                                  ),
                                  const Text('यह चुनें ✓', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF15803D))),
                                ],
                              ),
                            ),
                          );
                        }),
                      ],
                    ),
                  ),
                );
              }),
            ],

            const SizedBox(height: 24),

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
              child: const Text('अंतिम ड्राफ्ट सारांश देखें (Go to Draft Summary) →'),
            ),
          ],
        ),
      ),
    );
  }
}

