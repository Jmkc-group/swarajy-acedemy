// Verified selection records ONLY. Nothing is listed until the academy supplies
// authentic records — the Achievements page then shows an empty state.
//
// Record shape (add one object per selected student):
// {
//   id: 'unique-id',
//   name: { en: 'Full Name', mr: 'पूर्ण नाव', hi: 'पूरा नाम' },
//   village: { en: 'Village', mr: 'गाव', hi: 'गाँव' },
//   post: 'police',            // one of ACHIEVEMENT_POSTS ids
//   postLabel: { en: 'Police Constable, Pune', mr: '...', hi: '...' },
//   year: 2025,                // one of ACHIEVEMENT_YEARS
//   photo: importedImage,      // optional — only a real photo with consent
// }

export const ACHIEVEMENT_YEARS = [2023, 2024, 2025, 2026]

export const ACHIEVEMENT_POSTS = ['police', 'army', 'navy', 'airforce', 'saralseva', 'mpsc']

export const ACHIEVEMENTS = []
