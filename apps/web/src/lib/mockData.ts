export interface Scheme {
  id: string;
  slug: string;
  titleEn: string;
  titleHi: string;
  category: 'AGRICULTURE' | 'HEALTH' | 'HOUSING' | 'PENSION' | 'EDUCATION';
  department: string;
  benefit: string;
  descriptionHi: string;
  eligibilityHi: string;
  documents: string[];
  applyUrl: string;
}

export interface Grievance {
  id: string;
  ticketId: string;
  category: string;
  categoryHi: string;
  icon: string;
  title: string;
  description: string;
  landmark: string;
  status: 'SUBMITTED' | 'IN_PROGRESS' | 'RESOLVED' | 'ESCALATED';
  statusHi: string;
  daysRemainingSla: number;
  reportedDate: string;
  citizenName: string;
}

export interface MandiRate {
  id: string;
  commodity: string;
  commodityHi: string;
  category: 'GRAIN' | 'OILSEED' | 'VEGETABLE';
  market: string;
  modalPrice: number;
  minPrice: number;
  maxPrice: number;
  trend: 'UP' | 'DOWN' | 'STABLE';
  trendPercent: string;
  unit: string;
}

export const INITIAL_SCHEMES: Scheme[] = [
  {
    id: '1',
    slug: 'pm-kisan',
    titleEn: 'PM-KISAN Samman Nidhi',
    titleHi: 'पीएम किसान सम्मान निधि',
    category: 'AGRICULTURE',
    department: 'कृषि एवं किसान कल्याण मंत्रालय',
    benefit: '₹6,000 प्रति वर्ष (₹2,000 की 3 किस्तें)',
    descriptionHi: 'छोटे व सीमांत किसानों को सीधे बैंक खाते में प्रतिवर्ष ₹6,000 की वित्तीय सहायता।',
    eligibilityHi: 'कृषि योग्य भूमि के स्वामी किसान परिवार। संस्थागत भूमि धारक पात्र नहीं हैं।',
    documents: ['आधार कार्ड', 'खतौनी / भूमि के कागजात', 'बैंक पासबुक'],
    applyUrl: 'https://pmkisan.gov.in',
  },
  {
    id: '2',
    slug: 'ayushman-bharat',
    titleEn: 'Ayushman Bharat PM-JAY',
    titleHi: 'आयुष्मान भारत (जन आरोग्य योजना)',
    category: 'HEALTH',
    department: 'राष्ट्रीय स्वास्थ्य प्राधिकरण',
    benefit: '₹5,00,000 प्रति वर्ष प्रति परिवार कैशलेस इलाज',
    descriptionHi: 'द्वितीयक व तृतीयक स्तर के अस्पताल में भर्ती होने पर 5 लाख तक का पूर्णतः मुफ्त उपचार।',
    eligibilityHi: 'SECC 2011 सूची में शामिल ग्रामीण परिवार, बीपीएल कार्ड धारक एवं असंगठित श्रमिक।',
    documents: ['राशन कार्ड', 'आधार कार्ड'],
    applyUrl: 'https://pmjay.gov.in',
  },
  {
    id: '3',
    slug: 'pm-awas-gramin',
    titleEn: 'PM Awas Yojana (Gramin)',
    titleHi: 'प्रधानमंत्री आवास योजना (ग्रामीण)',
    category: 'HOUSING',
    department: 'ग्रामीण विकास मंत्रालय',
    benefit: '₹1,20,000 पक्का मकान बनाने हेतु आर्थिक सहायता',
    descriptionHi: 'ग्रामीण बेघर व कच्चे जर्जर मकानों में रहने वाले नागरिकों को पक्का आवास प्रदान करने हेतु।',
    eligibilityHi: 'ग्रामीण परिवार जिनके पास स्वयं का पक्का मकान नहीं है।',
    documents: ['आधार कार्ड', 'जॉब कार्ड नंबर', 'बैंक खाता विवरण', 'भूमि शपथ पत्र'],
    applyUrl: 'https://pmayg.nic.in',
  },
  {
    id: '4',
    slug: 'fasal-bima',
    titleEn: 'PM Fasal Bima Yojana',
    titleHi: 'प्रधानमंत्री फसल बीमा योजना',
    category: 'AGRICULTURE',
    department: 'कृषि मंत्रालय',
    benefit: 'प्राकृतिक आपदा से फसल नुकसान पर त्वरित मुआवजा',
    descriptionHi: 'सूखा, बाढ़, ओलावृष्टि व कीट प्रकोप से फसल क्षति की स्थिति में व्यापक बीमा सुरक्षा।',
    eligibilityHi: 'अधिसूचित क्षेत्रों में अधिसूचित फसल उगाने वाले सभी किसान (बटाईदार सहित)।',
    documents: ['बोवाई प्रमाण पत्र', 'खसरा/खतौनी', 'बैंक पासबुक', 'आधार'],
    applyUrl: 'https://pmfby.gov.in',
  },
];

