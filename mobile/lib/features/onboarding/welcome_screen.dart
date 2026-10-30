import 'package:flutter/material.dart';
import '../../services/api_client.dart';
import '../scheme_selection/scheme_selection_screen.dart';

class WelcomeScreen extends StatefulWidget {
  const WelcomeScreen({super.key});

  @override
  State<WelcomeScreen> createState() => _WelcomeScreenState();
}

class _WelcomeScreenState extends State<WelcomeScreen> {
  final TextEditingController _phoneController = TextEditingController(text: '9876543210');
  bool _consentGiven = true;
  bool _isLoading = false;
  final ApiClient _apiClient = ApiClient();

  void _handleStart() async {
    if (!_consentGiven) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('कृपया आगे बढ़ने के लिए सहमति प्रदान करें (Consent is required)')),
      );
      return;
    }

    setState(() => _isLoading = true);
    try {
      final session = await _apiClient.createSession('+91${_phoneController.text.trim()}');
      final draft = await _apiClient.createDraft();
      
      if (!mounted) return;
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (context) => SchemeSelectionScreen(
            sessionId: session['session_id'],
            draftId: draft['draft_id'],
          ),
        ),
      );
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('त्रुटि: $e')),
      );
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Row(
          children: [
            Text('🌾 GramSathi AI (ग्राम साथी)', style: TextStyle(fontWeight: FontWeight.bold)),
          ],
        ),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'नमस्ते! आपका स्वागत है।',
                style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
              ),
              const SizedBox(height: 8),
              const Text(
                'सरकारी योजनाओं व छात्रवृत्ति आवेदन की सुगम तैयारी सहायक।',
                style: TextStyle(fontSize: 15, color: Color(0xFF475569)),
              ),
              const SizedBox(height: 32),
              
              // Mobile number input
              const Text(
                'मोबाइल नंबर दर्ज करें:',
                style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 8),
              TextField(
                controller: _phoneController,
                keyboardType: TextInputType.phone,
                decoration: const InputDecoration(
                  prefixText: '+91 ',
                  hintText: '10 अंकों का मोबाइल नंबर',
                ),
              ),
              const SizedBox(height: 20),

              // DPDP Consent Checkbox
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: const Color(0xFFF1F5F9),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: const Color(0xFFCBD5E1)),
                ),
                child: Row(
                  children: [
                    Checkbox(
                      value: _consentGiven,
                      onChanged: (val) => setState(() => _consentGiven = val ?? false),
                    ),
                    const Expanded(
                      child: Text(
                        'मैं डिजिटल पर्सनल डेटा प्रोटेक्शन (DPDP) के तहत छात्रवृत्ति आवेदन तैयार करने हेतु सहमति प्रदान करता/करती हूँ।',
                        style: TextStyle(fontSize: 12, color: Color(0xFF334155)),
                      ),
                    ),
                  ],
                ),
              ),

              const Spacer(),

              // Start Button
              ElevatedButton(
                onPressed: _isLoading ? null : _handleStart,
                child: _isLoading
                    ? const CircularProgressIndicator(color: Colors.white)
                    : const Text('प्रारंभ करें (Start Application) →'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

