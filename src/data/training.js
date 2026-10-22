// Training & testing programme as described by the academy.

export const TRAINING_GROUPS = [
  {
    id: 'academic',
    icon: 'book',
    accent: 'navy',
    title: { en: 'Academic Study', mr: 'शैक्षणिक अभ्यास', hi: 'शैक्षणिक अध्ययन' },
    description: {
      en: 'Daily 7–8 hours of guided academic study covering every subject of the target exam.',
      mr: 'लक्ष्य परीक्षेच्या प्रत्येक विषयाचा दररोज ७–८ तास मार्गदर्शित अभ्यास.',
      hi: 'लक्ष्य परीक्षा के हर विषय का प्रतिदिन 7–8 घंटे मार्गदर्शित अध्ययन।',
    },
    items: [
      { en: 'General Knowledge', mr: 'सामान्य ज्ञान', hi: 'सामान्य ज्ञान' },
      { en: 'Mathematics', mr: 'गणित', hi: 'गणित' },
      { en: 'Intelligence & Mental Ability', mr: 'बुद्धिमत्ता व मानसिक क्षमता', hi: 'बुद्धिमत्ता व मानसिक क्षमता' },
    ],
  },
  {
    id: 'physical',
    icon: 'dumbbell',
    accent: 'olive',
    title: { en: 'Physical Training', mr: 'शारीरिक प्रशिक्षण', hi: 'शारीरिक प्रशिक्षण' },
    description: {
      en: 'Structured ground training to prepare for recruitment physical tests.',
      mr: 'भरतीच्या शारीरिक चाचणीसाठी नियोजनबद्ध मैदानी प्रशिक्षण.',
      hi: 'भर्ती शारीरिक परीक्षा के लिए व्यवस्थित मैदानी प्रशिक्षण।',
    },
    items: [
      { en: 'Running', mr: 'धावणे', hi: 'दौड़' },
      { en: 'Long jump', mr: 'लांब उडी', hi: 'लंबी कूद' },
      { en: 'Shot put', mr: 'गोळाफेक', hi: 'गोला फेंक' },
      { en: 'General fitness', mr: 'सामान्य तंदुरुस्ती', hi: 'सामान्य फिटनेस' },
    ],
  },
  {
    id: 'tests',
    icon: 'clipboard',
    accent: 'saffron',
    title: { en: 'Regular Tests', mr: 'नियमित चाचण्या', hi: 'नियमित टेस्ट' },
    description: {
      en: 'Frequent testing keeps preparation on track and builds exam temperament.',
      mr: 'वारंवार चाचण्यांमुळे तयारी योग्य दिशेने राहते आणि परीक्षेचा आत्मविश्वास वाढतो.',
      hi: 'बार-बार टेस्ट से तैयारी सही दिशा में रहती है और परीक्षा का आत्मविश्वास बढ़ता है।',
    },
    items: [
      { en: 'Weekly Tuesday subject tests', mr: 'दर मंगळवारी विषयनिहाय चाचणी', hi: 'हर मंगलवार विषयवार टेस्ट' },
      { en: 'Monthly unit tests', mr: 'मासिक घटक चाचणी', hi: 'मासिक यूनिट टेस्ट' },
    ],
  },
  {
    id: 'personality',
    icon: 'mic',
    accent: 'khaki',
    title: { en: 'Personality & Interview', mr: 'व्यक्तिमत्त्व व मुलाखत', hi: 'व्यक्तित्व व साक्षात्कार' },
    description: {
      en: 'Confidence, communication and conduct — the qualities interview boards look for.',
      mr: 'आत्मविश्वास, संवाद आणि वर्तन — मुलाखत मंडळाला अपेक्षित गुण.',
      hi: 'आत्मविश्वास, संवाद और आचरण — साक्षात्कार बोर्ड जिन गुणों को देखता है।',
    },
    items: [
      { en: 'Personality development', mr: 'व्यक्तिमत्त्व विकास', hi: 'व्यक्तित्व विकास' },
      { en: 'Interview preparation', mr: 'मुलाखतीची तयारी', hi: 'साक्षात्कार की तैयारी' },
    ],
  },
  {
    id: 'lectures',
    icon: 'monitor',
    accent: 'airforce',
    title: { en: 'Online & Recorded Lectures', mr: 'ऑनलाइन व रेकॉर्डेड लेक्चर्स', hi: 'ऑनलाइन व रिकॉर्डेड लेक्चर' },
    description: {
      en: 'Learn live online or revise with recorded lectures whenever you need.',
      mr: 'ऑनलाइन थेट शिका किंवा गरजेनुसार रेकॉर्डेड लेक्चर्सने उजळणी करा.',
      hi: 'ऑनलाइन लाइव सीखें या ज़रूरत के अनुसार रिकॉर्डेड लेक्चर से दोहराएँ।',
    },
    items: [
      { en: 'Live online lectures', mr: 'थेट ऑनलाइन लेक्चर्स', hi: 'लाइव ऑनलाइन लेक्चर' },
      { en: 'Recorded lectures for revision', mr: 'उजळणीसाठी रेकॉर्डेड लेक्चर्स', hi: 'दोहराव के लिए रिकॉर्डेड लेक्चर' },
    ],
  },
  {
    id: 'trekking',
    icon: 'mountain',
    accent: 'forest',
    title: { en: 'Monthly Fort Trekking', mr: 'मासिक गड-किल्ले ट्रेकिंग', hi: 'मासिक किला ट्रेकिंग' },
    description: {
      en: 'Every month students trek a fort — stamina, teamwork and inspiration from history.',
      mr: 'दर महिन्याला विद्यार्थी गड-किल्ल्यांची मोहीम करतात — सहनशक्ती, संघभावना व इतिहासातून प्रेरणा.',
      hi: 'हर महीने विद्यार्थी किले की ट्रेकिंग करते हैं — सहनशक्ति, टीम भावना और इतिहास से प्रेरणा।',
    },
    items: [
      { en: 'Stamina building', mr: 'सहनशक्ती वाढवणे', hi: 'सहनशक्ति बढ़ाना' },
      { en: 'Team spirit', mr: 'संघभावना', hi: 'टीम भावना' },
    ],
  },
]
