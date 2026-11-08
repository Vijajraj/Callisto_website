/**
 * =====================================================================
 * CALLISTO DEEP SPACE OBSERVATORY & ASTRODYNAMICS ENGINE
 * =====================================================================
 * Architect & Developer: vijayraj.s
 * GitHub Profile: https://github.com/Vijajraj
 * Repository: https://github.com/Vijajraj/Callisto_website
 * =====================================================================
 */

export interface CrewOfficer {
  id: string;
  name: string;
  role: string;
  departmentId: string;
  departmentName: string;
  themedName: string;
  description: string;
  avatar: string;
  socialLinks: {
    github?: string;
    linkedin?: string;
    comms?: string;
  };
}

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

export const crewOfficers: CrewOfficer[] = [
  {
    id: 'aswin-ponnuraj',
    name: 'Aswin Ponnuraj',
    role: 'President',
    departmentId: 'presidential',
    departmentName: 'Presidential Committee',
    themedName: 'Polaris Circle',
    description: 'Directs overall club vision, institutional governance, mission timelines, and cross-department strategic initiatives.',
    avatar: '/crew/avatars/aswin-ponnuraj.jpg',
    socialLinks: {
      linkedin: 'https://www.linkedin.com/in/aswin-ponnuraj-6a4b14409/',
      comms: 'mailto:president@callisto.club',
    },
  },
  {
    id: 'lathika-raj',
    name: 'Lathika Raj S R',
    role: 'Vice President',
    departmentId: 'presidential',
    departmentName: 'Presidential Committee',
    themedName: 'Polaris Circle',
    description: 'Coordinates executive operations, inter-wing mission planning, university liaison, and student leadership governance.',
    avatar: '/crew/avatars/lathika-raj.svg',
    socialLinks: {
      linkedin: 'https://www.linkedin.com/in/lathikarajsr/',
      comms: 'mailto:vicepresident@callisto.club',
    },
  },
  {
    id: 'harshitha',
    name: 'Harshitha Leoamarnath',
    role: 'Secretary',
    departmentId: 'international',
    departmentName: 'International Relations',
    themedName: 'Constellation Wing',
    description: 'Coordinates international university partnerships, astronomical consortium outreach, and inter-collegiate celestial symposiums.',
    avatar: '/crew/avatars/harshitha.svg',
    socialLinks: {
      linkedin: 'https://www.linkedin.com/in/harshitha-leoamarnath-a82110382/',
      comms: 'mailto:international@callisto.club',
    },
  },
  {
    id: 'mirudhula',
    name: 'Mirudhula Madhu',
    role: 'Team Leader',
    departmentId: 'social-media',
    departmentName: 'Social Media & Promotions',
    themedName: 'Orbit Wing',
    description: 'Drives digital telemetry, public event campaigns, telescope broadcast coverage, and space science communications across social channels.',
    avatar: '/crew/avatars/mirudhula.svg',
    socialLinks: {
      linkedin: 'https://www.linkedin.com/in/mirudhula-madhu-809736383/',
      comms: 'mailto:promotions@callisto.club',
    },
  },
  {
    id: 'mukilan',
    name: 'Mukilan',
    role: 'Team Leader',
    departmentId: 'content',
    departmentName: 'Content',
    themedName: 'StarCast',
    description: 'Chief editor of StarCast publications, deep-space observatory journals, astrophotography logs, and celestial mechanics dispatches.',
    avatar: '/crew/avatars/mukilan.svg',
    socialLinks: {
      linkedin: 'https://linkedin.com',
      comms: 'mailto:editorial@callisto.club',
    },
  },
  {
    id: 'mahavishnu',
    name: 'Mahavishnu',
    role: 'Secretary',
    departmentId: 'event',
    departmentName: 'Event',
    themedName: 'Event Horizon',
    description: 'Directs logistics for major astronomical observation nights, exoplanet hackathons, planetary workshops, and campus rooftop viewings.',
    avatar: '/crew/avatars/mahavishnu.svg',
    socialLinks: {
      linkedin: 'https://linkedin.com',
      comms: 'mailto:events@callisto.club',
    },
  },
  {
    id: 'siddiksha',
    name: 'Siddiksha',
    role: 'Operations Lead',
    departmentId: 'event',
    departmentName: 'Event',
    themedName: 'Event Horizon',
    description: 'Senior advisor for stargazing expedition operations, community outreach workshops, and aerospace symposium coordination.',
    avatar: '/crew/avatars/siddiksha.svg',
    socialLinks: {
      linkedin: 'https://linkedin.com',
      comms: 'mailto:events@callisto.club',
    },
  },
  {
    id: 'azmina',
    name: 'Azmina',
    role: 'Secretary',
    departmentId: 'design',
    departmentName: 'Design & Visual Media',
    themedName: 'Nebula Wing',
    description: 'Leads visual design, mission insignia branding, interactive UI assets, and aesthetic direction for all club media.',
    avatar: '/crew/avatars/azmina.jpg',
    socialLinks: {
      linkedin: 'https://linkedin.com',
      comms: 'mailto:design@callisto.club',
    },
  },
  {
    id: 'vijayraj',
    name: 'vijayraj s',
    role: 'Lead Architect',
    departmentId: 'tech',
    departmentName: 'Technology & Development',
    themedName: 'Tesseract',
    description: 'Architect of the Callisto digital platform, Jean Meeus ephemeris orbital algorithms, and interactive telemetry engines.',
    avatar: '/crew/avatars/vijayraj.jpg',
    socialLinks: {
      github: 'https://github.com/Vijajraj',
      linkedin: 'https://www.linkedin.com/in/vijay-raj33/',
      comms: 'mailto:tech@callisto.club',
    },
  },
  {
    id: 'guru',
    name: 'Guru Harish',
    role: 'Secretary',
    departmentId: 'astronomy',
    departmentName: 'Astronomy & Science Engagement',
    themedName: 'LUNAR Society',
    description: 'Directs telescope calibration, deep-sky tracking, planetary imaging sessions, and student astrophysics research modules.',
    avatar: '/crew/avatars/guru.svg',
    socialLinks: {
      linkedin: 'https://www.linkedin.com/in/guru-harish-a5521g/',
      comms: 'mailto:astronomy@callisto.club',
    },
  },
  {
    id: 'aishmica',
    name: 'Aishmica Harish',
    role: 'Secretary',
    departmentId: 'people',
    departmentName: 'People Management',
    themedName: 'Stellar Path',
    description: 'Oversees crew onboarding, department talent allocation, internal flight wing coordination, and member welfare.',
    avatar: '/crew/avatars/aishmica.svg',
    socialLinks: {
      linkedin: 'https://www.linkedin.com/in/aishmica-harish-1a87a1368/',
      comms: 'mailto:crew@callisto.club',
    },
  },
  {
    id: 'sheetal',
    name: 'Sheetal Bathri Narayanan',
    role: 'Team Leader',
    departmentId: 'people',
    departmentName: 'People Management',
    themedName: 'Stellar Path',
    description: 'Manages member engagement, cross-department collaboration workflows, and training initiatives for incoming space cadets.',
    avatar: '/crew/avatars/sheetal.jpg',
    socialLinks: {
      linkedin: 'https://www.linkedin.com/in/sheetal-bathri-narayanan-563496364/',
      comms: 'mailto:crew@callisto.club',
    },
  },
  {
    id: 'mridula',
    name: 'Mridula Nataraj',
    role: 'Team Leader',
    departmentId: 'research',
    departmentName: 'Research & Development',
    themedName: 'Aether Wing',
    description: 'Spearheads theoretical astrophysics papers, Jovian magnetosphere simulation projects, and exoplanet data analysis pipelines.',
    avatar: '/crew/avatars/mridula.svg',
    socialLinks: {
      linkedin: 'https://www.linkedin.com/in/mridula-nataraj-170a8a368/',
      comms: 'mailto:research@callisto.club',
    },
  },
];

