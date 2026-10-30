import 'package:flutter/material.dart';

class AppTheme {
  // Brand color palette optimized for high outdoor sunlight contrast
  static const Color kisanGreenPrimary = Color(0xFF14532D);   // Dark Emerald Green (Primary)
  static const Color kisanGreenLight = Color(0xFF16A34A);     // Leaf Green
  static const Color sarsonYellow = Color(0xFFD97706);        // Mustard Yellow (Accent)
  static const Color panchayatNavy = Color(0xFF0F172A);       // Dark Navy Slate
  static const Color alertRed = Color(0xFFDC2626);            // Error / Conflict Red
  static const Color surfaceWarm = Color(0xFFF8FAFC);         // Crisp Sunlight Background

  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      colorScheme: ColorScheme.fromSeed(
        seedColor: kisanGreenPrimary,
        primary: kisanGreenPrimary,
        secondary: sarsonYellow,
        background: surfaceWarm,
        surface: Colors.white,
        error: alertRed,
      ),
      scaffoldBackgroundColor: surfaceWarm,
      appBarTheme: const AppBarTheme(
        backgroundColor: kisanGreenPrimary,
        foregroundColor: Colors.white,
        elevation: 2,
        centerTitle: false,
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: kisanGreenPrimary,
          foregroundColor: Colors.white,
          minimumSize: const Size(double.infinity, 54), // Large 48-54px touch targets
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          textStyle: const TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: Colors.white,
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: Color(0xFFCBD5E1), width: 1.5),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: kisanGreenPrimary, width: 2.5),
        ),
      ),
    );
  }
}

