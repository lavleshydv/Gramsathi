import { PrismaClient, Role, GrievanceCategory, GrievanceStatus, Priority } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding GramSathi Database with Indian Civic & Agri Data...');

  // 1. Seed Sample Gram Panchayat (Rampur, Moradabad, Uttar Pradesh)
  const panchayat = await prisma.gramPanchayat.upsert({
    where: { code: 'GP-UP-091201' },
    update: {},
    create: {
      code: 'GP-UP-091201',
      name: 'Rampur Gram Panchayat',
      nameHi: 'रामपुर ग्राम पंचायत',
      block: 'Bilari',
      district: 'Moradabad',
      state: 'Uttar Pradesh',
      pincode: '244001',
      latitude: 28.6253,
      longitude: 78.8021,
    },
  });

  console.log(`✅ Gram Panchayat seeded: ${panchayat.name}`);

  // 2. Seed Officers & Citizens
  const officer = await prisma.user.upsert({
    where: { phoneNumber: '+919876543210' },
    update: {},
    create: {
      phoneNumber: '+919876543210',
      fullName: 'Ramesh Singh (Panchayat Sachiv)',
      role: Role.PANCHAYAT_OFFICER,
      isVerified: true,
      preferredLocale: 'hi',
      panchayatId: panchayat.id,
    },
  });

  const citizen = await prisma.user.upsert({
    where: { phoneNumber: '+919123456780' },
    update: {},
    create: {
      phoneNumber: '+919123456780',
      fullName: 'Sukhdev Verma',
      role: Role.CITIZEN,
      isVerified: true,
      preferredLocale: 'hi',
      panchayatId: panchayat.id,
      citizenProfile: {
        create: {
          gender: 'MALE',
          occupation: 'FARMER',
          casteCategory: 'OBC',
          annualIncome: 95000,
          landHoldingAcres: 2.5,
          hasIrrigation: true,
          isBplCardHolder: false,
        },
      },
    },
  });

  console.log(`✅ Users seeded: Officer ${officer.fullName}, Citizen ${citizen.fullName}`);

  // 3. Seed Standard Government Welfare Schemes
  const schemes = [
    {
      slug: 'pm-kisan-samman-nidhi',
      titleEn: 'PM-KISAN Samman Nidhi',
      titleHi: 'पीएम किसान सम्मान निधि',
      category: 'AGRICULTURE',
      department: 'Ministry of Agriculture and Farmers Welfare',
      fundingType: 'CENTRAL',
      directBenefitAmount: '₹6,000 / year (in 3 equal installments)',
      briefDescriptionEn: 'Income support of ₹6,000 per year in three equal installments to all landholding farmer families across India.',
      briefDescriptionHi: 'देश के सभी भूधारक किसान परिवारों को ₹6,000 प्रति वर्ष 3 समान किस्तों में प्रत्यक्ष आर्थिक सहायता।',
      eligibilitySummaryEn: 'All small and marginal landholding farmer families with cultivable land up to 5 acres.',
      eligibilitySummaryHi: 'सभी छोटे एवं सीमांत किसान परिवार जिनके पास कृषि योग्य भूमि का स्वामित्व है।',
      requiredDocs: ['Aadhaar Card', 'Land Ownership Records (Khasra/Khatauni)', 'Bank Account Passbook'],
      officialApplyUrl: 'https://pmkisan.gov.in',
    },
    {
      slug: 'ayushman-bharat-pmjay',
      titleEn: 'Ayushman Bharat PM-JAY',
      titleHi: 'आयुष्मान भारत (जन आरोग्य योजना)',
      category: 'HEALTH',
      department: 'National Health Authority',
      fundingType: 'CENTRAL',
      directBenefitAmount: '₹5,00,000 / family / year free healthcare cover',
      briefDescriptionEn: 'World largest health assurance scheme providing a health cover of ₹5 lakh per family per year for secondary and tertiary care hospitalization.',
      briefDescriptionHi: 'प्रत्येक पात्र परिवार को प्रति वर्ष ₹5 लाख तक का निःशुल्क कैशलेस अस्पताल उपचार कवर।',
      eligibilitySummaryEn: 'Families identified based on SECC 2011 deprivation and occupational criteria for rural and urban areas.',
      eligibilitySummaryHi: 'ग्रामीण क्षेत्रों के वंचित परिवार, बीपीएल राशन कार्ड धारक एवं असंगठित क्षेत्र के कामगार।',
      requiredDocs: ['Ration Card', 'Aadhaar Card', 'Mobile Number'],
      officialApplyUrl: 'https://pmjay.gov.in',
    },
    {
      slug: 'pm-awas-yojana-gramin',
      titleEn: 'PM Awas Yojana (Gramin)',
      titleHi: 'प्रधानमंत्री आवास योजना (ग्रामीण)',
      category: 'HOUSING',
      department: 'Ministry of Rural Development',
      fundingType: 'CENTRAL',
      directBenefitAmount: '₹1,20,000 in plains, ₹1,30,000 in hilly areas + 90 days MGNREGA wages',
      briefDescriptionEn: 'Financial assistance to homeless and households living in kutcha/dilapidated houses in rural areas to construct pucca houses.',
      briefDescriptionHi: 'ग्रामीण क्षेत्रों में बेघर एवं कच्चे घरों में रहने वाले परिवारों को पक्का मकान बनाने हेतु आर्थिक अनुदान।',
      eligibilitySummaryEn: 'Rural families living in kutcha houses without any pucca room, prioritized by SECC 2011.',
      eligibilitySummaryHi: 'ग्रामीण बेघर परिवार अथवा कच्चे छप्पर/दीवारों वाले घर में रहने वाले नागरिक।',
      requiredDocs: ['Aadhaar Card', 'Bank Passbook', 'Job Card Number', 'Land Document'],
      officialApplyUrl: 'https://pmayg.nic.in',
    },
  ];

  for (const s of schemes) {
    await prisma.scheme.upsert({
      where: { slug: s.slug },
      update: {},
      create: s,
    });
  }
  console.log(`✅ Government Schemes seeded (${schemes.length} items)`);

  // 4. Seed Live Mandi Commodity Prices
  const today = new Date();
  const mandiPrices = [
    {
      mandiName: 'Moradabad Main Mandi',
      district: 'Moradabad',
      state: 'Uttar Pradesh',
      commodity: 'Wheat (गेहूं)',
      variety: 'Dara',
      minPrice: 2350,
      maxPrice: 2475,
      modalPrice: 2425,
      arrivalDate: today,
    },
    {
      mandiName: 'Moradabad Main Mandi',
      district: 'Moradabad',
      state: 'Uttar Pradesh',
      commodity: 'Mustard (सरसों)',
      variety: 'Pili',
      minPrice: 5100,
      maxPrice: 5450,
      modalPrice: 5320,
      arrivalDate: today,
    },
    {
      mandiName: 'Bilari Mandi',
      district: 'Moradabad',
      state: 'Uttar Pradesh',
      commodity: 'Potato (आलू)',
      variety: 'Desi',
      minPrice: 1350,
      maxPrice: 1550,
      modalPrice: 1450,
      arrivalDate: today,
    },
  ];

  for (const m of mandiPrices) {
    await prisma.mandiPrice.create({
      data: m,
    });
  }
  console.log(`✅ Mandi prices seeded (${mandiPrices.length} records)`);

  // 5. Seed Initial Grievance with SLA
  const sampleGrievance = await prisma.grievance.upsert({
    where: { ticketId: 'GS-2026-08491' },
    update: {},
    create: {
      ticketId: 'GS-2026-08491',
      citizenId: citizen.id,
      panchayatId: panchayat.id,
      category: GrievanceCategory.DRINKING_WATER,
      title: 'वार्ड 3 में हैंडपंप से गंदा पानी आ रहा है',
      description: 'पिछले 4 दिनों से सरकारी प्राइमरी स्कूल के सामने वाले हैंडपंप से मटमैला पानी आ रहा है। पीने के पानी की भारी समस्या है।',
      latitude: 28.6261,
      longitude: 78.8034,
      addressLandmark: 'Near Primary School, Ward No. 3',
      status: GrievanceStatus.IN_PROGRESS,
      priority: Priority.HIGH,
      slaDueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days SLA
      timeline: {
        create: [
          {
            status: GrievanceStatus.SUBMITTED,
            actionText: 'शिकायत नागरिक द्वारा दर्ज की गई',
            notes: 'फोटो एवं जीपीएस विवरण संलग्न',
          },
          {
            actorId: officer.id,
            status: GrievanceStatus.IN_PROGRESS,
            actionText: 'पंचायत सचिव द्वारा स्वीकार की गई',
            notes: 'जल निगम मैकेनिक को निरीक्षण हेतु निर्देशित किया गया',
          },
        ],
      },
    },
  });

  console.log(`✅ Sample Grievance seeded: ${sampleGrievance.ticketId}`);
  console.log('🚀 Seed finished successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
