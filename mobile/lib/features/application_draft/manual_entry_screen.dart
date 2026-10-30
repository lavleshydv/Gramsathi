import 'package:flutter/material.dart';
import '../../services/api_client.dart';
import 'draft_summary_screen.dart';

class ManualEntryScreen extends StatefulWidget {
  final String draftId;
  final String sessionId;

  const ManualEntryScreen({
    super.key,
    required this.draftId,
    required this.sessionId,
  });

  @override
  State<ManualEntryScreen> createState() => _ManualEntryScreenState();
}

class _ManualEntryScreenState extends State<ManualEntryScreen> {
  final _formKey = GlobalKey<FormState>();
  final TextEditingController _nameController = TextEditingController(text: 'Yash Sharma');
  final TextEditingController _dobController = TextEditingController(text: '15/08/2004');
  final TextEditingController _incomeController = TextEditingController(text: '120000');
  final TextEditingController _marksController = TextEditingController(text: '78.5');
  final TextEditingController _instController = TextEditingController(text: 'Government Polytechnic Moradabad');
  String _category = 'OBC';
  bool _isSaving = false;
  final ApiClient _apiClient = ApiClient();

  void _submitAndValidate() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isSaving = true);
    try {
      final fields = {
        'full_name': _nameController.text.trim(),
        'date_of_birth': _dobController.text.trim(),
        'annual_income': double.tryParse(_incomeController.text.trim()) ?? _incomeController.text.trim(),
        'marks_percentage': double.tryParse(_marksController.text.trim()) ?? _marksController.text.trim(),
        'category': _category,
        'institution_name': _instController.text.trim(),
      };

      // 1. Save fields to backend
      await _apiClient.saveFields(widget.draftId, fields);

      // 2. Run deterministic validation
      final issues = await _apiClient.validateDraft(widget.draftId);

      // 3. Fetch summary
      final summary = await _apiClient.getDraftSummary(widget.draftId);

      if (!mounted) return;
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (context) => DraftSummaryScreen(
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
      if (mounted) setState(() => _isSaving = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('मैनुअल फ़ॉर्म प्रविष्टि (Manual Entry)'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20.0),
        child: Form(
          key: _formKey,
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
                    Text('ℹ️', style: TextStyle(fontSize: 18)),
                    SizedBox(width: 10),
                    Expanded(
                      child: Text(
                        'Phase 1: यह बिना AI/OCR के बुनियादी फ़ॉर्म परीक्षण है ताकि वर्कफ़्लो की पुष्टि की जा सके।',
                        style: TextStyle(fontSize: 12, color: Color(0xFF92400E), fontWeight: FontWeight.bold),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),

              // Full Name
              const Text('आवेदक का पूरा नाम (Full Name) *', style: TextStyle(fontWeight: FontWeight.bold)),
              const SizedBox(height: 6),
              TextFormField(
                controller: _nameController,
                validator: (val) => val == null || val.isEmpty ? 'कृपया नाम दर्ज करें' : null,
              ),
              const SizedBox(height: 16),

              // Date of Birth
              const Text('जन्म तिथि (Date of Birth) *', style: TextStyle(fontWeight: FontWeight.bold)),
              const SizedBox(height: 6),
              TextFormField(
                controller: _dobController,
                decoration: const InputDecoration(hintText: 'DD/MM/YYYY'),
                validator: (val) => val == null || val.isEmpty ? 'कृपया जन्म तिथि दर्ज करें' : null,
              ),
              const SizedBox(height: 16),

              // Annual Income
              const Text('वार्षिक पारिवारिक आय (Annual Income in ₹) *', style: TextStyle(fontWeight: FontWeight.bold)),
              const SizedBox(height: 6),
              TextFormField(
                controller: _incomeController,
                keyboardType: TextInputType.number,
                validator: (val) => val == null || val.isEmpty ? 'कृपया आय दर्ज करें' : null,
              ),
              const SizedBox(height: 16),

              // Marks Percentage
              const Text('पिछली कक्षा के अंक (Percentage %) *', style: TextStyle(fontWeight: FontWeight.bold)),
              const SizedBox(height: 6),
              TextFormField(
                controller: _marksController,
                keyboardType: TextInputType.number,
                validator: (val) => val == null || val.isEmpty ? 'कृपया अंक दर्ज करें' : null,
              ),
              const SizedBox(height: 16),

              // Social Category
              const Text('सामाजिक श्रेणी (Category) *', style: TextStyle(fontWeight: FontWeight.bold)),
              const SizedBox(height: 6),
              DropdownButtonFormField<String>(
                value: _category,
                decoration: const InputDecoration(),
                items: const [
                  DropdownMenuItem(value: 'OBC', child: Text('OBC (अन्य पिछड़ा वर्ग)')),
                  DropdownMenuItem(value: 'SC', child: Text('SC (अनुसूचित जाति)')),
                  DropdownMenuItem(value: 'ST', child: Text('ST (अनुसूचित जनजाति)')),
                  DropdownMenuItem(value: 'EWS', child: Text('EWS (आर्थिक रूप से कमजोर)')),
                ],
                onChanged: (val) => setState(() => _category = val ?? 'OBC'),
              ),
              const SizedBox(height: 16),

              // Institution Name
              const Text('संस्थान / कॉलेज का नाम (Institution Name) *', style: TextStyle(fontWeight: FontWeight.bold)),
              const SizedBox(height: 6),
              TextFormField(
                controller: _instController,
                validator: (val) => val == null || val.isEmpty ? 'कृपया संस्थान का नाम दर्ज करें' : null,
              ),
              const SizedBox(height: 28),

              ElevatedButton(
                onPressed: _isSaving ? null : _submitAndValidate,
                child: _isSaving
                    ? const CircularProgressIndicator(color: Colors.white)
                    : const Text('जांचें एवं ड्राफ्ट सारांश देखें (Validate & Review) →'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

