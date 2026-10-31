import 'package:flutter/material.dart';
import '../../services/api_client.dart';

class VoiceAssistantScreen extends StatefulWidget {
  final String? draftId;
  final String? sessionId;

  const VoiceAssistantScreen({
    super.key,
    this.draftId,
    this.sessionId,
  });

  @override
  State<VoiceAssistantScreen> createState() => _VoiceAssistantScreenState();
}

class _VoiceAssistantScreenState extends State<VoiceAssistantScreen> {
  final ApiClient _apiClient = ApiClient();
  final TextEditingController _transcriptController = TextEditingController(
    text: 'मुझे पोस्ट मैट्रिक छात्रवृत्ति (स्कॉलरशिप) के लिए अप्लाई करना है और जरूरी दस्तावेज जानने हैं',
  );

  bool _isListening = false;
  bool _isLoading = false;
  bool _isPlayingAudio = false;

  Map<String, dynamic>? _lastIntentResult;
  Map<String, dynamic>? _draftGuidanceResult;

  final List<String> _quickPrompts = [
    'छात्रवृत्ति के लिए कौन से दस्तावेज लगेंगे?',
    'मेरे नाम और जन्मतिथि में विसंगति आ रही है',
    'मेरे आवेदन का स्टेटस क्या है?',
    'फ़ॉर्म पर लाल निशान (एरर) क्यों आ रहा है?',
    'क्या मैं इस योजना के लिए पात्र हूँ?',
  ];

  @override
  void initState() {
    super.initState();
    if (widget.draftId != null) {
      _loadDraftGuidance();
    }
  }

  Future<void> _loadDraftGuidance() async {
    if (widget.draftId == null) return;
    try {
      final res = await _apiClient.getDraftAudioGuidance(widget.draftId!);
      if (mounted) {
        setState(() {
          _draftGuidanceResult = res;
        });
      }
    } catch (_) {}
  }

