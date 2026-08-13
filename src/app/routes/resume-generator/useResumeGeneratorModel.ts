import { useState } from 'react';

export type ResumeLink = {
  id: string;
  label: string;
  url: string;
};

export type ResumeExperience = {
  id: string;
  dateRange: string;
  role: string;
  company: string;
  location: string;
  bullets: string[];
};

export type ResumeSkill = {
  id: string;
  name: string;
  level: string;
};

export type ResumeEducation = {
  id: string;
  dateRange: string;
  institution: string;
  degree: string;
};

export const FIELD_LIMITS = {
  fullName: 40,
  headline: 60,
  cityCountry: 40,
  phone: 20,
  email: 50,
  linkLabel: 140,
  linkUrl: 140,
  experienceDateRange: 24,
  experienceRole: 40,
  experienceCompany: 40,
  experienceLocation: 40,
  experienceBullet: 120,
  skillName: 24,
  language: 24,
  hobbies: 60,
  educationDateRange: 24,
  educationInstitution: 44,
  educationDegree: 60,
} as const;

type ResumeDraft = {
  fullName: string;
  headline: string;
  cityCountry: string;
  phone: string;
  email: string;
  links: ResumeLink[];
  experiences: ResumeExperience[];
  skills: ResumeSkill[];
  languages: string[];
  hobbies: string;
  experiencePage: number;
  education: ResumeEducation[];
};

export type ResumeGeneratorModel = {
  fullName: string;
  setFullName: (value: string) => void;
  headline: string;
  setHeadline: (value: string) => void;
  cityCountry: string;
  setCityCountry: (value: string) => void;
  phone: string;
  setPhone: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  links: ResumeLink[];
  updateLink: (id: string, patch: Partial<ResumeLink>) => void;
  experiences: ResumeExperience[];
  updateExperience: (id: string, patch: Partial<ResumeExperience>) => void;
  updateExperienceBullet: (id: string, bulletIndex: number, value: string) => void;
  skills: ResumeSkill[];
  updateSkill: (id: string, patch: Partial<ResumeSkill>) => void;
  clearSkills: () => void;
  languages: string[];
  updateLanguage: (index: number, value: string) => void;
  clearLanguages: () => void;
  hobbies: string;
  setHobbies: (value: string) => void;
  education: ResumeEducation[];
  updateEducation: (id: string, patch: Partial<ResumeEducation>) => void;
  activeExperienceIndex: number;
  activeExperience?: ResumeExperience;
  totalExperiences: number;
  canGoToPreviousExperience: boolean;
  canGoToNextExperience: boolean;
  goToPreviousExperience: () => void;
  goToNextExperience: () => void;
  clearActiveExperience: () => void;
  resetAll: () => void;
};

function createId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function createInitialLinks(): ResumeLink[] {
  return [
    { id: createId(), label: 'GitHub', url: 'https://github.com/erick-hz' },
    { id: createId(), label: 'Portfolio', url: 'https://erick-hz.vercel.app/' },
  ];
}

export function createInitialExperiences(): ResumeExperience[] {
  return [
    {
      id: createId(),
      dateRange: 'Jul 2025 - Aug 2026',
      role: 'Front-end Developer',
      company: 'Hexaware (Ernst & Young)',
      location: 'Atlanta, Georgia, USA',
      bullets: [
        'Developed scalable React + TypeScript interfaces using clean, feature-based architecture.',
        'Implemented type-safe routing and navigation with TanStack Router.',
        'Managed server state and API communication with TanStack Query.',
        'Built reusable, responsive UI components with design-system thinking.',
      ],
    },
    {
      id: createId(),
      dateRange: 'Jun 2024 - Jun 2025',
      role: 'Front-end Developer',
      company: 'Tech Mahindra (Scotiabank)',
      location: 'Toronto, ON, Canada',
      bullets: [
        'Developed web apps using React and Redux Toolkit for scalable state management.',
        'Integrated REST APIs for secure and efficient client-server communication.',
        'Implemented unit and integration tests with Jest and React Testing Library.',
      ],
    },
    {
      id: createId(),
      dateRange: 'Jun 2021 - Jun 2024',
      role: 'Front-end Developer',
      company: 'Pixelbot',
      location: 'Toronto, ON, Canada',
      bullets: [
        'Development and Maintenance of Components using React JS and other related technologies.',
        'Integration and Communication with APIs.',
        'Translate UI/UX designs into React components, ensuring pixel-perfect implementation and responsiveness.',
      ],
    },
  ];
}

export function createInitialSkills(): ResumeSkill[] {
  return [
    { id: createId(), name: 'React JS', level: 'Expert' },
    { id: createId(), name: 'TypeScript', level: 'Expert' },
    { id: createId(), name: 'Redux', level: 'Expert' },
    { id: createId(), name: 'Node JS', level: 'Expert' },
    { id: createId(), name: 'Git', level: 'Expert' },
    { id: createId(), name: 'HTML & CSS (Tailwind)', level: 'Expert' },
  ];
}

export function createInitialLanguages(): string[] {
  return ['English', 'Spanish', 'Japanese'];
}

