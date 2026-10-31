export type Language = 'en' | 'hi';

export const CONTENT = {
  en: {
    nav: {
      brand: 'GramSathi AI',
      tagline: 'Government Services, Made Simpler for Every Village',
      links: [
        { label: 'Home', href: '/#home' },
        { label: 'How It Works', href: '/#how-it-works' },
        { label: 'Core Innovation', href: '/#innovation' },
        { label: 'Services', href: '/#services' },
        { label: 'Accessibility', href: '/#accessibility' },
        { label: 'Privacy', href: '/#privacy' },
      ],
      language: 'हिन्दी',
      signIn: 'Sign In',
      getStarted: 'Get Started',
    },
    hero: {
      eyebrow: 'DIGITAL ACCESS FOR EVERY VILLAGE',
      headline: 'Government Services, Made Simpler for Every Village.',
      subtext:
        'Understand government schemes, organise your documents and prepare applications with guided assistance in your language. Less confusion, fewer mistakes and greater access to essential services.',
      primaryCta: 'Get Started',
      secondaryCta: 'Explore How It Works',
      trustStatement: 'Designed for accessibility, clarity and user-controlled applications.',
      preview: {
        welcomeBadge: 'Active Application Session',
        welcomeUser: 'Namaste, Yash Ji',
        location: 'Rampur Village, Bilari Block, Moradabad',
        schemeTitle: 'UP Post-Matric Scholarship 2026',
        schemeDept: 'Social Welfare & Backward Class Welfare Dept',
        progressLabel: 'Draft Preparation Progress',
        progressPercent: '80%',
        checklistTitle: 'Required Document Evidence',
        doc1: { name: 'Aadhaar Identity Card', status: 'Verified', size: '1.2 MB' },
        doc2: { name: 'Class 12 Marksheet', status: 'Verified', size: '2.4 MB' },
        doc3: { name: 'Income Certificate (Tehsildar)', status: 'Review Required', size: '1.8 MB' },
        extractedTitle: 'Extracted Field Provenance',
        field1: { key: 'Applicant Name', val: 'Yash Sharma', source: 'Aadhaar (Page 1)' },
        field2: { key: 'Date of Birth', val: '12 April 2005', source: 'Marksheet (Page 1)' },
        field3: { key: 'Annual Household Income', val: '₹1,20,000', source: 'Income Certificate (Page 1)' },
        reviewWarningTitle: 'Review Required: Name Variation Flagged',
        reviewWarningText: 'Aadhaar indicates "Yash Sharma" while Marksheet indicates "Yash S Sharma". User confirmation required before draft acceptance.',
        confirmCta: 'Resolve Discrepancy',
      },
    },
    trust: {
      items: [
        {
          title: 'Accessible by Voice',
          desc: 'Speak naturally in Hindi or your regional language to explore schemes and understand requirements.',
        },
        {
          title: 'Document-Aware Assistance',
          desc: 'Extract information with complete source provenance and automatic cross-document verification.',
        },
        {
          title: 'Clear Application Guidance',
          desc: 'Step-by-step assistance that prepares reviewable drafts without automated guesswork or hidden errors.',
        },
      ],
    },
    problemSolution: {
      heading: "Accessing Government Services Shouldn't Be Complicated.",
      subheading: 'Rural citizens face systemic administrative barriers that cause eligible applications to be delayed or rejected.',
      problemTitle: 'The Reality Today',
      problems: [
        {
          title: 'Complicated Online Portals',
          desc: 'Multi-step digital portals with dense English forms and confusing terminology.',
        },
        {
          title: 'Unclear Document Requirements',
          desc: 'Lack of clarity regarding which certificates are mandatory, valid, or missing.',
        },
        {
          title: 'Language & Literacy Barriers',
          desc: 'Interfaces not built for non-English speakers or low-literacy rural households.',
        },
        {
          title: 'Silent Cross-Document Inconsistencies',
          desc: 'Slight spelling, initial, or date variations across documents lead to outright rejection.',
        },
        {
          title: 'Uncertain Application Status',
          desc: 'No clear guidance on next steps, corrections, or official portal hand-off instructions.',
        },
      ],
      solutionTitle: "GramSathi's Approach",
      solutionHeadline: 'One guided process. From understanding a service to preparing your application.',
      solutions: [
        {
          title: 'Guided Conversational Assistance',
          desc: 'Understand eligibility and requirements through conversational voice or text in Hindi.',
        },
        {
          title: 'Precise Document Checklists',
          desc: 'Know exactly what certificates are needed before beginning, reducing multiple visits.',
        },
        {
          title: 'Evidence-Linked Field Extraction',
          desc: 'Every extracted value remains visibly linked to its source page and bounding region.',
        },
        {
          title: 'Deterministic Conflict Identification',
          desc: 'Cross-document differences are flagged transparently for user confirmation before submission.',
        },
        {
          title: 'User-Controlled Application Draft',
          desc: 'Generate an editable, reviewable draft ready for manual submission to official portals.',
        },
      ],
    },
    howItWorks: {
      eyebrow: 'CLEAR & STRUCTURED WORKFLOW',
      heading: 'How GramSathi AI Works',
      subheading: 'A six-stage journey designed for transparency, simplicity, and zero accidental errors.',
      steps: [
        {
          number: '01',
          title: 'Choose a Service',
          desc: 'Identify the target government welfare scheme or scholarship suited to your profile.',
        },
        {
          number: '02',
          title: 'Explain Your Need',
          desc: 'Speak or type in Hindi or your preferred language to establish basic eligibility parameters.',
        },
        {
          number: '03',
          title: 'Upload Documents',
          desc: 'Upload only the specific certificates required for the chosen workflow via camera or file picker.',
        },
        {
          number: '04',
          title: 'Extract and Review',
          desc: 'Optical extraction reads relevant fields while preserving exact source provenance and confidence.',
        },
        {
          number: '05',
          title: 'Resolve and Validate',
          desc: 'Cross-document checks flag spelling variations or discrepancies for user confirmation.',
        },
        {
          number: '06',
          title: 'Prepare Your Draft',
          desc: 'Generate an editable, validated draft summary ready for final official portal submission.',
        },
      ],
    },
    innovation: {
      eyebrow: 'PATENT-PENDING CORE ARCHITECTURE',
      heading: 'Information You Can Trace. Applications You Can Review.',
      subheading:
        'Existing form-fillers blindly overwrite data or hallucinate. GramSathi AI introduces Evidence-Linked, Confidence-Gated Application Generation.',
      workflowLabel: 'The Verification Pipeline',
      steps: [
        'Uploaded Documents',
        'Field Extraction',
        'Evidence Linking',
        'Cross-Document Reconciliation',
        'User Confirmation',
        'Controlled Draft Generation',
      ],
      benefits: [
        {
          title: 'Complete Source Provenance',
          desc: 'Every extracted value retains its document identifier, page number, and spatial bounding box.',
        },
        {
          title: 'Cross-Document Conflict Detection',
          desc: 'Variations in names, dates, or values between independent documents are flagged deterministically.',
        },
        {
          title: 'No Blind Confidence Assumptions',
          desc: 'Uncertain, blurred, or low-confidence text is never silently accepted into an official draft.',
        },
        {
          title: 'Audited User Correction',
          desc: 'Citizens and kiosk operators can review discrepancies and select authoritative values with full audit history.',
        },
        {
          title: 'Editable, Gated Draft Generation',
          desc: 'The draft controller prevents conflicted or unverified information from entering the final submission.',
        },
      ],
      diagram: {
        docA: 'Aadhaar Card (PDF)',
        docB: 'Class 12 Marksheet (JPG)',
        fieldA: 'Extracted: "Yash Sharma"',
        fieldB: 'Extracted: "Yash S Sharma"',
        reconcileTitle: 'Deterministic Reconciliation Engine',
        conflictFlag: 'Flagged: Spelling / Initial Variation',
        stateLabel: 'State: Needs User Review',
        userAction: 'User Confirms Authoritative Name: "Yash Sharma"',
        draftStatus: 'Draft Generation Gate: APPROVED',
      },
    },
    services: {
      eyebrow: 'APPLICATION DOMAINS',
      heading: 'Services Supported by GramSathi AI',
      subheading:
        'Comprehensive, evidence-gated documentation assistance across core rural citizen welfare domains.',
      items: [
        {
          title: 'Scholarship Assistance',
          desc: 'Complete guided preparation for state and central pre-matric and post-matric scholarship programs.',
          status: 'Available Prototype',
          isAvailable: true,
          tag: 'Active Workflow',
        },
        {
          title: 'Government Certificates',
          desc: 'Automated evidence linking and preparation for income certificates, caste certificates, and permanent domicile.',
          status: 'Available Prototype',
          isAvailable: true,
          tag: 'Active Workflow',
        },
        {
          title: 'Farmer & Agriculture Schemes',
          desc: 'Statutory landholding verification and document preparation for PM-KISAN, crop insurance, and equipment subsidies.',
          status: 'Available Prototype',
          isAvailable: true,
          tag: 'Active Workflow',
        },
        {
          title: 'Pension Assistance',
          desc: 'Statutory age and BPL income verification for old-age, widow, and disability social welfare pension schemes.',
          status: 'Available Prototype',
          isAvailable: true,
          tag: 'Active Workflow',
        },
        {
          title: 'Document Organisation',
          desc: 'Structured digital document checklist verifying certificate validity, readability, and completeness.',
          status: 'Available Prototype',
          isAvailable: true,
          tag: 'Active Workflow',
        },
        {
          title: 'Application Guidance',
          desc: 'Step-by-step oral and visual instructions for navigating state portals and CSC service centers.',
          status: 'Available Prototype',
          isAvailable: true,
          tag: 'Active Workflow',
        },
      ],
    },
    accessibility: {
      eyebrow: 'RURAL-FIRST ACCESSIBILITY',
      heading: 'Engineered for Real Village Conditions',
      subheading:
        'Built specifically for the device, language, and network realities of rural Indian communities.',
      features: [
        {
          title: 'Hindi-First Experience',
          desc: 'Primary natural interface in Hindi with high-quality Noto Sans Devanagari typography and clear phrasing.',
        },
        {
          title: 'Natural Voice and Text Input',
          desc: 'Citizens can speak their requests naturally or type with real-time editable Devanagari transcripts.',
        },
        {
          title: 'High Outdoor Contrast (WCAG AAA)',
          desc: 'Carefully calibrated forest green, warm off-white, and dark text visible under harsh direct midday sunlight.',
        },
        {
          title: 'Large 48×48px Touch Ergonomics',
          desc: 'Comfortable touch targets designed for field usage on entry-level Android smartphones.',
        },
        {
          title: 'Plain-Language Explanations',
          desc: 'No confusing bureaucratic jargon. Errors and missing documents are explained in simple rural phrasing.',
        },
        {
          title: 'Zero Automated Overwrites',
          desc: 'The user maintains final control over all extracted information prior to draft generation.',
        },
      ],
      interactiveVoice: {
        title: 'Voice Assistant Preview',
        subtitle: 'Listen to a typical oral guidance explanation',
        sampleQuery: '"मुझे छात्रवृत्ति के लिए कौन से दस्तावेज चाहिए?"',
        sampleResponse:
          '"नमस्ते! उत्तर प्रदेश पोस्ट-मैट्रिक छात्रवृत्ति के लिए आपको 3 मुख्य दस्तावेज चाहिए: आधार कार्ड, 12वीं की अंकतालिका, और तहसीलदार द्वारा जारी आय प्रमाण पत्र।"',
        playButton: 'Listen to Guidance',
        playingText: 'Playing Guidance Audio...',
      },
    },
    privacy: {
      eyebrow: 'DATA GOVERNANCE & DPDP ACT 2023',
      heading: 'Your Documents Deserve Careful Handling.',
      subheading:
        'GramSathi AI is built on principles of minimal collection, strict purpose limitation, and absolute citizen data control.',
      pillars: [
        {
          title: 'Purpose-Bound Ingestion',
          desc: 'We only request certificates required for the specific government application you choose to prepare.',
        },
        {
          title: 'Transparent Purpose Explanation',
          desc: 'Every document request clearly explains which statutory requirement it satisfies.',
        },
        {
          title: 'Private Encrypted Storage',
          desc: 'Uploaded certificates are stored in isolated, encrypted object storage outside public web access.',
        },
        {
          title: 'Masked Identity Attributes',
          desc: 'Aadhaar numbers are automatically masked to the final 4 digits. Full 12-digit numbers are never logged or stored.',
        },
        {
          title: 'User-Triggered Hard Purge',
          desc: 'Citizens can purge uploaded documents and derived evidence records at any time with a single tap.',
        },
        {
          title: 'Zero Credential Requests',
          desc: 'GramSathi AI will never ask for bank passwords, OTPs, or PINs. Applications are submitted solely by the citizen.',
        },
      ],
    },
    cta: {
      heading: 'Take the First Step Towards Simpler Applications.',
      subheading:
        'Get guided assistance in understanding services, organising documents and preparing your application with verified evidence.',
      primaryButton: 'Get Started',
      secondaryButton: 'Explore How It Works',
    },
    footer: {
      desc: 'GramSathi AI is a voice-first government services and documentation assistant designed for rural India, helping citizens prepare evidence-linked, verified application drafts.',
      quickLinksTitle: 'Navigation',
      servicesTitle: 'Services',
      contactTitle: 'Support & Inquiries',
      email: 'contact@gramsathi.ai',
      location: 'New Delhi & Moradabad, Uttar Pradesh, India',
      legalTitle: 'Legal & Compliance',
      privacyPolicy: 'Privacy Policy (DPDP 2023)',
      termsOfUse: 'Terms of Service',
      disclaimerHeading: 'Official Public Service Disclaimer',
      disclaimer:
        'GramSathi AI is an independent assistance platform. It does not represent a government authority or guarantee scheme eligibility or application approval. Users remain responsible for reviewing and submitting applications through official channels.',
      copyright: '© 2026 GramSathi AI. Built for rural digital inclusion and transparent governance.',
    },
  },
  hi: {
    nav: {
      brand: 'ग्राम साथी AI',
      tagline: 'सरकारी सेवाएं, हर गांव के लिए आसान',
      links: [
        { label: 'होम', href: '/#home' },
        { label: 'प्रक्रिया', href: '/#how-it-works' },
        { label: 'प्रमाण प्रणाली', href: '/#innovation' },
        { label: 'सेवाएं', href: '/#services' },
        { label: 'सुलभता', href: '/#accessibility' },
        { label: 'सुरक्षा', href: '/#privacy' },
      ],
      language: 'English',
      signIn: 'लॉग इन',
      getStarted: 'शुरू करें',
    },
    hero: {
      eyebrow: 'हर गांव तक डिजिटल पहुंच',
      headline: 'सरकारी सेवाएं, हर गांव के लिए आसान।',
      subtext:
        'अपनी भाषा में सरकारी योजनाओं को समझें, दस्तावेज़ व्यवस्थित करें और बिना किसी गलती के आवेदन का मसौदा तैयार करें। कम उलझन, शून्य गलतियां और योजनाओं का पूरा लाभ।',
      primaryCta: 'शुरू करें',
      secondaryCta: 'प्रक्रिया देखें',
      trustStatement: 'सुलभता, स्पष्टता और नागरिक के पूर्ण नियंत्रण के लिए निर्मित।',
      preview: {
        welcomeBadge: 'सक्रिय आवेदन सत्र',
        welcomeUser: 'नमस्ते, यश जी',
        location: 'ग्राम रामपुर, बिलारी ब्लॉक, मुरादाबाद',
        schemeTitle: 'उ.प्र. पोस्ट-मैट्रिक छात्रवृत्ति 2026',
        schemeDept: 'समाज कल्याण एवं पिछड़ा वर्ग कल्याण विभाग',
        progressLabel: 'आवेदन मसौदा प्रगति',
        progressPercent: '80%',
        checklistTitle: 'आवश्यक दस्तावेज़ प्रमाण',
        doc1: { name: 'आधार पहचान पत्र', status: 'सत्यापित', size: '1.2 MB' },
        doc2: { name: '12वीं कक्षा अंकतालिका', status: 'सत्यापित', size: '2.4 MB' },
        doc3: { name: 'आय प्रमाण पत्र (तहसीलदार)', status: 'जांच आवश्यक', size: '1.8 MB' },
        extractedTitle: 'दस्तावेज़ से निकाली गई जानकारी',
        field1: { key: 'आवेदक का नाम', val: 'यश शर्मा', source: 'आधार कार्ड (पृष्ठ 1)' },
        field2: { key: 'जन्म तिथि', val: '12 अप्रैल 2005', source: 'अंकतालिका (पृष्ठ 1)' },
        field3: { key: 'वार्षिक पारिवारिक आय', val: '₹1,20,000', source: 'आय प्रमाण पत्र (पृष्ठ 1)' },
        reviewWarningTitle: 'जांच आवश्यक: नाम में अंतर मिला',
        reviewWarningText: 'आधार कार्ड में "Yash Sharma" है जबकि अंकतालिका में "Yash S Sharma" है। आवेदन आगे बढ़ाने से पहले पुष्टि करें।',
        confirmCta: 'अंतर की पुष्टि करें',
      },
    },
    trust: {
      items: [
        {
          title: 'बोलकर पूछें',
          desc: 'अपनी मातृभाषा में बोलकर योजनाओं की जानकारी पाएं और आवेदन की शर्तें समझें।',
        },
        {
          title: 'दस्तावेज़ आधारित प्रमाण',
          desc: 'प्रत्येक जानकारी का स्रोत स्पष्ट दिखता है और दस्तावेजों का आपस में मिलान होता है।',
        },
        {
          title: 'स्पष्ट आवेदन मार्गदर्शन',
          desc: 'कदम-दर-कदम सहायता जो बिना किसी अंदेशे या छिपी गलती के समीक्षा योग्य मसौदा बनाती है।',
        },
      ],
    },
    problemSolution: {
      heading: 'सरकारी सेवाओं का लाभ पाना कठिन नहीं होना चाहिए।',
      subheading: 'ग्रामीण नागरिकों को जटिल प्रक्रियाओं और छोटी गलतियों के कारण योजनाओं से वंचित होना पड़ता है।',
      problemTitle: 'आज की जमीनी समस्याएं',
      problems: [
        {
          title: 'जटिल ऑनलाइन पोर्टल',
          desc: 'अंग्रेजी में बने लंबे फॉर्म और कठिन तकनीकी शब्द जो आम नागरिक की समझ से बाहर हैं।',
        },
        {
          title: 'दस्तावेजों की अधूरी जानकारी',
          desc: 'यह स्पष्ट न होना कि कौन सा प्रमाण पत्र मान्य है और कौन सा छूट गया है।',
        },
        {
          title: 'भाषा और साक्षरता की बाधा',
          desc: 'पोर्टल स्थानीय और ग्रामीण भाषाओं में सरल निर्देश प्रदान नहीं करते।',
        },
        {
          title: 'दस्तावेजों में नाम या स्पेलिंग का अंतर',
          desc: 'आधार और मार्कशीट में एक अक्षर का अंतर भी फॉर्म को सीधे निरस्त करवा देता है।',
        },
        {
          title: 'आवेदन की स्थिति की अनिश्चितता',
          desc: 'गलती होने पर यह पता न चलना कि सुधार कैसे और कहां जाकर करना है।',
        },
      ],
      solutionTitle: 'ग्राम साथी AI का समाधान',
      solutionHeadline: 'एक सरल मार्ग। योजना समझने से लेकर सही आवेदन तैयार करने तक।',
      solutions: [
        {
          title: 'बोलकर मार्गदर्शन पाएं',
          desc: 'हिंदी में बातचीत करके अपनी पात्रता जांचें और जरूरी शर्तें सरल शब्दों में समझें।',
        },
        {
          title: 'दस्तावेजों की सटीक सूची',
          desc: 'आवेदन शुरू करने से पहले ही पता चल जाता है कि कौन से कागजात जरूरी हैं।',
        },
        {
          title: 'प्रमाण-आधारित जानकारी',
          desc: 'फॉर्म में भरा जाने वाला हर विवरण उसके मूल दस्तावेज़ से जुड़ा रहता है।',
        },
        {
          title: 'अंतर का समय पर पता लगाना',
          desc: 'दस्तावेजों में किसी भी भिन्नता को पहले ही पहचान कर आवेदक से पुष्टि कराई जाती है।',
        },
        {
          title: 'समीक्षा योग्य पक्का मसौदा',
          desc: 'एक जांचा-परखा आवेदन मसौदा तैयार होता है जिसे आप आधिकारिक पोर्टल पर सुरक्षित जमा कर सकते हैं।',
        },
      ],
    },
    howItWorks: {
      eyebrow: 'सरल एवं पारदर्शी प्रक्रिया',
      heading: 'ग्राम साथी AI कैसे कार्य करता है',
      subheading: 'छह चरणों की सुव्यवस्थित प्रक्रिया, जो बिना किसी गलती के पारदर्शी आवेदन सुनिश्चित करती है।',
      steps: [
        {
          number: '01',
          title: 'सेवा चुनें',
          desc: 'अपनी जरूरत के अनुसार छात्रवृत्ति या सरकारी योजना का चयन करें।',
        },
        {
          number: '02',
          title: 'बोलकर आवश्यकता बताएं',
          desc: 'हिंदी में बोलकर या लिखकर अपनी जानकारी और पात्रता की प्राथमिक स्थिति बताएं।',
        },
        {
          number: '03',
          title: 'दस्तावेज़ अपलोड करें',
          desc: 'मोबाइल कैमरे या फाइल से केवल वही दस्तावेज़ जोड़ें जो योजना के लिए अनिवार्य हैं।',
        },
        {
          number: '04',
          title: 'विवरण जांचें',
          desc: 'सिस्टम दस्तावेज़ से जानकारी पढ़कर उसके मूल पृष्ठ और बॉक्स के साथ दिखाता है।',
        },
        {
          number: '05',
          title: 'अंतर का समाधान करें',
          desc: 'यदि दो दस्तावेजों में नाम या पते में भिन्नता है, तो सही विकल्प चुनकर पुष्टि करें।',
        },
        {
          number: '06',
          title: 'मसौदा तैयार करें',
          desc: 'सभी जांचों के बाद एक संपूर्ण आवेदन मसौदा प्राप्त करें जिसे आधिकारिक पोर्टल पर जमा किया जा सके।',
        },
      ],
    },
    innovation: {
      eyebrow: 'पेटेंट-योग्य मूल तकनीक',
      heading: 'ऐसी जानकारी जिसका प्रमाण हो। ऐसा आवेदन जिसे आप परख सकें।',
      subheading:
        'पारंपरिक सॉफ्टवेयर बिना जांचे जानकारी भरते हैं। ग्राम साथी AI प्रमाण-संबद्ध और विश्वास-नियंत्रित मसौदा प्रणाली का उपयोग करता है।',
      workflowLabel: 'प्रमाण सत्यापन प्रक्रिया',
      steps: [
        'दस्तावेज़ अपलोड',
        'विवरण निष्कर्षण',
        'प्रमाण संबद्धता',
        'दस्तावेज़ मिलान',
        'नागरिक पुष्टि',
        'नियंत्रित मसौदा निर्माण',
      ],
      benefits: [
        {
          title: 'मूल दस्तावेज़ का अखंड प्रमाण',
          desc: 'निकाला गया प्रत्येक मान अपने दस्तावेज़, पृष्ठ संख्या और स्थान से हमेशा जुड़ा रहता है।',
        },
        {
          title: 'अंतर का सटीक मिलान',
          desc: 'आधार, अंकतालिका और आय प्रमाण पत्र के बीच किसी भी वर्तनी या तारीख के अंतर को पकड़ा जाता है।',
        },
        {
          title: 'अस्पष्टता पर रोक',
          desc: 'धुंधले या कम आत्मविश्वास वाले पाठ को कभी भी चुपचाप सत्यापित नहीं माना जाता।',
        },
        {
          title: 'नागरिक की आधिकारिक पुष्टि',
          desc: 'आवेदक या सीएससी संचालक स्वयं सही विवरण चुनते हैं, जिसका पूरा ऑडिट रिकॉर्ड रहता है।',
        },
        {
          title: 'सुरक्षित मसौदा निर्माण',
          desc: 'जब तक सभी अनिवार्य विवरण सत्यापित नहीं हो जाते, प्रणाली अधूरा मसौदा नहीं बनाती।',
        },
      ],
      diagram: {
        docA: 'आधार कार्ड (PDF)',
        docB: '12वीं अंकतालिका (JPG)',
        fieldA: 'निकाला गया: "Yash Sharma"',
        fieldB: 'निकाला गया: "Yash S Sharma"',
        reconcileTitle: 'दस्तावेज़ मिलान एवं समाधान इंजन',
        conflictFlag: 'पहचाना गया अंतर: नाम में संक्षिप्त अक्षर (S)',
        stateLabel: 'स्थिति: नागरिक समीक्षा आवश्यक',
        userAction: 'नागरिक ने सही नाम की पुष्टि की: "Yash Sharma"',
        draftStatus: 'मसौदा निर्माण गेट: स्वीकृत',
      },
    },
    services: {
      eyebrow: 'सहायता सेवाएं',
      heading: 'ग्राम साथी AI द्वारा समर्थित सेवाएं',
      subheading: 'ग्रामीण नागरिकों हेतु प्रमुख कल्याणकारी योजनाओं में दस्तावेज़ मिलान एवं पूर्ण आवेदन तैयारी।',
      items: [
        {
          title: 'छात्रवृत्ति सहायता',
          desc: 'राज्य एवं केंद्र सरकार की प्री-मैट्रिक और पोस्ट-मैट्रिक छात्रवृत्तियों के लिए पूर्ण आवेदन तैयारी।',
          status: 'सक्रिय प्रोटोटाइप',
          isAvailable: true,
          tag: 'सक्रिय सेवा',
        },
        {
          title: 'सरकारी प्रमाण पत्र',
          desc: 'आय प्रमाण पत्र, जाति प्रमाण पत्र और मूल निवास प्रमाण पत्र के आवेदन एवं साक्ष्य सत्यापन की तैयारी।',
          status: 'सक्रिय प्रोटोटाइप',
          isAvailable: true,
          tag: 'सक्रिय सेवा',
        },
        {
          title: 'किसान एवं कृषि योजनाएं',
          desc: 'पीएम-किसान, खतौनी सत्यापन, फसल बीमा एवं कृषि अनुदान हेतु पात्रता जांच एवं दस्तावेज़ तैयारी।',
          status: 'सक्रिय प्रोटोटाइप',
          isAvailable: true,
          tag: 'सक्रिय सेवा',
        },
        {
          title: 'पेंशन सहायता',
          desc: 'वृद्धावस्था, विधवा एवं दिव्यांग सामाजिक सुरक्षा पेंशन हेतु उम्र व बीपीएल सत्यापन और कागजात प्रबंधन।',
          status: 'सक्रिय प्रोटोटाइप',
          isAvailable: true,
          tag: 'सक्रिय सेवा',
        },
        {
          title: 'दस्तावेज़ प्रबंधन',
          desc: 'प्रमाण पत्रों की वैधता, स्पष्टता और पूर्णता की जांच करने वाली डिजिटल चेकलिस्ट।',
          status: 'सक्रिय प्रोटोटाइप',
          isAvailable: true,
          tag: 'सक्रिय सेवा',
        },
        {
          title: 'आवेदन मार्गदर्शन',
          desc: 'सरकारी पोर्टलों और सीएससी केंद्रों पर जाने से पहले आवश्यक मौखिक एवं लिखित निर्देश।',
          status: 'सक्रिय प्रोटोटाइप',
          isAvailable: true,
          tag: 'सक्रिय सेवा',
        },
      ],
    },
    accessibility: {
      eyebrow: 'ग्रामीण सुलभता दृष्टिकोण',
      heading: 'गांव की जमीनी परिस्थितियों के अनुकूल तैयार',
      subheading: 'कम नेटवर्क, साधारण स्मार्टफोन और विभिन्न साक्षरता स्तरों के लिए विशेष रूप से डिज़ाइन किया गया।',
      features: [
        {
          title: 'हिंदी-प्रथम अनुभव',
          desc: 'स्पष्ट भाषा, बड़े अक्षर और बिना किसी तकनीकी जटिलता के सहज संवाद।',
        },
        {
          title: 'आवाज एवं पाठ दोनों विकल्प',
          desc: 'नागरिक बोलकर जानकारी पूछ सकते हैं और बोले गए शब्दों को स्क्रीन पर पढ़कर सुधार भी सकते हैं।',
        },
        {
          title: 'धूप में स्पष्ट दिखने वाला कंट्रास्ट',
          desc: 'गहरा वन-हरा और ऑफ-व्हाइट रंग जो सीधी धूप में भी आसानी से पढ़ा जा सकता है (WCAG AAA)।',
        },
        {
          title: 'बड़े 48×48 पिक्सेल के बटन',
          desc: 'खेतों में काम करने वाले हाथों के लिए बड़े और सहज टच बटन।',
        },
        {
          title: 'सरल भाषा में त्रुटि का विवरण',
          desc: 'यदि कोई कागज़ छूट गया है, तो उसे बिना किसी कानूनी शब्दावली के आसान भाषा में समझाया जाता है।',
        },
        {
          title: 'नागरिक का अंतिम नियंत्रण',
          desc: 'सिस्टम कभी भी बिना पूछे कोई बदलाव नहीं करता। अंतिम फैसला हमेशा आवेदक का होता है।',
        },
      ],
      interactiveVoice: {
        title: 'आवाज सहायक पूर्वावलोकन',
        subtitle: 'सुनिए कि आवाज में किस प्रकार मार्गदर्शन दिया जाता है',
        sampleQuery: '"मुझे छात्रवृत्ति के लिए कौन से दस्तावेज चाहिए?"',
        sampleResponse:
          '"नमस्ते! उत्तर प्रदेश पोस्ट-मैट्रिक छात्रवृत्ति के लिए आपको 3 मुख्य दस्तावेज चाहिए: आधार कार्ड, 12वीं की अंकतालिका, और तहसीलदार द्वारा जारी आय प्रमाण पत्र।"',
        playButton: 'मार्गदर्शन सुनें',
        playingText: 'ऑडियो चल रहा है...',
      },
    },
    privacy: {
      eyebrow: 'डेटा सुरक्षा एवं डीपी Verona कानून 2023',
      heading: 'आपके दस्तावेजों की सुरक्षा हमारी पहली प्राथमिकता है।',
      subheading: 'ग्राम साथी AI कम से कम डेटा संग्रह और नागरिक के पूर्ण अधिकार के सिद्धांत पर काम करता है।',
      pillars: [
        {
          title: 'उद्देश्य-आधारित संग्रह',
          desc: 'हम केवल वही कागज़ात मांगते हैं जो आपके चुने गए फॉर्म के लिए कानूनी रूप से आवश्यक हैं।',
        },
        {
          title: 'प्रत्येक मांग का स्पष्ट कारण',
          desc: 'दस्तावेज़ मांगते समय साफ बताया जाता है कि यह किस सरकारी नियम के लिए जरूरी है।',
        },
        {
          title: 'सुरक्षित एवं एन्क्रिप्टेड स्टोरेज',
          desc: 'अपलोड की गई फाइलें अलग सुरक्षित सर्वर पर रहती हैं और इंटरनेट पर सार्वजनिक नहीं होतीं।',
        },
        {
          title: 'मास्क्ड आधार सुरक्षा',
          desc: 'आधार के केवल अंतिम 4 अंक ही दर्ज होते हैं। पूरा 12 अंकों का नंबर कभी सुरक्षित नहीं किया जाता।',
        },
        {
          title: 'डेटा हटाने की पूर्ण आजादी',
          desc: 'नागरिक किसी भी समय एक बटन दबाकर अपने सभी अपलोड किए गए दस्तावेज़ हमेशा के लिए मिटा सकते हैं।',
        },
        {
          title: 'ओटीपी या पासवर्ड कभी न मांगना',
          desc: 'ग्राम साथी कभी भी बैंक पासवर्ड या ओटीपी नहीं मांगता। फॉर्म का अंतिम सबमिशन स्वयं नागरिक करता है।',
        },
      ],
    },
    cta: {
      heading: 'सरल और पारदर्शी आवेदन की ओर पहला कदम उठाएं।',
      subheading: 'सरकारी योजनाओं को समझें, दस्तावेज़ व्यवस्थित करें और प्रमाणित साक्ष्यों के साथ अपना मसौदा तैयार करें।',
      primaryButton: 'शुरू करें',
      secondaryButton: 'प्रक्रिया देखें',
    },
    footer: {
      desc: 'ग्राम साथी AI ग्रामीण भारत के लिए तैयार एक आवाज-सक्षम सरकारी सेवा एवं दस्तावेज़ सहायक है, जो प्रमाण-आधारित आवेदन मसौदे तैयार करता है।',
      quickLinksTitle: 'नेविगेशन',
      servicesTitle: 'सेवाएं',
      contactTitle: 'संपर्क एवं सहायता',
      email: 'contact@gramsathi.ai',
      location: 'नई दिल्ली एवं मुरादाबाद, उत्तर प्रदेश, भारत',
      legalTitle: 'कानूनी एवं अनुपालन',
      privacyPolicy: 'गोपनीयता नीति (DPDP 2023)',
      termsOfUse: 'सेवा की शर्तें',
      disclaimerHeading: 'आधिकारिक सार्वजनिक सेवा अस्वीकरण',
      disclaimer:
        'ग्राम साथी AI एक स्वतंत्र सहायक मंच है। यह किसी भी सरकारी प्राधिकरण का प्रतिनिधित्व नहीं करता है और न ही योजना की पात्रता या आवेदन की स्वीकृति की गारंटी देता है। आधिकारिक चैनलों के माध्यम से आवेदनों की समीक्षा और उन्हें जमा करने के लिए उपयोगकर्ता स्वयं जिम्मेदार हैं।',
      copyright: '© 2026 ग्राम साथी AI। ग्रामीण डिजिटल समावेशन और पारदर्शी शासन के लिए समर्पित।',
    },
  },
};

