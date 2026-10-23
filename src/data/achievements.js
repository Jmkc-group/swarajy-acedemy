// "Our Alumni" — verified selection records ONLY. Until the academy supplies
// authentic records, the page and the home section show SAMPLE_ALUMNI: layout
// placeholders with a generic "Alumni name" and a sample photo per post.
// They disappear automatically once ACHIEVEMENTS has at least one record.
//
// Record shape (add one object per selected student):
// {
//   id: 'unique-id',
//   name: { en: 'Full Name', mr: 'पूर्ण नाव', hi: 'पूरा नाम' },
//   village: { en: 'Village', mr: 'गाव', hi: 'गाँव' },
//   post: 'police',            // one of ACHIEVEMENT_POSTS ids
//   postLabel: { en: 'Police Constable, Pune', mr: '...', hi: '...' },
//   year: 2025,                // one of ACHIEVEMENT_YEARS
//   photo: importedImage,      // optional — only the student's own photo, with consent
// }

export const ACHIEVEMENT_YEARS = [2023, 2024, 2025, 2026]

export const ACHIEVEMENT_POSTS = ['police', 'army', 'navy', 'airforce', 'saralseva', 'mpsc']

export const ACHIEVEMENTS = []

// Sample photos live in public/ (served from the site root); each is reused
// only on a card of the matching post so the uniform fits the badge.
const samplePhoto = (file) => encodeURI(`/${file}.png`)

export const SAMPLE_ALUMNI = [
  ['police', 2025, 'police girl'],
  ['navy', 2025, 'navy man'],
  ['airforce', 2025, 'air force girl'],
  ['saralseva', 2025, 'saralseva men'],
  ['mpsc', 2025, 'mpsc girl'],
  ['police', 2024, 'police man'],
  ['navy', 2024, 'navy girl'],
  ['airforce', 2024, 'air force man'],
  ['saralseva', 2024, 'saralseva girl'],
  ['mpsc', 2024, 'mpsc man'],
  ['police', 2023, 'police girl'],
  ['navy', 2023, 'navy man'],
  ['airforce', 2023, 'air force girl'],
  ['saralseva', 2023, 'saralseva men'],
  ['mpsc', 2023, 'mpsc girl'],
].map(([post, year, file], index) => ({ id: `sample-${index}`, post, year, photo: samplePhoto(file), sample: true }))

/** Real records when there are any, otherwise the labelled samples. */
export const ALUMNI = ACHIEVEMENTS.length > 0 ? ACHIEVEMENTS : SAMPLE_ALUMNI