export function createInitialEducation(): ResumeEducation[] {
  return [
    {
      id: createId(),
      dateRange: 'Jan 2017 - Jan 2020',
      institution: 'Universidad Tecnologica de Mexico',
      degree: 'Artificial Intelligence Engineering',
    },
  ];
}

function createInitialDraft(): ResumeDraft {
  return {
    fullName: 'Erick Hernandez',
    headline: 'Software Developer',
    cityCountry: 'Mexico City',
    phone: '+52 5575251994',
    email: 'yerickk8@gmail.com',
    links: createInitialLinks(),
    experiences: createInitialExperiences(),
    skills: createInitialSkills(),
    languages: createInitialLanguages(),
    hobbies: 'Traveling - Fitness - Music - Reading',
    experiencePage: 0,
    education: createInitialEducation(),
  };
}

export function groupByPairs<T>(items: T[]) {
  const rows: T[][] = [];

  for (let index = 0; index < items.length; index += 2) {
    rows.push(items.slice(index, index + 2));
  }

  return rows;
}

export function useResumeGeneratorModel(): ResumeGeneratorModel {
  const [draft, setDraft] = useState<ResumeDraft>(() => createInitialDraft());

  const updateLink = (id: string, patch: Partial<ResumeLink>) => {
    setDraft((prev) => ({
      ...prev,
      links: prev.links.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    }));
  };

  const updateExperience = (id: string, patch: Partial<ResumeExperience>) => {
    setDraft((prev) => ({
      ...prev,
      experiences: prev.experiences.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    }));
  };

  const updateExperienceBullet = (id: string, bulletIndex: number, value: string) => {
    setDraft((prev) => ({
      ...prev,
      experiences: prev.experiences.map((item) =>
        item.id === id
          ? {
              ...item,
              bullets: item.bullets.map((bullet, index) =>
                index === bulletIndex ? value : bullet,
              ),
            }
          : item,
      ),
    }));
  };

  const updateSkill = (id: string, patch: Partial<ResumeSkill>) => {
    setDraft((prev) => ({
      ...prev,
      skills: prev.skills.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    }));
  };

  const clearSkills = () => {
    setDraft((prev) => ({
      ...prev,
      skills: prev.skills.map((item) => ({
        ...item,
        name: '',
      })),
    }));
  };

  const updateLanguage = (index: number, value: string) => {
    setDraft((prev) => ({
      ...prev,
      languages: prev.languages.map((item, itemIndex) => (itemIndex === index ? value : item)),
    }));
  };

  const clearLanguages = () => {
    setDraft((prev) => ({
      ...prev,
      languages: prev.languages.map(() => ''),
    }));
  };

  const updateEducation = (id: string, patch: Partial<ResumeEducation>) => {
    setDraft((prev) => ({
      ...prev,
      education: prev.education.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    }));
  };

  const totalExperiences = draft.experiences.length;
  const activeExperienceIndex = Math.min(draft.experiencePage, Math.max(totalExperiences - 1, 0));
  const activeExperience = draft.experiences[activeExperienceIndex];
  const canGoToPreviousExperience = activeExperienceIndex > 0;
  const canGoToNextExperience = activeExperienceIndex < totalExperiences - 1;

  const goToPreviousExperience = () => {
    setDraft((prev) => ({
      ...prev,
      experiencePage: Math.max(prev.experiencePage - 1, 0),
    }));
  };

  const goToNextExperience = () => {
    setDraft((prev) => ({
      ...prev,
      experiencePage: Math.min(prev.experiencePage + 1, prev.experiences.length - 1),
    }));
  };

  const clearActiveExperience = () => {
    if (!activeExperience) {
      return;
    }

    setDraft((prev) => ({
      ...prev,
      experiences: prev.experiences.map((item) =>
        item.id === activeExperience.id
          ? {
              ...item,
              dateRange: '',
              role: '',
              company: '',
              location: '',
              bullets: item.bullets.map(() => ''),
            }
          : item,
      ),
    }));
  };

  const resetAll = () => {
    setDraft(createInitialDraft());
  };

  return {
    fullName: draft.fullName,
    setFullName: (value) => setDraft((prev) => ({ ...prev, fullName: value })),
    headline: draft.headline,
    setHeadline: (value) => setDraft((prev) => ({ ...prev, headline: value })),
    cityCountry: draft.cityCountry,
    setCityCountry: (value) => setDraft((prev) => ({ ...prev, cityCountry: value })),
    phone: draft.phone,
    setPhone: (value) => setDraft((prev) => ({ ...prev, phone: value })),
    email: draft.email,
    setEmail: (value) => setDraft((prev) => ({ ...prev, email: value })),
    links: draft.links,
    updateLink,
    experiences: draft.experiences,
    updateExperience,
    updateExperienceBullet,
    skills: draft.skills,
    updateSkill,
    clearSkills,
    languages: draft.languages,
    updateLanguage,
    clearLanguages,
    hobbies: draft.hobbies,
    setHobbies: (value) => setDraft((prev) => ({ ...prev, hobbies: value })),
    education: draft.education,
    updateEducation,
    activeExperienceIndex,
    activeExperience,
    totalExperiences,
    canGoToPreviousExperience,
    canGoToNextExperience,
    goToPreviousExperience,
    goToNextExperience,
    clearActiveExperience,
    resetAll,
  };
}
