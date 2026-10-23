// "Our Alumni" — verified selection records ONLY. Until the academy supplies
// authentic records, the page and the home section show SAMPLE_ALUMNI: layout
// placeholders with a generic "Alumni name" and no photo.
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

export const SAMPLE_ALUMNI = [
  ['army', 2025],
  ['police', 2025],
  ['navy', 2025],
  ['airforce', 2025],
  ['police', 2024],
  ['army', 2024],
  ['saralseva', 2024],
  ['mpsc', 2024],
  ['police', 2023],
  ['army', 2023],
  ['navy', 2023],
  ['airforce', 2023],
].map(([post, year], index) => ({ id: `sample-${index}`, post, year, sample: true }))

/** Real records when there are any, otherwise the labelled samples. */
export const ALUMNI = ACHIEVEMENTS.length > 0 ? ACHIEVEMENTS : SAMPLE_ALUMNI
