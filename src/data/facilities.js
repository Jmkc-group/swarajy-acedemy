// Facilities as described by the academy. No campus photographs have been
// supplied yet, so cards use icons/illustrations — never stock photos posing
// as the real campus. Add `image` (imported asset) to a facility once real
// photos are available; the card will show it automatically.

export const FACILITIES = [
  {
    id: 'campus',
    icon: 'building',
    accent: 'forest',
    title: { en: '14,000 sq. ft. Campus', mr: '१४,००० चौ. फूट परिसर', hi: '14,000 वर्ग फुट परिसर' },
    description: {
      en: 'A spacious 14,000 sq. ft. campus dedicated to study, training and disciplined living.',
      mr: 'अभ्यास, प्रशिक्षण आणि शिस्तबद्ध जीवनासाठी समर्पित १४,००० चौ. फूट प्रशस्त परिसर.',
      hi: 'अध्ययन, प्रशिक्षण और अनुशासित जीवन के लिए समर्पित 14,000 वर्ग फुट का विशाल परिसर।',
    },
  },
  {
    id: 'library',
    icon: 'library',
    accent: 'navy',
    title: { en: '24-Hour Library', mr: '२४ तास अभ्यासिका', hi: '24 घंटे पुस्तकालय' },
    description: {
      en: 'A library open round the clock so students can study at their own pace, any time.',
      mr: 'चोवीस तास खुली अभ्यासिका — विद्यार्थी कधीही आपल्या गतीने अभ्यास करू शकतात.',
      hi: 'चौबीसों घंटे खुला पुस्तकालय — विद्यार्थी कभी भी अपनी गति से पढ़ सकते हैं।',
    },
  },
  {
    id: 'hostel',
    icon: 'bed',
    accent: 'olive',
    title: { en: 'Residential Hostel', mr: 'निवासी वसतिगृह', hi: 'आवासीय छात्रावास' },
    description: {
      en: 'Hostel accommodation for students who want a focused, disciplined residential routine.',
      mr: 'एकाग्र व शिस्तबद्ध निवासी दिनक्रम हवा असणाऱ्या विद्यार्थ्यांसाठी वसतिगृह सुविधा.',
      hi: 'एकाग्र और अनुशासित आवासीय दिनचर्या चाहने वाले विद्यार्थियों के लिए छात्रावास सुविधा।',
    },
  },
  {
    id: 'non-residential',
    icon: 'home',
    accent: 'khaki',
    title: { en: 'Non-Residential Facility', mr: 'अनिवासी सुविधा', hi: 'गैर-आवासीय सुविधा' },
    description: {
      en: 'Day-scholar option for students who prefer to attend classes and training from home.',
      mr: 'घरून वर्ग व प्रशिक्षणासाठी येणाऱ्या विद्यार्थ्यांसाठी अनिवासी पर्याय.',
      hi: 'घर से कक्षाओं और प्रशिक्षण में आने वाले विद्यार्थियों के लिए गैर-आवासीय विकल्प।',
    },
  },
  {
    id: 'mess',
    icon: 'utensils',
    accent: 'saffron',
    title: { en: 'Food & Mess', mr: 'भोजन व मेस व्यवस्था', hi: 'भोजन व मेस व्यवस्था' },
    description: {
      en: 'Mess arrangements for residential students — contact the academy for the meal plan and charges.',
      mr: 'निवासी विद्यार्थ्यांसाठी मेस व्यवस्था — भोजन योजना व शुल्कासाठी अकॅडमीशी संपर्क साधा.',
      hi: 'आवासीय विद्यार्थियों के लिए मेस व्यवस्था — भोजन योजना व शुल्क के लिए अकॅडमी से संपर्क करें।',
    },
  },
  {
    id: 'online',
    icon: 'monitor',
    accent: 'airforce',
    title: { en: 'Online Lectures', mr: 'ऑनलाइन लेक्चर्स', hi: 'ऑनलाइन लेक्चर' },
    description: {
      en: 'Live online lectures so learning continues even when students cannot attend in person.',
      mr: 'प्रत्यक्ष उपस्थित राहता न आल्यासही अभ्यास सुरू ठेवण्यासाठी ऑनलाइन लेक्चर्स.',
      hi: 'व्यक्तिगत रूप से उपस्थित न हो पाने पर भी पढ़ाई जारी रखने के लिए ऑनलाइन लेक्चर।',
    },
  },
  {
    id: 'recorded',
    icon: 'play',
    accent: 'navy',
    title: { en: 'Recorded Lectures', mr: 'रेकॉर्डेड लेक्चर्स', hi: 'रिकॉर्डेड लेक्चर' },
    description: {
      en: 'Recorded lectures for revision — revisit any topic as many times as needed.',
      mr: 'उजळणीसाठी रेकॉर्डेड लेक्चर्स — कोणताही विषय हवा तितक्या वेळा पुन्हा पाहा.',
      hi: 'दोहराव के लिए रिकॉर्डेड लेक्चर — कोई भी विषय जितनी बार चाहें दोबारा देखें।',
    },
  },
  {
    id: 'physical',
    icon: 'dumbbell',
    accent: 'forest',
    title: { en: 'Physical Training', mr: 'शारीरिक प्रशिक्षण', hi: 'शारीरिक प्रशिक्षण' },
    description: {
      en: 'Regular training in running, long jump, shot put and general fitness for recruitment physical tests.',
      mr: 'भरतीच्या शारीरिक चाचणीसाठी धावणे, लांब उडी, गोळाफेक व सामान्य तंदुरुस्तीचे नियमित प्रशिक्षण.',
      hi: 'भर्ती शारीरिक परीक्षा के लिए दौड़, लंबी कूद, गोला फेंक और सामान्य फिटनेस का नियमित प्रशिक्षण।',
    },
  },
  {
    id: 'trekking',
    icon: 'mountain',
    accent: 'olive',
    title: { en: 'Monthly Fort Trekking', mr: 'मासिक गड-किल्ले ट्रेकिंग', hi: 'मासिक किला ट्रेकिंग' },
    description: {
      en: 'A fort trek every month — building stamina, teamwork and pride in Maharashtra’s heritage.',
      mr: 'दर महिन्याला गड-किल्ल्यांची मोहीम — दम-सहनशक्ती, संघभावना आणि महाराष्ट्राच्या इतिहासाचा अभिमान.',
      hi: 'हर महीने किले की ट्रेकिंग — सहनशक्ति, टीम भावना और महाराष्ट्र की विरासत पर गर्व।',
    },
  },
]
