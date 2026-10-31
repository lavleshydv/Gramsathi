"""Phase 7 Verification: Test Hindi Voice Assistant, Intent Mapping & Spoken Guidance."""
import unittest
from app.services.speech_service import speech_service, HindiIntentClassifier, SpokenGuidanceGenerator
from app.database.store import store
from app.models.domain import ConflictRecord
from app.models.schemas import ConflictType, ConflictSeverity


class TestHindiVoiceAssistant(unittest.TestCase):
    def test_hindi_intent_classification(self):
        # 1. Apply Scheme
        res_apply = speech_service.process_voice_query("मुझे छात्रवृत्ति का फॉर्म भरना है")
        self.assertEqual(res_apply["intent"], "APPLY_SCHEME")
        self.assertIn("छात्रवृत्ति", res_apply["spoken_reply_hi"])

        # 2. Document Query
        res_docs = speech_service.process_voice_query("कौन-कौन से दस्तावेज लगेंगे?")
        self.assertEqual(res_docs["intent"], "DOCUMENT_QUERY")
        self.assertIn("दस्तावेज़", res_docs["spoken_reply_hi"])

        # 3. Check Status
        res_status = speech_service.process_voice_query("मेरे आवेदन का स्टेटस क्या है?")
        self.assertEqual(res_status["intent"], "CHECK_STATUS")

        # 4. Resolve Conflict
        res_conflict = speech_service.process_voice_query("आधार वाला नाम सही रखो")
        self.assertEqual(res_conflict["intent"], "RESOLVE_CONFLICT")

        # 5. Explain Error
        res_error = speech_service.process_voice_query("यह लाल निशान क्यों आ रहा है?")
        self.assertEqual(res_error["intent"], "EXPLAIN_ERROR")

    def test_audio_transcription_returns_editable_devanagari(self):
        sample_audio = b"RIFF" + b"\x00" * 120  # mock audio header & bytes
        result = speech_service.transcribe_audio(sample_audio)

        self.assertTrue(result["is_editable"])
        self.assertEqual(result["language"], "hi")
        self.assertGreaterEqual(result["confidence"], 0.90)
        self.assertIn("छात्रवृत्ति", result["transcript_hi"])

    def test_spoken_guidance_for_conflicted_dob(self):
        """Generates spoken audio script alerting user about DOB contradiction."""
        draft = store.create_draft(service_id="POST_MATRIC_STATE_SCHOLARSHIP")
        
        # Inject DOB contradiction
        conflict = ConflictRecord(
            field_key="date_of_birth",
            conflict_type=ConflictType.MATERIAL_CONTRADICTION,
            severity=ConflictSeverity.BLOCKING_ERROR,
            message_hi="जन्मतिथि में गंभीर विसंगति",
            message_en="Material contradiction in date_of_birth",
            evidence_ids=["DOC1", "DOC2"],
            conflicting_values=[],
        )
        draft.conflicts.append(conflict)

        guidance = speech_service.get_audio_guidance(draft)
        self.assertTrue(guidance["has_blocking_issues"])
        self.assertEqual(guidance["audio_cue"], "[🔊 सुनिए]")
        self.assertIn("जन्मतिथि", guidance["guidance_hi"])
        self.assertIn("पुष्टि", guidance["guidance_hi"])

    def test_spoken_guidance_for_clean_ready_draft(self):
        """Generates celebratory audio guidance when draft is ready."""
        draft = store.create_draft(service_id="POST_MATRIC_STATE_SCHOLARSHIP")
        draft.is_ready_for_draft = True
        
        # Fill all required fields
        for key in ["full_name", "date_of_birth", "annual_income", "marks_percentage", "category", "institution_name"]:
            draft.fields[key].candidate_value = "Verified Val"
            draft.fields[key].user_confirmed = True

        guidance = speech_service.get_audio_guidance(draft)
        self.assertFalse(guidance["has_blocking_issues"])
        self.assertIn("बधाई हो", guidance["guidance_hi"])


if __name__ == "__main__":
    unittest.main()