  Future<void> _processQuery(String text) async {
    if (text.trim().isEmpty) return;

    setState(() {
      _isLoading = true;
      _transcriptController.text = text;
    });

    try {
      final result = await _apiClient.queryVoiceIntent(text);
      if (mounted) {
        setState(() {
          _lastIntentResult = result;
          _isPlayingAudio = true;
        });
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('वॉइस प्रोसेस त्रुटि: $e')),
        );
      }
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  void _simulateListening() {
    setState(() => _isListening = true);

    // Simulate 2 seconds listening then auto-process
    Future.delayed(const Duration(milliseconds: 1800), () {
      if (!mounted) return;
      setState(() => _isListening = false);
      _processQuery(_transcriptController.text);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Row(
          children: [
            Text('🎙️ ग्राम साथी आवाज़ सहायक (Voice Assistant)'),
          ],
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Voice Guidance banner for existing draft if present
            if (_draftGuidanceResult != null) ...[
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: const Color(0xFFEFF6FF),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: const Color(0xFF3B82F6), width: 1.5),
                ),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('🔊', style: TextStyle(fontSize: 24)),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'वर्तमान आवेदन स्थिति पर मौखिक मार्गदर्शन:',
                            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF1E40AF)),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            _draftGuidanceResult!['guidance_hi'] ?? '',
                            style: const TextStyle(fontSize: 13, color: Color(0xFF1E3A8A)),
                          ),
                          const SizedBox(height: 6),
                          Chip(
                            label: Text(
                              'सलाह: ${_draftGuidanceResult!['action_recommendation'] ?? 'जाँच करें'}',
                              style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.white),
                            ),
                            backgroundColor: const Color(0xFF2563EB),
                            padding: EdgeInsets.zero,
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),
            ],

            // Microphone Interaction Card
            Card(
              elevation: 3,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              child: Padding(
                padding: const EdgeInsets.symmetric(vertical: 24, horizontal: 16),
                child: Center(
                  child: Column(
                    children: [
                      GestureDetector(
                        onTap: _isListening ? null : _simulateListening,
                        child: AnimatedContainer(
                          duration: const Duration(milliseconds: 300),
                          width: 88,
                          height: 88,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            color: _isListening ? const Color(0xFFEF4444) : const Color(0xFF16A34A),
                            boxShadow: [
                              BoxShadow(
                                color: (_isListening ? Colors.red : Colors.green).withOpacity(0.35),
                                blurRadius: _isListening ? 24 : 10,
                                spreadRadius: _isListening ? 8 : 2,
                              ),
                            ],
                          ),
                          child: Icon(
                            _isListening ? Icons.mic : Icons.mic_none,
                            size: 44,
                            color: Colors.white,
                          ),
                        ),
                      ),
                      const SizedBox(height: 14),
                      Text(
                        _isListening ? 'सुन रहे हैं... कृपया बोलिए' : 'बोलने के लिए माइक दबाएं',
                        style: TextStyle(
                          fontSize: 15,
                          fontWeight: FontWeight.bold,
                          color: _isListening ? const Color(0xFFDC2626) : const Color(0xFF0F172A),
                        ),
                      ),
                      const SizedBox(height: 4),
                      const Text(
                        'हिंदी आवाज़ इनपुट • ग्रामीण बोली व उच्चारण अनुकूलित',
                        style: TextStyle(fontSize: 12, color: Color(0xFF64748B)),
                      ),
                    ],
                  ),
                ),
              ),
            ),
            const SizedBox(height: 24),

            // Editable Hindi Transcript Section
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  '📝 पहचान की गई आवाज़ (संपादन योग्य):',
                  style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
                ),
                TextButton.icon(
                  onPressed: () => _processQuery(_transcriptController.text),
                  icon: const Icon(Icons.send, size: 16),
                  label: const Text('पूछें'),
                ),
              ],
            ),
            const SizedBox(height: 6),
            TextField(
              controller: _transcriptController,
              maxLines: 2,
              decoration: InputDecoration(
                hintText: 'यहाँ आप बोली गई बात को एडिट कर सकते हैं...',
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                suffixIcon: IconButton(
                  icon: const Icon(Icons.clear),
                  onPressed: () => _transcriptController.clear(),
                ),
              ),
            ),
            const SizedBox(height: 16),

            // Quick Preset Prompts
            const Text(
              '💡 अक्सर पूछे जाने वाले प्रश्न (Quick Prompts):',
              style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Color(0xFF475569)),
            ),
            const SizedBox(height: 8),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: _quickPrompts.map((p) {
                return ActionChip(
                  label: Text(p, style: const TextStyle(fontSize: 12)),
                  backgroundColor: const Color(0xFFF1F5F9),
                  onPressed: () => _processQuery(p),
                );
              }).toList(),
            ),
            const SizedBox(height: 24),

            // Intent & Spoken Response Card
            if (_isLoading) ...[
              const Center(
                child: Padding(
                  padding: EdgeInsets.all(24.0),
                  child: CircularProgressIndicator(),
                ),
              ),
            ] else if (_lastIntentResult != null) ...[
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: const Color(0xFFF0FDF4),
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: const Color(0xFF22C55E)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          children: [
                            const Text('🔊', style: TextStyle(fontSize: 20)),
                            const SizedBox(width: 8),
                            const Text(
                              'ग्राम साथी का मौखिक उत्तर:',
                              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Color(0xFF15803D)),
                            ),
                          ],
                        ),
                        Chip(
                          label: Text(
                            _lastIntentResult!['intent'] ?? 'INTENT',
                            style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.white),
                          ),
                          backgroundColor: const Color(0xFF15803D),
                          padding: EdgeInsets.zero,
                        ),
                      ],
                    ),
                    const SizedBox(height: 10),
                    Text(
                      _lastIntentResult!['spoken_reply_hi'] ?? '',
                      style: const TextStyle(fontSize: 14, height: 1.4, color: Color(0xFF166534)),
                    ),
                    const SizedBox(height: 14),

                    // Audio Wave visualizer simulation
                    if (_isPlayingAudio)
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Row(
                          children: [
                            const Icon(Icons.volume_up, color: Color(0xFF16A34A), size: 20),
                            const SizedBox(width: 8),
                            const Expanded(
                              child: Text(
                                '[🔊 सुनिए] आवाज़ में सुनाया जा रहा है...',
                                style: TextStyle(fontSize: 12, color: Color(0xFF16A34A), fontWeight: FontWeight.bold),
                              ),
                            ),
                            IconButton(
                              icon: const Icon(Icons.pause, size: 20),
                              onPressed: () => setState(() => _isPlayingAudio = false),
                            ),
                          ],
                        ),
                      ),

                    const SizedBox(height: 12),
                    const Divider(),
                    const SizedBox(height: 6),
                    const Text(
                      'सुझाए गए कदम (Suggested Actions):',
                      style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF475569)),
                    ),
                    const SizedBox(height: 6),
                    Wrap(
                      spacing: 8,
                      children: ((_lastIntentResult!['suggested_actions'] as List<dynamic>?) ?? []).map((action) {
                        return ElevatedButton.icon(
                          onPressed: () {
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(content: Text('कदम चुना गया: $action')),
                            );
                          },
                          icon: const Icon(Icons.arrow_forward, size: 14),
                          label: Text(action.toString(), style: const TextStyle(fontSize: 12)),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFF0F766E),
                            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                          ),
                        );
                      }).toList(),
                    ),
                  ],
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}

