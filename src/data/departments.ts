export interface Department {
  id: string;
  name: string;
  themedName: string;
  lead: string;
  shipModule: string;
  description: string;
  icon: string;
  color: string;
  openRoles: string[];
}

export const departments: Department[] = [
  {
    id: 'general',
    name: 'General',
    themedName: 'Starfield',
    lead: 'All Members',
    shipModule: '',
    description: '',
    icon: '✨',
    color: '--star',
    openRoles: [],
  },
  {
    id: 'presidential',
    name: 'Presidential Committee',
    themedName: 'Polaris Circle',
    lead: 'Lathika Rajesh (VP Nomination)',
    shipModule: '',
    description: '',
    icon: '🧭',
    color: '--orbit',
    openRoles: [],
  },
  {
    id: 'international',
    name: 'International Relations',
    themedName: 'Constellation wing',
    lead: 'Harshitha',
    shipModule: '',
    description: '',
    icon: '📡',
    color: '--astrophage',
    openRoles: [],
  },
  {
    id: 'social-media',
    name: 'Social Media & Promotions',
    themedName: 'Orbit Wing',
    lead: 'Mirudhula',
    shipModule: '',
    description: '',
    icon: '🛰️',
    color: '--orbit',
    openRoles: [],
  },
  {
    id: 'content',
    name: 'Content',
    themedName: 'Quasar / Star Lore',
    lead: 'Siddhu Nacciar (Idea Gen)',
    shipModule: '',
    description: '',
    icon: '📜',
    color: '--sol-dust',
    openRoles: [],
  },
  {
    id: 'event',
    name: 'Event',
    themedName: 'Event Horizon / Odyssey',
    lead: 'Siddh',
    shipModule: '',
    description: '',
    icon: '🚀',
    color: '--astrophage',
    openRoles: [],
  },
  {
    id: 'design',
    name: 'Design & Visual Media',
    themedName: 'Nebula wing (Prism / Astrolab)',
    lead: 'Azmina (TL), Mridhula Nataraj',
    shipModule: '',
    description: '',
    icon: '🎨',
    color: '--star',
    openRoles: [],
  },
  {
    id: 'tech',
    name: 'Technology & Development',
    themedName: 'Tesseract (Quantum wing)',
    lead: 'Vijay Raj (TL)',
    shipModule: '',
    description: '',
    icon: '⚡',
    color: '--orbit',
    openRoles: [],
  },
  {
    id: 'astronomy',
    name: 'Astronomy & Science Engagement',
    themedName: 'LUNAR Society',
    lead: 'Guru',
    shipModule: '',
    description: '',
    icon: '🔭',
    color: '--sol-dust',
    openRoles: [],
  },
  {
    id: 'people',
    name: 'People Management',
    themedName: 'Stellar path (Stellar guide)',
    lead: 'Aishmica Harish',
    shipModule: '',
    description: '',
    icon: '🌌',
    color: '--star',
    openRoles: [],
  },
  {
    id: 'research',
    name: 'Research & Development',
    themedName: 'Aether wing',
    lead: "TL's only",
    shipModule: '',
    description: '',
    icon: '🧪',
    color: '--astrophage',
    openRoles: [],
  },
];

export function getDepartmentById(id: string): Department | undefined {
  return departments.find((d) => d.id === id);
}

export function getDepartmentBySlug(slug: string): Department | undefined {
  return departments.find((d) => d.id === slug);
}
