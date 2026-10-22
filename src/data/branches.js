// Branch addresses as supplied by the academy.
// No verified coordinates are available, so maps links use an address search
// instead of fixed pins. Phone numbers are academy-wide (see data/site.js).

export const BRANCHES = [
  {
    id: 'pimpri-chinchwad',
    name: {
      en: 'Pimpri-Chinchwad Branch',
      mr: 'पिंपरी-चिंचवड शाखा',
      hi: 'पिंपरी-चिंचवड शाखा',
    },
    area: {
      en: 'Pune-33',
      mr: 'पुणे-३३',
      hi: 'पुणे-33',
    },
    address: {
      en: 'Jijamata Chowk, Railway Station, Pune-33 (Pimpri-Chinchwad)',
      mr: 'जिजामाता चौक, रेल्वे स्टेशन, पुणे-३३ (पिंपरी-चिंचवड)',
      hi: 'जिजामाता चौक, रेलवे स्टेशन, पुणे-33 (पिंपरी-चिंचवड)',
    },
    mapQuery: 'Jijamata Chowk, Railway Station, Pimpri-Chinchwad, Pune 411033',
  },
  {
    id: 'supe-baramati',
    name: {
      en: 'Supe (Baramati) Branch',
      mr: 'सुपे (बारामती) शाखा',
      hi: 'सुपे (बारामती) शाखा',
    },
    area: {
      en: 'Tal. Baramati, Dist. Pune',
      mr: 'ता. बारामती, जि. पुणे',
      hi: 'तह. बारामती, जि. पुणे',
    },
    address: {
      en: 'Kalbhairavwadi-Supe, Morgaon Road, Tal. Baramati, Dist. Pune',
      mr: 'काळभैरववाडी-सुपे, मोरगाव रोड, ता. बारामती, जि. पुणे',
      hi: 'कालभैरववाडी-सुपे, मोरगाँव रोड, तह. बारामती, जि. पुणे',
    },
    mapQuery: 'Kalbhairavwadi, Supe, Morgaon Road, Baramati, Pune',
  },
]
