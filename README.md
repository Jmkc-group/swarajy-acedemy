# Swarajya Career Academy & Sainik School — Website

Frontend-only, multilingual (English / मराठी / हिंदी) website for **स्वराज्य करिअर अकॅडमी व सैनिक स्कूल** — pre-recruitment training for Police, Army, Navy, Air Force, Saralseva Bharti and MPSC.

There is **no backend, database or API**. All content lives in local JavaScript files; the only browser storage used is `localStorage` for the language preference.

## Tech stack

| Purpose | Library |
| --- | --- |
| Framework / build | React 19 + Vite 8 (JavaScript) |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite`) |
| UI components | shadcn/ui (Radix primitives) in `src/components/ui/` |
| Visual effects | Aceternity UI–style components in `src/components/aceternity/` |
| Animation | `motion` (Framer Motion) — respects `prefers-reduced-motion` |
| Routing | React Router DOM |
| Icons | Lucide React |
| Toasts | Sonner (via shadcn) |
| Language | React Context API + `localStorage` |

## Getting started

Requirements: **Node.js 20.19+** (tested on Node 24) and npm.

```bash
cd swarajya-career-academy
npm install        # install dependencies
npm run dev        # start the dev server → http://localhost:5173
```

### Other scripts

```bash
npm run build      # production build into dist/
npm run preview    # serve the production build locally
npm run lint       # oxlint
```

## Project structure

```
src/
├── assets/                 logo (WebP, generated from the official logo)
├── components/
│   ├── ui/                 shadcn/ui components (button, dialog, select, sheet, tabs…)
│   ├── aceternity/         Spotlight, GridBackground, SpotlightCard, MovingBorder,
│   │                       TextGenerateEffect, HoverEffectGrid, AnimatedCounter, Reveal
│   ├── layout/             Header, Footer, MobileNavigation, ScrollToTop, Layout
│   ├── common/             SectionHeading, FeatureCard, CTASection, BranchCard,
│   │                       AchievementCard, EmptyState, LanguageSelector, LanguageModal,
│   │                       Modal, Toast, Notice, Seo, PageHero, …
│   ├── home/               HeroSection, HighlightsSection, GuaranteeBanner, WhyChooseUs,
│   │                       PopularCourses, EligibilityChecker, previews
│   ├── courses/            CourseCard, CourseDetailDialog
│   └── forms/              EnquiryForm, FormField
├── pages/                  one component per route (+ NotFound)
├── context/                LanguageContext (provider)
├── hooks/                  useLanguage()
├── data/                   courses, facilities, branches, schedule, achievements,
│                           eligibility, training, site, navigation
├── locales/                en.js, mr.js, hi.js
├── utils/                  validation, contact links, icon & accent maps
└── lib/utils.js            cn() helper used by shadcn/ui
```

## Routes

| Path | Page |
| --- | --- |
| `/` | Home — hero, highlights, stamp-paper guarantee, why us, courses, eligibility checker, previews |
| `/about` | About Us |
| `/courses` | Courses & Syllabus — search, category tabs, detail dialog (`/courses?course=<id>` opens one) |
| `/training` | Training & Tests — includes the *Illustrative Sample Schedule* |
| `/facilities` | Facilities & Campus |
| `/achievements` | Achievements & Success Gallery |
| `/branches` | Branches — addresses, Google Maps links, click-to-call |
| `/contact` | Admission Enquiry form (demo only, `?course=<id>` pre-selects a course) |

## Languages

- On the first visit a language picker appears; the choice is saved in `localStorage` (`sca-language`). An invalid or missing value shows the picker again.
- The header dropdown switches language without changing the route.
- UI text lives in `src/locales/{en,mr,hi}.js` — **all three files must have the same keys**.
- Data files use `{ en, mr, hi }` objects; components read them with `pick()` from `useLanguage()`.
- Official slogans are always shown in their original language, with a translation underneath for other languages.

## Updating content

| What | Where |
| --- | --- |
| Phone numbers, social links, slogans | `src/data/site.js` |
| Courses, syllabus, practice questions | `src/data/courses.js` |
| Eligibility figures (indicative) | `src/data/eligibility.js` |
| Facilities | `src/data/facilities.js` (add an `image` to show a real photo) |
| Branches | `src/data/branches.js` |
| Selected students | `src/data/achievements.js` — see the record format at the top of the file |

**Only add verified information.** Selection records, photos and eligibility figures should come from the academy or official notifications.

## Important notes

- **Enquiry form is a demo.** It validates in the browser and shows a toast, but nothing is sent to the academy. The form and toast say this clearly. Connect a form service or backend before going live if real enquiries are needed.
- **Eligibility figures are indicative**, based on recent recruitment notifications (2025–26 cycles). Every view tells visitors to verify the latest official notification.
- **Stamp-paper guarantee** is shown as the academy's own claim, with a "contact the academy for full terms" message.
- **Achievements** is intentionally empty until verified records are supplied.
- **No campus photographs** are used, because none were supplied; facilities use icon cards.
- **SEO**: each page sets its own title, description and Open Graph tags in the active language. No canonical URL is set because the production domain is not confirmed. Once it is, make `og:image` in `index.html` an absolute URL.

## Deployment

`npm run build` outputs a static site in `dist/`. Because it is a single-page app, configure the host to serve `index.html` for unknown paths:

- **Netlify:** add `public/_redirects` with `/* /index.html 200`
- **Vercel:** add a rewrite of `/(.*)` to `/index.html`
- **Apache / Nginx:** fall back to `index.html` (`try_files $uri /index.html;`)
