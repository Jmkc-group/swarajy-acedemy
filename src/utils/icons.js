import {
  Anchor,
  BedDouble,
  BookOpen,
  BriefcaseBusiness,
  Building2,
  ClipboardCheck,
  Dumbbell,
  House,
  Landmark,
  Library,
  Mic,
  MonitorPlay,
  Mountain,
  CirclePlay,
  Plane,
  School,
  Shield,
  Swords,
  Utensils,
} from 'lucide-react'

// Data files reference icons by name so they stay free of UI imports.
export const ICONS = {
  anchor: Anchor,
  bed: BedDouble,
  book: BookOpen,
  briefcase: BriefcaseBusiness,
  building: Building2,
  clipboard: ClipboardCheck,
  dumbbell: Dumbbell,
  home: House,
  landmark: Landmark,
  library: Library,
  mic: Mic,
  monitor: MonitorPlay,
  mountain: Mountain,
  play: CirclePlay,
  plane: Plane,
  school: School,
  shield: Shield,
  swords: Swords,
  utensils: Utensils,
}

export function getIcon(name) {
  return ICONS[name] ?? Shield
}
