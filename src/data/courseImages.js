// Course card background photos, picked up automatically from
// src/assets/courses/<course-id>.<ext> — e.g. police.jpg for the `police`
// course. Drop in a real photo with the same name to replace one.

const files = import.meta.glob('/src/assets/courses/*.{jpg,jpeg,png,webp,avif}', {
  eager: true,
  import: 'default',
})

export const COURSE_IMAGES = Object.fromEntries(
  Object.entries(files).map(([path, src]) => [path.split('/').pop().replace(/\.[^.]+$/, ''), src]),
)

export const getCourseImage = (courseId) => COURSE_IMAGES[courseId]
