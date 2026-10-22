// Course catalogue. Eligibility figures are indicative (see data/eligibility.js)
// and every course view shows a "verify the official notification" notice.
// Practice questions are sample practice material, not previous-year papers.

export const COURSE_CATEGORIES = ['all', 'police', 'defence', 'state', 'foundation']

export const COURSES = [
  {
    id: 'police',
    category: 'police',
    icon: 'shield',
    accent: 'khaki',
    popular: true,
    title: { en: 'Police Bharti', mr: 'पोलीस भरती', hi: 'पुलिस भर्ती' },
    tagline: {
      en: 'Maharashtra Police Constable recruitment',
      mr: 'महाराष्ट्र पोलीस शिपाई भरती',
      hi: 'महाराष्ट्र पुलिस सिपाही भर्ती',
    },
    summary: {
      en: 'Complete preparation for the written examination and the physical test of Maharashtra Police recruitment, with daily practice and weekly tests.',
      mr: 'महाराष्ट्र पोलीस भरतीच्या लेखी परीक्षा व शारीरिक चाचणीची संपूर्ण तयारी — दैनंदिन सराव आणि साप्ताहिक चाचण्यांसह.',
      hi: 'महाराष्ट्र पुलिस भर्ती की लिखित परीक्षा और शारीरिक परीक्षा की संपूर्ण तैयारी — दैनिक अभ्यास और साप्ताहिक टेस्ट के साथ।',
    },
    eligibility: [
      { en: 'Education: Class 12 (HSC) pass', mr: 'शिक्षण: इयत्ता १२ वी (HSC) उत्तीर्ण', hi: 'शिक्षा: कक्षा 12वीं (HSC) उत्तीर्ण' },
      {
        en: 'Age (recent notification): 18–28 years for open category; higher limit for reserved categories (up to 33)',
        mr: 'वय (अलीकडील जाहिरात): खुल्या प्रवर्गासाठी १८–२८ वर्षे; राखीव प्रवर्गासाठी अधिक मर्यादा (३३ पर्यंत)',
        hi: 'आयु (हालिया अधिसूचना): खुली श्रेणी के लिए 18–28 वर्ष; आरक्षित श्रेणियों के लिए अधिक सीमा (33 तक)',
      },
      {
        en: 'Physical standards (height, chest) as per the official notification',
        mr: 'शारीरिक मापदंड (उंची, छाती) अधिकृत जाहिरातीनुसार',
        hi: 'शारीरिक मानक (ऊँचाई, सीना) आधिकारिक अधिसूचना के अनुसार',
      },
    ],
    selection: [
      { en: 'Physical test — running and shot put', mr: 'शारीरिक चाचणी — धावणे व गोळाफेक', hi: 'शारीरिक परीक्षा — दौड़ और गोला फेंक' },
      { en: 'Written examination (objective)', mr: 'लेखी परीक्षा (वस्तुनिष्ठ)', hi: 'लिखित परीक्षा (वस्तुनिष्ठ)' },
      { en: 'Document verification and medical examination', mr: 'कागदपत्र पडताळणी व वैद्यकीय तपासणी', hi: 'दस्तावेज़ सत्यापन और चिकित्सा परीक्षा' },
    ],
    syllabus: [
      { en: 'Arithmetic', mr: 'अंकगणित', hi: 'अंकगणित' },
      { en: 'General Knowledge & Current Affairs', mr: 'सामान्य ज्ञान व चालू घडामोडी', hi: 'सामान्य ज्ञान व समसामयिकी' },
      { en: 'Intelligence Test (Reasoning)', mr: 'बुद्धिमत्ता चाचणी', hi: 'बुद्धिमत्ता परीक्षण (रीज़निंग)' },
      { en: 'Marathi Grammar', mr: 'मराठी व्याकरण', hi: 'मराठी व्याकरण' },
      { en: 'Running practice (long and short distance)', mr: 'धावण्याचा सराव (लांब व कमी अंतर)', hi: 'दौड़ का अभ्यास (लंबी व छोटी दूरी)' },
      { en: 'Shot put technique', mr: 'गोळाफेक तंत्र', hi: 'गोला फेंक तकनीक' },
    ],
    questions: [
      {
        q: { en: 'What is the capital of Maharashtra?', mr: 'महाराष्ट्राची राजधानी कोणती?', hi: 'महाराष्ट्र की राजधानी क्या है?' },
        a: { en: 'Mumbai', mr: 'मुंबई', hi: 'मुंबई' },
      },
      {
        q: { en: 'What is 15% of 200?', mr: '२०० चे १५% किती?', hi: '200 का 15% कितना है?' },
        a: { en: '30', mr: '३०', hi: '30' },
      },
      {
        q: { en: 'Find the next number: 2, 6, 12, 20, ?', mr: 'पुढील संख्या शोधा: २, ६, १२, २०, ?', hi: 'अगली संख्या ज्ञात करें: 2, 6, 12, 20, ?' },
        a: { en: '30 (differences 4, 6, 8, 10)', mr: '३० (फरक ४, ६, ८, १०)', hi: '30 (अंतर 4, 6, 8, 10)' },
      },
    ],
  },
  {
    id: 'army',
    category: 'defence',
    icon: 'swords',
    accent: 'olive',
    popular: true,
    title: { en: 'Indian Army', mr: 'भारतीय सैन्यदल', hi: 'भारतीय थल सेना' },
    tagline: {
      en: 'Agniveer and other Army entries',
      mr: 'अग्निवीर व इतर सैन्य भरती',
      hi: 'अग्निवीर व अन्य सेना भर्ती',
    },
    summary: {
      en: 'Written-exam preparation and rigorous physical training for Indian Army recruitment, including the Agniveer entry.',
      mr: 'अग्निवीरसह भारतीय सैन्यदल भरतीसाठी लेखी परीक्षेची तयारी आणि कठोर शारीरिक प्रशिक्षण.',
      hi: 'अग्निवीर सहित भारतीय सेना भर्ती के लिए लिखित परीक्षा की तैयारी और कठोर शारीरिक प्रशिक्षण।',
    },
    eligibility: [
      {
        en: 'Education: Class 10 pass for General Duty; Class 12 for Technical / Clerk entries',
        mr: 'शिक्षण: जनरल ड्युटीसाठी इयत्ता १० वी; टेक्निकल / क्लर्कसाठी इयत्ता १२ वी',
        hi: 'शिक्षा: जनरल ड्यूटी के लिए कक्षा 10वीं; टेक्निकल / क्लर्क के लिए कक्षा 12वीं',
      },
      {
        en: 'Age (recent Agniveer cycles): 17½–21 years; may differ for some roles',
        mr: 'वय (अलीकडील अग्निवीर भरती): १७½–२१ वर्षे; काही पदांसाठी वेगळे असू शकते',
        hi: 'आयु (हालिया अग्निवीर भर्ती): 17½–21 वर्ष; कुछ पदों के लिए अलग हो सकती है',
      },
      {
        en: 'Physical and medical standards as per the official notification',
        mr: 'शारीरिक व वैद्यकीय मापदंड अधिकृत जाहिरातीनुसार',
        hi: 'शारीरिक व चिकित्सा मानक आधिकारिक अधिसूचना के अनुसार',
      },
    ],
    selection: [
      { en: 'Online Common Entrance Exam (CEE)', mr: 'ऑनलाइन सामायिक प्रवेश परीक्षा (CEE)', hi: 'ऑनलाइन सामान्य प्रवेश परीक्षा (CEE)' },
      { en: 'Recruitment rally — physical fitness test and measurements', mr: 'भरती मेळावा — शारीरिक क्षमता चाचणी व मोजमाप', hi: 'भर्ती रैली — शारीरिक दक्षता परीक्षा और माप' },
      { en: 'Medical examination', mr: 'वैद्यकीय तपासणी', hi: 'चिकित्सा परीक्षा' },
      { en: 'Final merit list', mr: 'अंतिम गुणवत्ता यादी', hi: 'अंतिम मेरिट सूची' },
    ],
    syllabus: [
      { en: 'General Knowledge', mr: 'सामान्य ज्ञान', hi: 'सामान्य ज्ञान' },
      { en: 'General Science', mr: 'सामान्य विज्ञान', hi: 'सामान्य विज्ञान' },
      { en: 'Mathematics', mr: 'गणित', hi: 'गणित' },
      { en: 'Logical Reasoning', mr: 'तार्किक क्षमता', hi: 'तार्किक क्षमता' },
      { en: '1.6 km running practice', mr: '१.६ किमी धावण्याचा सराव', hi: '1.6 किमी दौड़ का अभ्यास' },
      { en: 'Pull-ups, balance and ditch practice', mr: 'पुल-अप्स, बॅलन्स व खड्डा उडी सराव', hi: 'पुल-अप्स, संतुलन व गड्ढा कूद अभ्यास' },
    ],
    questions: [
      {
        q: {
          en: 'Who is the Supreme Commander of the Indian Armed Forces?',
          mr: 'भारतीय सशस्त्र दलांचे सर्वोच्च सेनापती कोण असतात?',
          hi: 'भारतीय सशस्त्र सेनाओं के सर्वोच्च कमांडर कौन होते हैं?',
        },
        a: { en: 'The President of India', mr: 'भारताचे राष्ट्रपती', hi: 'भारत के राष्ट्रपति' },
      },
      {
        q: {
          en: 'A vehicle covers 60 km in 1 hour. How far will it travel in 2.5 hours at the same speed?',
          mr: 'एक वाहन १ तासात ६० किमी जाते. त्याच वेगाने २.५ तासांत किती अंतर जाईल?',
          hi: 'एक वाहन 1 घंटे में 60 किमी चलता है। उसी गति से 2.5 घंटे में कितनी दूरी तय करेगा?',
        },
        a: { en: '150 km', mr: '१५० किमी', hi: '150 किमी' },
      },
      {
        q: { en: 'Army Day in India is celebrated on?', mr: 'भारतात सैन्य दिन कधी साजरा केला जातो?', hi: 'भारत में थल सेना दिवस कब मनाया जाता है?' },
        a: { en: '15 January', mr: '१५ जानेवारी', hi: '15 जनवरी' },
      },
    ],
  },
  {
    id: 'navy',
    category: 'defence',
    icon: 'anchor',
    accent: 'navy',
    popular: true,
    title: { en: 'Indian Navy', mr: 'भारतीय नौदल', hi: 'भारतीय नौसेना' },
    tagline: {
      en: 'Agniveer (SSR / MR) and other Navy entries',
      mr: 'अग्निवीर (SSR / MR) व इतर नौदल भरती',
      hi: 'अग्निवीर (SSR / MR) व अन्य नौसेना भर्ती',
    },
    summary: {
      en: 'Focused preparation in Mathematics, Science, English and General Awareness along with physical fitness for Indian Navy recruitment.',
      mr: 'भारतीय नौदल भरतीसाठी गणित, विज्ञान, इंग्रजी व सामान्य ज्ञानाची सखोल तयारी आणि शारीरिक तंदुरुस्ती.',
      hi: 'भारतीय नौसेना भर्ती के लिए गणित, विज्ञान, अंग्रेज़ी व सामान्य जागरूकता की केंद्रित तैयारी और शारीरिक फिटनेस।',
    },
    eligibility: [
      {
        en: 'Education: Class 12 with Maths & Physics (plus Chemistry / Biology / Computer Science) for SSR; Class 10 for MR',
        mr: 'शिक्षण: SSR साठी गणित व भौतिकशास्त्रासह (आणि रसायन / जीव / संगणकशास्त्र) इयत्ता १२ वी; MR साठी इयत्ता १० वी',
        hi: 'शिक्षा: SSR के लिए गणित व भौतिकी (तथा रसायन / जीव / कंप्यूटर विज्ञान) सहित कक्षा 12वीं; MR के लिए कक्षा 10वीं',
      },
      {
        en: 'Age (recent Agniveer cycles): 17½–21 years',
        mr: 'वय (अलीकडील अग्निवीर भरती): १७½–२१ वर्षे',
        hi: 'आयु (हालिया अग्निवीर भर्ती): 17½–21 वर्ष',
      },
      {
        en: 'Physical and medical standards as per the official notification',
        mr: 'शारीरिक व वैद्यकीय मापदंड अधिकृत जाहिरातीनुसार',
        hi: 'शारीरिक व चिकित्सा मानक आधिकारिक अधिसूचना के अनुसार',
      },
    ],
    selection: [
      { en: 'Computer-based online examination', mr: 'संगणक-आधारित ऑनलाइन परीक्षा', hi: 'कंप्यूटर आधारित ऑनलाइन परीक्षा' },
      { en: 'Physical Fitness Test (PFT)', mr: 'शारीरिक क्षमता चाचणी (PFT)', hi: 'शारीरिक दक्षता परीक्षा (PFT)' },
      { en: 'Recruitment medical examination', mr: 'भरती वैद्यकीय तपासणी', hi: 'भर्ती चिकित्सा परीक्षा' },
      { en: 'Final merit list', mr: 'अंतिम गुणवत्ता यादी', hi: 'अंतिम मेरिट सूची' },
    ],
    syllabus: [
      { en: 'English', mr: 'इंग्रजी', hi: 'अंग्रेज़ी' },
      { en: 'Science (Physics, Chemistry)', mr: 'विज्ञान (भौतिकशास्त्र, रसायनशास्त्र)', hi: 'विज्ञान (भौतिकी, रसायन)' },
      { en: 'Mathematics', mr: 'गणित', hi: 'गणित' },
      { en: 'General Awareness', mr: 'सामान्य जागरूकता', hi: 'सामान्य जागरूकता' },
      { en: '1.6 km running practice', mr: '१.६ किमी धावण्याचा सराव', hi: '1.6 किमी दौड़ का अभ्यास' },
      { en: 'Squats, push-ups and sit-ups', mr: 'स्क्वॅट्स, पुश-अप्स व सिट-अप्स', hi: 'स्क्वैट्स, पुश-अप्स व सिट-अप्स' },
    ],
    questions: [
      {
        q: { en: 'Navy Day in India is celebrated on?', mr: 'भारतात नौदल दिन कधी साजरा केला जातो?', hi: 'भारत में नौसेना दिवस कब मनाया जाता है?' },
        a: { en: '4 December', mr: '४ डिसेंबर', hi: '4 दिसंबर' },
      },
      {
        q: { en: 'What is the chemical formula of water?', mr: 'पाण्याचे रासायनिक सूत्र काय आहे?', hi: 'पानी का रासायनिक सूत्र क्या है?' },
        a: { en: 'H₂O', mr: 'H₂O', hi: 'H₂O' },
      },
      {
        q: { en: 'What is the value of 12 × 12 − 44?', mr: '१२ × १२ − ४४ ची किंमत किती?', hi: '12 × 12 − 44 का मान क्या है?' },
        a: { en: '100', mr: '१००', hi: '100' },
      },
    ],
  },
  {
    id: 'airforce',
    category: 'defence',
    icon: 'plane',
    accent: 'airforce',
    popular: true,
    title: { en: 'Indian Air Force', mr: 'भारतीय वायुसेना', hi: 'भारतीय वायुसेना' },
    tagline: {
      en: 'Agniveervayu and other Air Force entries',
      mr: 'अग्निवीरवायू व इतर वायुसेना भरती',
      hi: 'अग्निवीरवायु व अन्य वायुसेना भर्ती',
    },
    summary: {
      en: 'Preparation in English, Physics, Mathematics, Reasoning and General Awareness with fitness training for Indian Air Force recruitment.',
      mr: 'भारतीय वायुसेना भरतीसाठी इंग्रजी, भौतिकशास्त्र, गणित, बुद्धिमत्ता व सामान्य ज्ञानाची तयारी आणि शारीरिक प्रशिक्षण.',
      hi: 'भारतीय वायुसेना भर्ती के लिए अंग्रेज़ी, भौतिकी, गणित, रीज़निंग व सामान्य जागरूकता की तैयारी और फिटनेस प्रशिक्षण।',
    },
    eligibility: [
      {
        en: 'Education: Class 12 (Science with Maths, Physics, English — or other streams for non-science trades) or an engineering diploma',
        mr: 'शिक्षण: इयत्ता १२ वी (गणित, भौतिकशास्त्र, इंग्रजीसह विज्ञान — किंवा नॉन-सायन्स ट्रेडसाठी इतर शाखा) किंवा अभियांत्रिकी पदविका',
        hi: 'शिक्षा: कक्षा 12वीं (गणित, भौतिकी, अंग्रेज़ी सहित विज्ञान — या नॉन-साइंस ट्रेड के लिए अन्य संकाय) या इंजीनियरिंग डिप्लोमा',
      },
      {
        en: 'Age (recent Agniveervayu cycles): 17½–21 years',
        mr: 'वय (अलीकडील अग्निवीरवायू भरती): १७½–२१ वर्षे',
        hi: 'आयु (हालिया अग्निवीरवायु भर्ती): 17½–21 वर्ष',
      },
      {
        en: 'Minimum marks, physical and medical standards as per the official notification',
        mr: 'किमान गुण, शारीरिक व वैद्यकीय मापदंड अधिकृत जाहिरातीनुसार',
        hi: 'न्यूनतम अंक, शारीरिक व चिकित्सा मानक आधिकारिक अधिसूचना के अनुसार',
      },
    ],
    selection: [
      { en: 'Online test', mr: 'ऑनलाइन परीक्षा', hi: 'ऑनलाइन परीक्षा' },
      { en: 'Physical Fitness Test and adaptability tests', mr: 'शारीरिक क्षमता चाचणी व अनुकूलता चाचण्या', hi: 'शारीरिक दक्षता परीक्षा और अनुकूलन परीक्षण' },
      { en: 'Medical examination', mr: 'वैद्यकीय तपासणी', hi: 'चिकित्सा परीक्षा' },
      { en: 'Final merit list', mr: 'अंतिम गुणवत्ता यादी', hi: 'अंतिम मेरिट सूची' },
    ],
    syllabus: [
      { en: 'English', mr: 'इंग्रजी', hi: 'अंग्रेज़ी' },
      { en: 'Physics', mr: 'भौतिकशास्त्र', hi: 'भौतिकी' },
      { en: 'Mathematics', mr: 'गणित', hi: 'गणित' },
      { en: 'Reasoning & General Awareness (RAGA)', mr: 'बुद्धिमत्ता व सामान्य ज्ञान (RAGA)', hi: 'रीज़निंग व सामान्य जागरूकता (RAGA)' },
      { en: '1.6 km running practice', mr: '१.६ किमी धावण्याचा सराव', hi: '1.6 किमी दौड़ का अभ्यास' },
      { en: 'Push-ups, sit-ups and squats', mr: 'पुश-अप्स, सिट-अप्स व स्क्वॅट्स', hi: 'पुश-अप्स, सिट-अप्स व स्क्वैट्स' },
    ],
    questions: [
      {
        q: { en: 'Indian Air Force Day is celebrated on?', mr: 'भारतीय वायुसेना दिन कधी साजरा केला जातो?', hi: 'भारतीय वायुसेना दिवस कब मनाया जाता है?' },
        a: { en: '8 October', mr: '८ ऑक्टोबर', hi: '8 अक्टूबर' },
      },
      {
        q: { en: 'What is the SI unit of force?', mr: 'बलाचे SI एकक कोणते?', hi: 'बल की SI इकाई क्या है?' },
        a: { en: 'Newton (N)', mr: 'न्यूटन (N)', hi: 'न्यूटन (N)' },
      },
      {
        q: {
          en: 'Choose the correctly spelt word: (a) Recieve (b) Receive (c) Receeve',
          mr: 'योग्य स्पेलिंग असलेला इंग्रजी शब्द निवडा: (a) Recieve (b) Receive (c) Receeve',
          hi: 'सही वर्तनी वाला अंग्रेज़ी शब्द चुनें: (a) Recieve (b) Receive (c) Receeve',
        },
        a: { en: '(b) Receive', mr: '(b) Receive', hi: '(b) Receive' },
      },
    ],
  },
  {
    id: 'saralseva',
    category: 'state',
    icon: 'briefcase',
    accent: 'forest',
    popular: true,
    title: { en: 'Saralseva Bharti', mr: 'सरळसेवा भरती', hi: 'सरलसेवा भर्ती' },
    tagline: {
      en: 'Maharashtra Government direct recruitment (Group C)',
      mr: 'महाराष्ट्र शासन सरळसेवा भरती (गट क)',
      hi: 'महाराष्ट्र शासन सीधी भर्ती (ग्रुप C)',
    },
    summary: {
      en: 'Preparation for Maharashtra Government direct-recruitment posts across departments, covering Marathi, English, General Knowledge, Reasoning and Arithmetic.',
      mr: 'महाराष्ट्र शासनाच्या विविध विभागांतील सरळसेवा पदांसाठी तयारी — मराठी, इंग्रजी, सामान्य ज्ञान, बुद्धिमत्ता व अंकगणित.',
      hi: 'महाराष्ट्र शासन के विभिन्न विभागों की सीधी भर्ती पदों की तैयारी — मराठी, अंग्रेज़ी, सामान्य ज्ञान, रीज़निंग व अंकगणित।',
    },
    eligibility: [
      {
        en: 'Education: depends on the post — usually Class 10, Class 12 or graduation',
        mr: 'शिक्षण: पदानुसार — साधारणतः इयत्ता १० वी, १२ वी किंवा पदवी',
        hi: 'शिक्षा: पद के अनुसार — सामान्यतः कक्षा 10वीं, 12वीं या स्नातक',
      },
      {
        en: 'Age: commonly 18–38 years for open category with relaxation for reserved categories; varies by post',
        mr: 'वय: साधारणतः खुल्या प्रवर्गासाठी १८–३८ वर्षे, राखीव प्रवर्गासाठी सवलत; पदानुसार बदलते',
        hi: 'आयु: सामान्यतः खुली श्रेणी के लिए 18–38 वर्ष, आरक्षित श्रेणियों को छूट; पद के अनुसार बदलती है',
      },
      {
        en: 'Typing or other skill certificates required for some posts',
        mr: 'काही पदांसाठी टंकलेखन किंवा इतर कौशल्य प्रमाणपत्र आवश्यक',
        hi: 'कुछ पदों के लिए टाइपिंग या अन्य कौशल प्रमाणपत्र आवश्यक',
      },
    ],
    selection: [
      { en: 'Written examination (objective)', mr: 'लेखी परीक्षा (वस्तुनिष्ठ)', hi: 'लिखित परीक्षा (वस्तुनिष्ठ)' },
      { en: 'Skill / typing test (for some posts)', mr: 'कौशल्य / टंकलेखन चाचणी (काही पदांसाठी)', hi: 'कौशल / टाइपिंग परीक्षा (कुछ पदों के लिए)' },
      { en: 'Document verification', mr: 'कागदपत्र पडताळणी', hi: 'दस्तावेज़ सत्यापन' },
    ],
    syllabus: [
      { en: 'Marathi Language & Grammar', mr: 'मराठी भाषा व व्याकरण', hi: 'मराठी भाषा व व्याकरण' },
      { en: 'English Language & Grammar', mr: 'इंग्रजी भाषा व व्याकरण', hi: 'अंग्रेज़ी भाषा व व्याकरण' },
      { en: 'General Knowledge & Current Affairs', mr: 'सामान्य ज्ञान व चालू घडामोडी', hi: 'सामान्य ज्ञान व समसामयिकी' },
      { en: 'Intelligence / Reasoning', mr: 'बुद्धिमत्ता चाचणी', hi: 'बुद्धिमत्ता / रीज़निंग' },
      { en: 'Arithmetic', mr: 'अंकगणित', hi: 'अंकगणित' },
    ],
    questions: [
      {
        q: { en: "Who wrote 'Shyamchi Aai'?", mr: "'श्यामची आई' हे पुस्तक कोणी लिहिले?", hi: "'श्यामची आई' किसने लिखी?" },
        a: { en: 'Sane Guruji', mr: 'साने गुरुजी', hi: 'साने गुरुजी' },
      },
      {
        q: {
          en: 'Simple interest on ₹1,000 at 10% per annum for 2 years?',
          mr: '₹१,००० वर १०% दराने २ वर्षांचे सरळव्याज किती?',
          hi: '₹1,000 पर 10% वार्षिक दर से 2 वर्ष का साधारण ब्याज कितना?',
        },
        a: { en: '₹200', mr: '₹२००', hi: '₹200' },
      },
      {
        q: {
          en: 'If the day after tomorrow is Friday, what day is today?',
          mr: 'परवा शुक्रवार असेल तर आज कोणता वार?',
          hi: 'यदि परसों शुक्रवार है, तो आज कौन-सा दिन है?',
        },
        a: { en: 'Wednesday', mr: 'बुधवार', hi: 'बुधवार' },
      },
    ],
  },
  {
    id: 'mpsc-foundation',
    category: 'state',
    icon: 'landmark',
    accent: 'navy',
    popular: true,
    title: {
      en: 'NCERT-based MPSC Foundation Batch',
      mr: 'NCERT आधारित MPSC फाउंडेशन बॅच',
      hi: 'NCERT आधारित MPSC फाउंडेशन बैच',
    },
    tagline: {
      en: 'For Class 10th and 12th pass students',
      mr: 'इयत्ता १० वी व १२ वी उत्तीर्ण विद्यार्थ्यांसाठी',
      hi: 'कक्षा 10वीं व 12वीं उत्तीर्ण विद्यार्थियों के लिए',
    },
    summary: {
      en: 'An early-start foundation for MPSC: strong NCERT-based concepts in History, Geography, Polity, Economy and Science, built years before the actual exam.',
      mr: 'MPSC साठी लवकर सुरुवात: इतिहास, भूगोल, राज्यव्यवस्था, अर्थशास्त्र व विज्ञान यांच्या NCERT आधारित मजबूत संकल्पना — प्रत्यक्ष परीक्षेच्या आधीच.',
      hi: 'MPSC के लिए जल्दी शुरुआत: इतिहास, भूगोल, राजव्यवस्था, अर्थशास्त्र व विज्ञान की NCERT आधारित मज़बूत अवधारणाएँ — वास्तविक परीक्षा से वर्षों पहले।',
    },
    eligibility: [
      {
        en: 'Batch: students who have passed Class 10 or Class 12',
        mr: 'बॅच: इयत्ता १० वी किंवा १२ वी उत्तीर्ण विद्यार्थी',
        hi: 'बैच: कक्षा 10वीं या 12वीं उत्तीर्ण विद्यार्थी',
      },
      {
        en: 'MPSC State Services exam itself requires graduation (degree)',
        mr: 'MPSC राज्यसेवा परीक्षेसाठी पदवी आवश्यक असते',
        hi: 'MPSC राज्य सेवा परीक्षा के लिए स्नातक (डिग्री) आवश्यक है',
      },
      {
        en: 'Exam age (recent notifications): 19–38 years for open category; relaxation for reserved categories',
        mr: 'परीक्षेसाठी वय (अलीकडील जाहिराती): खुल्या प्रवर्गासाठी १९–३८ वर्षे; राखीव प्रवर्गासाठी सवलत',
        hi: 'परीक्षा आयु (हालिया अधिसूचनाएँ): खुली श्रेणी के लिए 19–38 वर्ष; आरक्षित श्रेणियों को छूट',
      },
    ],
    selection: [
      { en: 'Preliminary examination', mr: 'पूर्व परीक्षा', hi: 'प्रारंभिक परीक्षा' },
      { en: 'Main examination', mr: 'मुख्य परीक्षा', hi: 'मुख्य परीक्षा' },
      { en: 'Interview / personality test', mr: 'मुलाखत / व्यक्तिमत्त्व चाचणी', hi: 'साक्षात्कार / व्यक्तित्व परीक्षण' },
    ],
    syllabus: [
      { en: 'History (NCERT)', mr: 'इतिहास (NCERT)', hi: 'इतिहास (NCERT)' },
      { en: 'Geography (NCERT)', mr: 'भूगोल (NCERT)', hi: 'भूगोल (NCERT)' },
      { en: 'Indian Polity', mr: 'भारतीय राज्यव्यवस्था', hi: 'भारतीय राजव्यवस्था' },
      { en: 'Economics', mr: 'अर्थशास्त्र', hi: 'अर्थशास्त्र' },
      { en: 'General Science', mr: 'सामान्य विज्ञान', hi: 'सामान्य विज्ञान' },
      { en: 'Current Affairs', mr: 'चालू घडामोडी', hi: 'समसामयिकी' },
      { en: 'Aptitude basics — comprehension, reasoning, maths', mr: 'कल चाचणी मूलतत्त्वे — आकलन, तर्क, गणित', hi: 'अभिक्षमता मूल बातें — बोध, तर्क, गणित' },
    ],
    questions: [
      {
        q: {
          en: 'Who was the first Chief Minister of Maharashtra?',
          mr: 'महाराष्ट्राचे पहिले मुख्यमंत्री कोण होते?',
          hi: 'महाराष्ट्र के पहले मुख्यमंत्री कौन थे?',
        },
        a: { en: 'Yashwantrao Chavan', mr: 'यशवंतराव चव्हाण', hi: 'यशवंतराव चव्हाण' },
      },
      {
        q: {
          en: 'Fundamental Rights are given in which Part of the Indian Constitution?',
          mr: 'मूलभूत हक्क भारतीय संविधानाच्या कोणत्या भागात आहेत?',
          hi: 'मौलिक अधिकार भारतीय संविधान के किस भाग में हैं?',
        },
        a: { en: 'Part III', mr: 'भाग III', hi: 'भाग III' },
      },
      {
        q: {
          en: 'On which date was the state of Maharashtra formed?',
          mr: 'महाराष्ट्र राज्याची स्थापना कोणत्या दिवशी झाली?',
          hi: 'महाराष्ट्र राज्य का गठन किस दिन हुआ?',
        },
        a: { en: '1 May 1960', mr: '१ मे १९६०', hi: '1 मई 1960' },
      },
    ],
  },
  {
    id: 'class8-pathway',
    category: 'foundation',
    icon: 'school',
    accent: 'saffron',
    popular: false,
    title: {
      en: 'Class 8 to Government Job Career Pathway',
      mr: 'इयत्ता ८ वी ते सरकारी नोकरी करिअर मार्ग',
      hi: 'कक्षा 8वीं से सरकारी नौकरी करियर मार्ग',
    },
    tagline: {
      en: 'Long-term preparation starting from Class 8',
      mr: 'इयत्ता ८ वी पासून दीर्घकालीन तयारी',
      hi: 'कक्षा 8वीं से दीर्घकालीन तैयारी',
    },
    summary: {
      en: 'A disciplined, step-by-step pathway from Class 8 onwards — academic foundation, physical fitness and career guidance towards defence, police and government jobs.',
      mr: 'इयत्ता ८ वी पासून शिस्तबद्ध, टप्प्याटप्प्याने मार्ग — शैक्षणिक पाया, शारीरिक तंदुरुस्ती आणि संरक्षण, पोलीस व सरकारी नोकरीसाठी करिअर मार्गदर्शन.',
      hi: 'कक्षा 8वीं से अनुशासित, चरणबद्ध मार्ग — शैक्षणिक नींव, शारीरिक फिटनेस और रक्षा, पुलिस व सरकारी नौकरी के लिए करियर मार्गदर्शन।',
    },
    eligibility: [
      {
        en: 'Students studying in Class 8 and above',
        mr: 'इयत्ता ८ वी व पुढील वर्गात शिकणारे विद्यार्थी',
        hi: 'कक्षा 8वीं और उससे ऊपर पढ़ने वाले विद्यार्थी',
      },
      {
        en: 'Residential and non-residential options — contact the academy for details',
        mr: 'निवासी व अनिवासी पर्याय — तपशीलासाठी अकॅडमीशी संपर्क साधा',
        hi: 'आवासीय व गैर-आवासीय विकल्प — विवरण के लिए अकॅडमी से संपर्क करें',
      },
    ],
    selection: [
      { en: 'Class 8–10: academic foundation, fitness and discipline', mr: 'इयत्ता ८–१०: शैक्षणिक पाया, तंदुरुस्ती व शिस्त', hi: 'कक्षा 8–10: शैक्षणिक नींव, फिटनेस व अनुशासन' },
      { en: 'Class 10–12: choosing the target exam and focused preparation', mr: 'इयत्ता १०–१२: लक्ष्य परीक्षा निवड व केंद्रित तयारी', hi: 'कक्षा 10–12: लक्ष्य परीक्षा का चयन और केंद्रित तैयारी' },
      { en: 'After 10th / 12th / graduation: recruitment exams and MPSC', mr: '१० वी / १२ वी / पदवीनंतर: भरती परीक्षा व MPSC', hi: '10वीं / 12वीं / स्नातक के बाद: भर्ती परीक्षाएँ व MPSC' },
    ],
    syllabus: [
      { en: 'Mathematics fundamentals', mr: 'गणिताची मूलतत्त्वे', hi: 'गणित के मूल सिद्धांत' },
      { en: 'Science', mr: 'विज्ञान', hi: 'विज्ञान' },
      { en: 'English communication', mr: 'इंग्रजी संवाद कौशल्य', hi: 'अंग्रेज़ी संवाद कौशल' },
      { en: 'General Knowledge', mr: 'सामान्य ज्ञान', hi: 'सामान्य ज्ञान' },
      { en: 'Reasoning basics', mr: 'बुद्धिमत्ता चाचणी मूलतत्त्वे', hi: 'रीज़निंग की मूल बातें' },
      { en: 'Physical training and personality development', mr: 'शारीरिक प्रशिक्षण व व्यक्तिमत्त्व विकास', hi: 'शारीरिक प्रशिक्षण व व्यक्तित्व विकास' },
    ],
    questions: [
      {
        q: { en: 'What is the LCM of 4 and 6?', mr: '४ आणि ६ चा लसावि किती?', hi: '4 और 6 का लघुत्तम समापवर्त्य (LCM) क्या है?' },
        a: { en: '12', mr: '१२', hi: '12' },
      },
      {
        q: { en: 'Which planet is known as the Red Planet?', mr: 'कोणत्या ग्रहाला लाल ग्रह म्हणतात?', hi: 'किस ग्रह को लाल ग्रह कहा जाता है?' },
        a: { en: 'Mars', mr: 'मंगळ', hi: 'मंगल' },
      },
      {
        q: { en: 'How many states does India have?', mr: 'भारतात किती राज्ये आहेत?', hi: 'भारत में कितने राज्य हैं?' },
        a: { en: '28', mr: '२८', hi: '28' },
      },
    ],
  },
]
