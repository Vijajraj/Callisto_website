/**
 * =====================================================================
 * CALLISTO DEEP SPACE OBSERVATORY & ASTRODYNAMICS ENGINE
 * =====================================================================
 * Architect & Developer: vijayraj.s
 * GitHub Profile: https://github.com/Vijajraj
 * Repository: https://github.com/Vijajraj/Callisto_website
 * =====================================================================
 */

export interface Department {
  id: string;
  name: string;
  themedName: string;
  lead: string;
  role: string;
  roleAssigned?: string;
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
    lead: 'Open to All Members',
    roleAssigned: '',
    role: '',
    shipModule: '',
    description: '',
    icon: '/icons/dept-general.png',
    color: '--star',
    openRoles: [],
  },
  {
    id: 'presidential',
    name: 'Presidential Committee',
    themedName: 'Polaris Circle',
    lead: 'Executive Committee',
    roleAssigned: '',
    role: '',
    shipModule: '',
    description: '',
    icon: '/icons/dept-presidential.png',
    color: '--orbit',
    openRoles: [],
  },
  {
    id: 'international',
    name: 'International Relations',
    themedName: 'Constellation Wing',
    lead: 'Harshitha',
    roleAssigned: 'Harshitha',
    role: 'Secretary',
    shipModule: '',
    description: '',
    icon: '/icons/dept-international.png',
    color: '--astrophage',
    openRoles: [],
  },
  {
    id: 'social-media',
    name: 'Social Media & Promotions',
    themedName: 'Orbit Wing',
    lead: 'Mirudhula',
    roleAssigned: 'Mirudhula',
    role: 'Team Leader',
    shipModule: '',
    description: '',
    icon: '/icons/dept-social.png',
    color: '--orbit',
    openRoles: [],
  },
  {
    id: 'content',
    name: 'Content',
    themedName: 'StarCast',
    lead: 'Mukilan',
    roleAssigned: 'Mukilan',
    role: 'Team Leader',
    shipModule: '',
    description: '',
    icon: '/icons/dept-content.png',
    color: '--sol-dust',
    openRoles: [],
  },
  {
    id: 'event',
    name: 'Event',
    themedName: 'Event Horizon',
    lead: 'Mahavishnu | Siddiksha',
    roleAssigned: 'Mahavishnu | Siddiksha',
    role: 'Secretary | Honorary Member',
    shipModule: '',
    description: '',
    icon: '/icons/dept-event.png',
    color: '--astrophage',
    openRoles: [],
  },
  {
    id: 'design',
    name: 'Design & Visual Media',
    themedName: 'Nebula Wing',
    lead: 'Azmina',
    roleAssigned: 'Azmina',
    role: 'Secretary',
    shipModule: '',
    description: '',
    icon: '/icons/dept-design.png',
    color: '--star',
    openRoles: [],
  },
  {
    id: 'tech',
    name: 'Technology & Development',
    themedName: 'Tesseract',
    lead: 'Vijay Raj | Yash',
    roleAssigned: 'Vijay Raj | Yash',
    role: 'Honorary member(s)',
    shipModule: '',
    description: '',
    icon: '/icons/dept-tech.png',
    color: '--orbit',
    openRoles: [],
  },
  {
    id: 'astronomy',
    name: 'Astronomy & Science Engagement',
    themedName: 'LUNAR Society',
    lead: 'Guru',
    roleAssigned: 'Guru',
    role: 'Secretary',
    shipModule: '',
    description: '',
    icon: '/icons/dept-astronomy.png',
    color: '--sol-dust',
    openRoles: [],
  },
  {
    id: 'people',
    name: 'People Management',
    themedName: 'Stellar Path',
    lead: 'Aishmica Harish | Sheetal BN',
    roleAssigned: 'Aishmica Harish | Sheetal BN',
    role: 'Secretary | Team Leader',
    shipModule: '',
    description: '',
    icon: '/icons/dept-people.png',
    color: '--star',
    openRoles: [],
  },
  {
    id: 'research',
    name: 'Research & Development',
    themedName: 'Aether Wing',
    lead: 'Mridula Natraj',
    roleAssigned: 'Mridula Natraj',
    role: 'Team Leader',
    shipModule: '',
    description: '',
    icon: '/icons/dept-research.png',
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
