// Facility photo galleries, picked up automatically from
// src/assets/facilities/<facility-id>/ — drop real photos into the matching
// folder and they appear in that card's side panel. Files are shown in name
// order, and the caption comes from the file name:
//   01-library-room.webp  ->  "Library room"

const files = import.meta.glob('/src/assets/facilities/*/*.{jpg,jpeg,png,webp,avif}', {
  eager: true,
  import: 'default',
})

function captionFrom(fileName) {
  const words = fileName
    .replace(/\.[^.]+$/, '')
    .replace(/^\d+[-_ ]*/, '')
    .replace(/[-_]+/g, ' ')
    .trim()
  return words.charAt(0).toUpperCase() + words.slice(1)
}

export const FACILITY_PHOTOS = Object.keys(files)
  .sort()
  .reduce((byFacility, path) => {
    const [facilityId, fileName] = path.split('/').slice(-2)
    ;(byFacility[facilityId] ??= []).push({ src: files[path], caption: captionFrom(fileName) })
    return byFacility
  }, {})

export const getFacilityPhotos = (facilityId) => FACILITY_PHOTOS[facilityId] ?? []
