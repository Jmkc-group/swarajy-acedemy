// Academy-wide configuration. Everything here was supplied by the academy.

export const SITE = {
  name: {
    en: 'Swarajya Career Academy & Sainik School',
    mr: 'स्वराज्य करिअर अकॅडमी व सैनिक स्कूल',
    hi: 'स्वराज्य करिअर अकॅडमी व सैनिक स्कूल',
  },
  shortName: {
    en: 'Swarajya Career Academy',
    mr: 'स्वराज्य करिअर अकॅडमी',
    hi: 'स्वराज्य करिअर अकॅडमी',
  },
  subName: {
    en: '& Sainik School',
    mr: 'व सैनिक स्कूल',
    hi: 'व सैनिक स्कूल',
  },
}

// The three numbers are academy-wide. They are NOT mapped to a specific branch
// because no official branch-wise mapping was provided.
export const PHONE_NUMBERS = ['9168074652', '9168074963', '8669015236']

export const SOCIAL_LINKS = [
  {
    id: 'youtube',
    label: 'YouTube',
    handle: '@swarajyacareeracademypcmc',
    url: 'https://www.youtube.com/@swarajyacareeracademypcmc',
    // Confirmed by the academy owner. Set to false to show the handle as plain text.
    verified: true,
  },
  {
    id: 'instagram',
    label: 'Instagram',
    handle: 'swarajya_carrier_academy_',
    url: 'https://www.instagram.com/swarajya_carrier_academy_/',
    verified: true,
  },
]

// Official slogans are always shown in their original language.
// `translation` is shown underneath when the visitor reads a different language.
export const SLOGANS = [
  {
    id: 'veer',
    original: 'वीर इसलिए वीर होते हैं, क्योंकि उनके अंदर असंभव को भी संभव बनाने का जुनून होता है।',
    lang: 'hi',
    translation: {
      en: 'The brave are brave because they carry the passion to make even the impossible possible.',
      mr: 'वीर म्हणूनच वीर असतात, कारण त्यांच्यात अशक्यालाही शक्य करण्याची जिद्द असते.',
      hi: '',
    },
  },
  {
    id: 'students',
    original: 'आम्ही व्यवसाय नाही तर फक्त विद्यार्थी घडवतो...!',
    lang: 'mr',
    translation: {
      en: 'We do not run a business — we only shape students...!',
      mr: '',
      hi: 'हम व्यवसाय नहीं, केवल विद्यार्थी गढ़ते हैं...!',
    },
  },
  {
    id: 'first-attempt',
    original: 'पहिल्याच प्रयत्नात यश हिच आमची ओळख...!',
    lang: 'mr',
    translation: {
      en: 'Success in the very first attempt — that is our identity...!',
      mr: '',
      hi: 'पहले ही प्रयास में सफलता — यही हमारी पहचान है...!',
    },
  },
]
