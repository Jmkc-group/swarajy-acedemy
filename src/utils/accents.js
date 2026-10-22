// Force / theme accents. Each course and facility picks one so a visitor can
// recognise Police (khaki), Army (olive), Navy (navy) and Air Force (sky) at a glance.
export const ACCENTS = {
  khaki: {
    icon: 'bg-khaki/15 text-khaki-deep ring-khaki/30',
    bar: 'from-khaki to-sand',
    border: 'hover:border-khaki/60',
    glow: 'rgb(184 131 90 / 0.18)',
  },
  olive: {
    icon: 'bg-olive/12 text-olive ring-olive/25',
    bar: 'from-olive to-army',
    border: 'hover:border-olive/50',
    glow: 'rgb(63 90 42 / 0.16)',
  },
  navy: {
    icon: 'bg-navy/10 text-navy ring-navy/20',
    bar: 'from-navy-950 to-navy',
    border: 'hover:border-navy/40',
    glow: 'rgb(30 58 138 / 0.14)',
  },
  airforce: {
    icon: 'bg-airforce/10 text-blue-700 ring-airforce/25',
    bar: 'from-navy to-airforce',
    border: 'hover:border-airforce/50',
    glow: 'rgb(59 130 246 / 0.15)',
  },
  forest: {
    icon: 'bg-leaf/10 text-forest ring-leaf/25',
    bar: 'from-forest to-leaf',
    border: 'hover:border-leaf/50',
    glow: 'rgb(31 107 53 / 0.15)',
  },
  saffron: {
    icon: 'bg-saffron/10 text-saffron-deep ring-saffron/25',
    bar: 'from-saffron to-gold',
    border: 'hover:border-saffron/50',
    glow: 'rgb(234 88 12 / 0.13)',
  },
}

export function getAccent(name) {
  return ACCENTS[name] ?? ACCENTS.forest
}