export const INITIAL_GRIEVANCES: Grievance[] = [
  {
    id: 'g1',
    ticketId: 'GS-2026-08491',
    category: 'DRINKING_WATER',
    categoryHi: '💧 पेयजल व्यवस्था',
    icon: 'Droplets',
    title: 'वार्ड 3 में सरकारी हैंडपंप से मटमैला पानी आ रहा है',
    description: 'पिछले 4 दिनों से स्कूल के पास वाले हैंडपंप में रेतीला पानी आ रहा है, जिससे बच्चों व ग्रामीणों को परेशानी हो रही है।',
    landmark: 'प्राइमरी स्कूल के सामने, वार्ड नंबर 3',
    status: 'IN_PROGRESS',
    statusHi: 'प्रगति पर (कार्य जारी)',
    daysRemainingSla: 3,
    reportedDate: '2 दिन पहले',
    citizenName: 'सुखदेव वर्मा',
  },
  {
    id: 'g2',
    ticketId: 'GS-2026-08502',
    category: 'ELECTRICITY_POLE',
    categoryHi: '💡 बिजली / खंभा',
    icon: 'Zap',
    title: 'मुख्य मार्ग पर स्ट्रीट लाइट का खंभा झुक गया है',
    description: 'आंधी के कारण 11KV लाइन के पास वाला खंभा झुक गया है, कभी भी बड़ी दुर्घटना हो सकती है।',
    landmark: 'पंचायत भवन तिराहा',
    status: 'SUBMITTED',
    statusHi: 'प्राप्त हुई (स्वीकृति लंबित)',
    daysRemainingSla: 5,
    reportedDate: 'आज सुबह 09:15',
    citizenName: 'अनिल कुमार',
  },
  {
    id: 'g3',
    ticketId: 'GS-2026-07920',
    category: 'SANITATION_DRAINAGE',
    categoryHi: '🧹 नाली व स्वच्छता',
    icon: 'Trash2',
    title: 'वार्ड 5 की पक्की नाली में कचरा जाम होने से पानी सड़क पर',
    description: 'सफाई कर्मचारी द्वारा नाली की गाद निकालकर सड़क पर छोड़ दी गई थी, सफाई पूर्ण कराई जाए।',
    landmark: 'चौपाल के समीप',
    status: 'RESOLVED',
    statusHi: 'समाधान पूर्ण (सत्यापित)',
    daysRemainingSla: 0,
    reportedDate: '5 दिन पहले',
    citizenName: 'सविता देवी',
  },
];

export const MANDI_RATES: MandiRate[] = [
  {
    id: 'm1',
    commodity: 'Wheat',
    commodityHi: 'गेहूं (Dara)',
    category: 'GRAIN',
    market: 'मुरादाबाद मुख्य मंडी',
    modalPrice: 2425,
    minPrice: 2360,
    maxPrice: 2480,
    trend: 'UP',
    trendPercent: '+₹45',
    unit: 'प्रति क्विंटल',
  },
  {
    id: 'm2',
    commodity: 'Mustard',
    commodityHi: 'सरसों (Mustard)',
    category: 'OILSEED',
    market: 'मुरादाबाद मुख्य मंडी',
    modalPrice: 5320,
    minPrice: 5150,
    maxPrice: 5460,
    trend: 'UP',
    trendPercent: '+₹110',
    unit: 'प्रति क्विंटल',
  },
  {
    id: 'm3',
    commodity: 'Potato',
    commodityHi: 'आलू (Desi)',
    category: 'VEGETABLE',
    market: 'बिलारी उप-मंडी',
    modalPrice: 1450,
    minPrice: 1350,
    maxPrice: 1540,
    trend: 'DOWN',
    trendPercent: '-₹30',
    unit: 'प्रति क्विंटल',
  },
  {
    id: 'm4',
    commodity: 'Soybean',
    commodityHi: 'सोयाबीन (Yellow)',
    category: 'OILSEED',
    market: 'संभल कृषि मंडी',
    modalPrice: 4680,
    minPrice: 4500,
    maxPrice: 4790,
    trend: 'STABLE',
    trendPercent: 'स्थिर',
    unit: 'प्रति क्विंटल',
  },
];
