// Preliminary, indicative eligibility guidance.
// Figures reflect recent recruitment cycles (2025–26) as reported publicly; they
// change with every notification and are NOT official confirmation.
// `reservedMax` is the highest ceiling seen for reserved categories — the exact
// relaxation depends on the specific category, so the checker treats that band
// as "may be eligible".

export const CATEGORIES = ['open', 'reserved']

export const ELIGIBILITY_RULES = [
  {
    id: 'police',
    name: { en: 'Police Bharti (Constable)', mr: 'पोलीस भरती (शिपाई)', hi: 'पुलिस भर्ती (सिपाही)' },
    minAge: 18,
    openMax: 28,
    reservedMax: 33,
    categoryRelevant: true,
    education: {
      en: 'Class 12 (HSC) pass',
      mr: 'इयत्ता १२ वी (HSC) उत्तीर्ण',
      hi: 'कक्षा 12वीं (HSC) उत्तीर्ण',
    },
    officialSite: 'mahapolice.gov.in',
  },
  {
    id: 'army',
    name: { en: 'Indian Army (Agniveer)', mr: 'भारतीय सैन्यदल (अग्निवीर)', hi: 'भारतीय थल सेना (अग्निवीर)' },
    minAge: 17.5,
    openMax: 21,
    categoryRelevant: false,
    education: {
      en: 'Class 10 pass for General Duty; Class 12 for Technical / Clerk entries',
      mr: 'जनरल ड्युटीसाठी इयत्ता १० वी उत्तीर्ण; टेक्निकल / क्लर्कसाठी इयत्ता १२ वी',
      hi: 'जनरल ड्यूटी के लिए कक्षा 10वीं उत्तीर्ण; टेक्निकल / क्लर्क के लिए कक्षा 12वीं',
    },
    officialSite: 'joinindianarmy.nic.in',
  },
  {
    id: 'navy',
    name: { en: 'Indian Navy (Agniveer)', mr: 'भारतीय नौदल (अग्निवीर)', hi: 'भारतीय नौसेना (अग्निवीर)' },
    minAge: 17.5,
    openMax: 21,
    categoryRelevant: false,
    education: {
      en: 'Class 12 with Maths & Physics for SSR; Class 10 for MR',
      mr: 'SSR साठी गणित व भौतिकशास्त्रासह इयत्ता १२ वी; MR साठी इयत्ता १० वी',
      hi: 'SSR के लिए गणित व भौतिकी सहित कक्षा 12वीं; MR के लिए कक्षा 10वीं',
    },
    officialSite: 'joinindiannavy.gov.in',
  },
  {
    id: 'airforce',
    name: { en: 'Indian Air Force (Agniveervayu)', mr: 'भारतीय वायुसेना (अग्निवीरवायू)', hi: 'भारतीय वायुसेना (अग्निवीरवायु)' },
    minAge: 17.5,
    openMax: 21,
    categoryRelevant: false,
    education: {
      en: 'Class 12 (Science with Maths, Physics, English, or other streams for non-science trades) or an engineering diploma',
      mr: 'इयत्ता १२ वी (गणित, भौतिकशास्त्र, इंग्रजीसह विज्ञान किंवा नॉन-सायन्स ट्रेडसाठी इतर शाखा) किंवा अभियांत्रिकी पदविका',
      hi: 'कक्षा 12वीं (गणित, भौतिकी, अंग्रेज़ी सहित विज्ञान या नॉन-साइंस ट्रेड के लिए अन्य संकाय) या इंजीनियरिंग डिप्लोमा',
    },
    officialSite: 'agnipathvayu.cdac.in',
  },
  {
    id: 'mpsc',
    name: { en: 'MPSC State Services', mr: 'एमपीएससी राज्यसेवा', hi: 'एमपीएससी राज्य सेवा' },
    minAge: 19,
    openMax: 38,
    reservedMax: 43,
    categoryRelevant: true,
    education: {
      en: 'Graduation (degree) from a recognised university',
      mr: 'मान्यताप्राप्त विद्यापीठाची पदवी',
      hi: 'मान्यता प्राप्त विश्वविद्यालय से स्नातक (डिग्री)',
    },
    officialSite: 'mpsc.gov.in',
  },
  {
    id: 'saralseva',
    name: { en: 'Saralseva Bharti (Group C)', mr: 'सरळसेवा भरती (गट क)', hi: 'सरलसेवा भर्ती (ग्रुप C)' },
    minAge: 18,
    openMax: 38,
    reservedMax: 43,
    categoryRelevant: true,
    education: {
      en: 'Depends on the post — usually Class 10, Class 12 or graduation',
      mr: 'पदानुसार बदलते — साधारणतः इयत्ता १० वी, १२ वी किंवा पदवी',
      hi: 'पद के अनुसार बदलता है — सामान्यतः कक्षा 10वीं, 12वीं या स्नातक',
    },
    officialSite: null,
  },
]

/**
 * Returns { status, rule, ceiling }
 * status: 'below' | 'within' | 'relaxation' | 'above'
 */
export function checkEligibility({ examId, age, category }) {
  const rule = ELIGIBILITY_RULES.find((r) => r.id === examId)
  if (!rule) return null
  if (age < rule.minAge) return { status: 'below', rule }
  if (age <= rule.openMax) return { status: 'within', rule }
  if (rule.categoryRelevant && category === 'reserved' && age <= rule.reservedMax) {
    return { status: 'relaxation', rule }
  }
  return { status: 'above', rule }
}
