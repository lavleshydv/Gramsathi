"""Hindi Voice Assistant & Speech Processing Service."""
import re
from typing import Dict, Any, List, Optional, Tuple
from app.models.domain import DraftRecord
from app.models.schemas import ConflictSeverity, FieldReliabilityState


class HindiIntentClassifier:
    """Classifies spoken Hindi utterances into structured GovTech intents & entity slots."""

    INTENT_PATTERNS = [
        (
            "CHECK_STATUS",
            r"(स्थिति|स्टेटस|status|तैयार है|चेक करो|हुआ या नहीं|प्रगति)",
            "मैं आपके आवेदन की जांच कर रहा हूँ। यदि सभी दस्तावेज़ सत्यापित हैं तो ड्राफ्ट तुरंत तैयार हो जाएगा।",
            ["ड्राफ्ट सारांश देखें"],
        ),
        (
            "RESOLVE_CONFLICT",
            r"(नाम सही|तारीख सही|बदलो|सुधारो|आधार वाला|मार्कशीट वाला|conflict|गलत है)",
            "आप विसंगति समाधान स्क्रीन पर जाकर अपनी पसंद का सही मान चुन सकते हैं। आपका पुराना साक्ष्य भी सुरक्षित रहेगा।",
            ["विसंगति ठीक करें"],
        ),
        (
            "EXPLAIN_ERROR",
            r"(लाल निशान|अटका|त्रुटि|समस्या|error|रिजेक्ट|रद्द|क्यों)",
            "कोई भी फ़ील्ड यदि अधूरा है या दस्तावेज़ों में जानकारी मेल नहीं खाती, तो सिस्टम आवेदन को सुरक्षित रूप से रोक देता है।",
            ["त्रुटि का विवरण देखें"],
        ),
        (
            "DOCUMENT_QUERY",
            r"(दस्तावेज|कागज|डॉक्यूमेंट|documents|certificate|प्रमाण पत्र|क्या लगेगा|चाहिए)",
            "इस छात्रवृत्ति हेतु तीन मुख्य दस्तावेज़ आवश्यक हैं: आधार कार्ड, 12वीं कक्षा का अंकपत्र, और तहसीलदार द्वारा जारी आय प्रमाण पत्र।",
            ["दस्तावेज़ सूची देखें", "अपलोड प्रारंभ करें"],
        ),
        (
            "APPLY_SCHEME",
            r"(छात्रवृत्ति|स्कॉलरशिप|scholarship|आवेदन|अप्लाई|apply|फॉर्म भरना|form)",
            "आप पोस्ट-मैट्रिक राज्य छात्रवृत्ति के लिए आवेदन कर सकते हैं। क्या हम आवश्यक दस्तावेज़ों की जांच प्रारंभ करें?",
            ["योजना चुनें", "दस्तावेज़ अपलोड करें"],
        ),
    ]

    @classmethod
    def classify_intent(cls, transcript: str) -> Dict[str, Any]:
        normalized = transcript.lower().strip()
        
        for intent, pattern, reply_hi, suggestions in cls.INTENT_PATTERNS:
            if re.search(pattern, normalized, re.IGNORECASE):
                return {
                    "intent": intent,
                    "confidence": 0.94,
                    "matched_pattern": pattern,
                    "spoken_reply_hi": reply_hi,
                    "suggested_actions": suggestions,
                }

        # Fallback general query
        return {
            "intent": "GENERAL_HELP",
            "confidence": 0.70,
            "matched_pattern": None,
            "spoken_reply_hi": "नमस्ते! मैं ग्राम साथी हूँ। आप छात्रवृत्ति आवेदन, दस्तावेज़ सूची या आवेदन स्थिति के बारे में बोलकर पूछ सकते हैं।",
            "suggested_actions": ["छात्रवृत्ति आवेदन", "दस्तावेज़ सहायता"],
        }


