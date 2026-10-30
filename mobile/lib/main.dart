import 'package:flutter/material.dart';
import 'core/theme/app_theme.dart';
import 'features/onboarding/welcome_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const GramSathiApp());
}

class GramSathiApp extends StatelessWidget {
  const GramSathiApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'GramSathi AI (ग्राम साथी)',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      home: const WelcomeScreen(),
    );
  }
}