export const departments: Department[] = [
  {
    id: 'general',
    name: 'General',
    themedName: 'Starfield',
    lead: 'Open to All Members',
    roleAssigned: '',
    role: 'Cadets & Flight Specialists',
    shipModule: 'MOD-00',
    description: 'The foundation of the Callisto Expedition. Open to every passionate explorer, observer, and enthusiast across campus.',
    icon: '/icons/dept-general.png',
    color: '--star',
    openRoles: ['Flight Cadet', 'Observatory Attendant', 'General Member'],
  },
  {
    id: 'presidential',
    name: 'Presidential Committee',
    themedName: 'Polaris Circle',
    lead: 'Aswin Ponnuraj | Lathika Raj S R',
    roleAssigned: 'Aswin Ponnuraj | Lathika Raj S R',
    role: 'President | Vice President',
    shipModule: 'CMD-01',
    description: 'Directs overall club vision, institutional governance, mission timelines, and cross-department strategic initiatives.',
    icon: '/icons/dept-presidential.png',
    color: '--orbit',
    openRoles: ['Committee Liaison', 'Operations Coordinator'],
  },
  {
    id: 'international',
    name: 'International Relations',
    themedName: 'Constellation Wing',
    lead: 'Harshitha Leoamarnath',
    roleAssigned: 'Harshitha Leoamarnath',
    role: 'Secretary',
    shipModule: 'COM-02',
    description: 'Builds bridges with global astronomy societies, aerospace institutes, and university space clubs worldwide.',
    icon: '/icons/dept-international.png',
    color: '--astrophage',
    openRoles: ['Global Delegate', 'External Relations Officer'],
  },
  {
    id: 'social-media',
    name: 'Social Media & Promotions',
    themedName: 'Orbit Wing',
    lead: 'Mirudhula Madhu',
    roleAssigned: 'Mirudhula Madhu',
    role: 'Team Leader',
    shipModule: 'BRD-03',
    description: 'Broadcasting Callisto discoveries, event updates, mission countdowns, and space science reels across all digital channels.',
    icon: '/icons/dept-social.png',
    color: '--orbit',
    openRoles: ['Media Strategist', 'Community Manager', 'Video Producer'],
  },
  {
    id: 'content',
    name: 'Content',
    themedName: 'StarCast',
    lead: 'Mukilan',
    roleAssigned: 'Mukilan',
    role: 'Team Leader',
    shipModule: 'PUB-04',
    description: 'Crafting comprehensive sky guides, astrophysics research articles, expedition logs, and celestial dispatches.',
    icon: '/icons/dept-content.png',
    color: '--sol-dust',
    openRoles: ['Science Writer', 'Journal Editor', 'Technical Researcher'],
  },
  {
    id: 'event',
    name: 'Event',
    themedName: 'Event Horizon',
    lead: 'Mahavishnu | Siddiksha',
    roleAssigned: 'Mahavishnu | Siddiksha',
    role: 'Secretary | Operations Lead',
    shipModule: 'OPS-05',
    description: 'Organizing rooftop stargazing nights, planetary watch parties, telescope workshops, and national space symposiums.',
    icon: '/icons/dept-event.png',
    color: '--astrophage',
    openRoles: ['Logistics Coordinator', 'Stage Manager', 'Field Operations Lead'],
  },
  {
    id: 'design',
    name: 'Design & Visual Media',
    themedName: 'Nebula Wing',
    lead: 'Azmina',
    roleAssigned: 'Azmina',
    role: 'Secretary',
    shipModule: 'VIS-06',
    description: 'Shaping the visual identity of Callisto through 3D renders, poster art, UI components, and space photography post-processing.',
    icon: '/icons/dept-design.png',
    color: '--star',
    openRoles: ['3D Artist', 'Graphic Designer', 'UI/UX Specialist'],
  },
  {
    id: 'tech',
    name: 'Technology & Development',
    themedName: 'Tesseract',
    lead: 'vijayraj s',
    roleAssigned: 'vijayraj s',
    role: 'Lead Architect',
    shipModule: 'ENG-07',
    description: 'Engineering the digital backbone of the club: astronomical calculation engines, web platforms, and automated observational tools.',
    icon: '/icons/dept-tech.png',
    color: '--orbit',
    openRoles: ['Frontend Developer', 'Orbital Mechanics Programmer', 'DevOps Specialist'],
  },
  {
    id: 'astronomy',
    name: 'Astronomy & Science Engagement',
    themedName: 'LUNAR Society',
    lead: 'Guru Harish',
    roleAssigned: 'Guru Harish',
    role: 'Secretary',
    shipModule: 'OBS-08',
    description: 'Mastering optical instruments, deep-space imaging, lunar mapping, and public night sky exploration sessions.',
    icon: '/icons/dept-astronomy.png',
    color: '--sol-dust',
    openRoles: ['Telescope Operator', 'Astrophotographer', 'Observational Guide'],
  },
  {
    id: 'people',
    name: 'People Management',
    themedName: 'Stellar Path',
    lead: 'Aishmica Harish | Sheetal Bathri Narayanan',
    roleAssigned: 'Aishmica Harish | Sheetal Bathri Narayanan',
    role: 'Secretary | Team Leader',
    shipModule: 'HR-09',
    description: 'Nurturing club culture, coordinating recruitment drives, organizing internal workshops, and fostering member growth.',
    icon: '/icons/dept-people.png',
    color: '--star',
    openRoles: ['Recruitment Coordinator', 'Member Experience Lead'],
  },
  {
    id: 'research',
    name: 'Research & Development',
    themedName: 'Aether Wing',
    lead: 'Mridula Nataraj',
    roleAssigned: 'Mridula Nataraj',
    role: 'Team Leader',
    shipModule: 'LAB-10',
    description: 'Investigating Jovian moon geophysics, exoplanetary transit data, celestial dynamics, and theoretical astrophysics.',
    icon: '/icons/dept-research.png',
    color: '--astrophage',
    openRoles: ['Research Analyst', 'Data Scientist', 'Astrophysics Scholar'],
  },
];

export function getDepartmentById(id: string): Department | undefined {
  return departments.find((d) => d.id === id);
}

export function getDepartmentBySlug(slug: string): Department | undefined {
  return departments.find((d) => d.id === slug);
}

export function getOfficersByDepartment(deptId: string): CrewOfficer[] {
  return crewOfficers.filter((o) => o.departmentId === deptId);
}