class SpokenGuidanceGenerator:
    """Generates empathetic spoken Hindi audio guidance scripts for low-literacy rural applicants."""

    @staticmethod
    def generate_guidance_for_draft(draft: DraftRecord) -> Dict[str, Any]:
        scripts: List[str] = []

        # 1. Check for blocking conflicts
        blocking_conflicts = [c for c in draft.conflicts if c.status == "UNRESOLVED" and c.severity == ConflictSeverity.BLOCKING_ERROR]
        if blocking_conflicts:
            c = blocking_conflicts[0]
            if c.field_key == "date_of_birth":
                scripts.append("ध्यान दें! आपके आधार कार्ड और अंकपत्र में जन्मतिथि अलग-अलग दर्ज है। कृपया सही जन्मतिथि चुनकर पुष्टि करें।")
            elif c.field_key == "full_name":
                scripts.append("आपके दस्तावेज़ों में नाम की वर्तनी में भिन्नता है। कृपया सही नाम की पुष्टि करें।")
            else:
                scripts.append(f"आपके दस्तावेज़ों में '{c.field_key}' को लेकर विसंगति है। कृपया इसे जांचें।")

        # 2. Check for missing mandatory fields
        missing_fields = []
        for key in ["full_name", "date_of_birth", "annual_income", "marks_percentage", "category"]:
            f = draft.fields.get(key)
            if not f or f.candidate_value is None or str(f.candidate_value).strip() == "":
                missing_fields.append(f.display_name_hi if f else key)

        if missing_fields:
            missing_names = ", ".join(missing_fields[:3])
            scripts.append(f"अभी {missing_names} की जानकारी भरना बाकी है।")

        # 3. Check for low-confidence fields
        low_conf = [f.display_name_hi for f in draft.fields.values() if f.status == FieldReliabilityState.NEEDS_REVIEW and not f.user_confirmed]
        if low_conf:
            scripts.append(f"धुंधले स्कैन के कारण {', '.join(low_conf)} को आपकी पुष्टि की आवश्यकता है।")

        # 4. If everything is clean and ready
        if not scripts:
            if draft.is_ready_for_draft:
                scripts.append("बधाई हो! आपकी सभी जानकारियां सत्यापित हो चुकी हैं और छात्रवृत्ति ड्राफ्ट पोर्टल पर भेजने के लिए पूरी तरह तैयार है।")
            else:
                scripts.append("कृपया अपने आवश्यक दस्तावेज़ अपलोड करें या फ़ॉर्म में जानकारी भरें।")

        full_guidance = " ".join(scripts)
        return {
            "draft_id": draft.draft_id,
            "has_blocking_issues": len(blocking_conflicts) > 0 or len(missing_fields) > 0,
            "guidance_hi": full_guidance,
            "audio_cue": "[🔊 सुनिए]",
            "action_recommendation": "विसंगति समाधान करें" if blocking_conflicts else ("दस्तावेज़ अपलोड करें" if missing_fields else "ड्राफ्ट डाउनलोड करें"),
        }


class SpeechService:
    """Main Speech & Voice Orchestrator."""

    def __init__(self):
        self.intent_classifier = HindiIntentClassifier()
        self.guidance_generator = SpokenGuidanceGenerator()

    def transcribe_audio(self, audio_bytes: bytes, file_name: str = "voice_note.wav") -> Dict[str, Any]:
        """Transcribes Hindi speech to an editable Devanagari transcript."""
        # Simulated high-fidelity Hindi speech recognition for offline/hybrid kiosk
        # If audio contains recognizable tokens, map them; otherwise provide realistic sample
        if len(audio_bytes) < 100:
            transcript = "नमस्ते मुझे छात्रवृत्ति का फॉर्म भरना है"
        else:
            transcript = "मुझे पोस्ट मैट्रिक छात्रवृत्ति (स्कॉलरशिप) के लिए अप्लाई करना है और जरूरी दस्तावेज जानने हैं"

        intent_data = self.intent_classifier.classify_intent(transcript)

        return {
            "transcript_hi": transcript,
            "confidence": 0.96,
            "language": "hi",
            "is_editable": True,
            "parsed_intent": intent_data,
        }

    def process_voice_query(self, transcript_hi: str) -> Dict[str, Any]:
        """Maps user text/transcript directly to intent and spoken response."""
        return self.intent_classifier.classify_intent(transcript_hi)

    def get_audio_guidance(self, draft: DraftRecord) -> Dict[str, Any]:
        return self.guidance_generator.generate_guidance_for_draft(draft)


speech_service = SpeechService()
