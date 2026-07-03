import { useState } from 'react';
import {
  BlobProvider,
  Document,
  Font,
  Link as PdfLink,
  Page,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer';

type LinkItem = {
  id: string;
  label: string;
  url: string;
};

type ExperienceItem = {
  id: string;
  dateRange: string;
  role: string;
  company: string;
  location: string;
  bullets: string[];
};

type SkillItem = {
  id: string;
  name: string;
  level: string;
};

type EducationItem = {
  id: string;
  dateRange: string;
  institution: string;
  degree: string;
};

function createId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function groupByPairs<T>(items: T[]) {
  const rows: T[][] = [];

  for (let index = 0; index < items.length; index += 2) {
    rows.push(items.slice(index, index + 2));
  }

  return rows;
}

type ResumePdfDocumentProps = {
  fullName: string;
  headline: string;
  cityCountry: string;
  phone: string;
  email: string;
  links: LinkItem[];
  experiences: ExperienceItem[];
  skills: SkillItem[];
  languages: string[];
  hobbies: string;
  education: EducationItem[];
};

Font.registerHyphenationCallback((word) => [word]);

const pdfStyles = StyleSheet.create({
  page: {
    fontFamily: 'Times-Roman',
    fontSize: 11,
    color: '#1f1f1f',
    paddingTop: 34,
    paddingRight: 36,
    paddingBottom: 34,
    paddingLeft: 36,
    lineHeight: 1.3,
  },
  header: {
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 18,
  },
  headerTitle: {
    fontFamily: 'Times-Bold',
    fontSize: 24,
    lineHeight: 1.15,
    textAlign: 'center',
  },
  headerMeta: {
    fontSize: 10.8,
    marginTop: 14,
    textAlign: 'center',
  },
  linksSection: {
    marginTop: 2,
    borderTopWidth: 1.1,
    borderTopColor: '#595959',
    paddingTop: 8,
    paddingBottom: 8,
    flexDirection: 'row',
    gap: 14,
  },
  linksTitle: {
    width: 150,
    fontSize: 11,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
  },
  linksBody: {
    flex: 1,
    minWidth: 0,
  },
  section: {
    marginTop: 14,
    paddingTop: 8,
    borderTopWidth: 1.1,
    borderTopColor: '#595959',
    flexDirection: 'row',
    gap: 14,
  },
  sectionTitle: {
    width: 150,
    fontSize: 11,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
  },
  employmentSection: {
    marginTop: 14,
    paddingTop: 8,
    borderTopWidth: 1.1,
    borderTopColor: '#595959',
    gap: 10,
  },
  employmentTitle: {
    fontSize: 12,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  employmentBody: {
    gap: 12,
  },
  sectionBody: {
    flex: 1,
    minWidth: 0,
  },
  linksText: {
    fontSize: 11,
  },
  link: {
    color: '#2f3f8c',
    textDecoration: 'underline',
  },
  columnGap: {
    gap: 12,
  },
  jobEntry: {
    gap: 4,
  },
  jobHeading: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  jobDate: {
    width: 150,
    color: '#333333',
  },
  jobRole: {
    flex: 1,
    fontWeight: 700,
    paddingRight: 8,
  },
  jobLocation: {
    width: 150,
    textAlign: 'right',
  },
  bulletList: {
    marginTop: 2,
    marginLeft: 162,
    gap: 3,
  },
  bullet: {
    fontSize: 11,
    paddingRight: 4,
  },
  skillGrid: {
    gap: 6,
  },
  skillRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 24,
  },
  skillName: {
    flex: 1,
    paddingRight: 8,
  },
  languageGrid: {
    gap: 6,
  },
  languageRow: {
    flexDirection: 'row',
    gap: 12,
  },
  languageCell: {
    flex: 1,
  },
  educationRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  educationDate: {
    width: 150,
    color: '#333333',
    textAlign: 'center',
  },
  educationBody: {
    flex: 1,
    gap: 2,
    paddingRight: 8,
  },
  educationInstitution: {
    fontWeight: 700,
  },
});

function ResumePdfDocument({
  fullName,
  headline,
  cityCountry,
  phone,
  email,
  links,
  experiences,
  skills,
  languages,
  hobbies,
  education,
}: ResumePdfDocumentProps) {
  const visibleLinks = links.filter((link) => link.label.trim() || link.url.trim());
  const visibleSkillNames = skills.map((skill) => skill.name.trim()).filter(Boolean);
  const skillRows = groupByPairs(visibleSkillNames);
  const visibleLanguages = languages.filter((language) => language.trim());
  const languageRows = groupByPairs(visibleLanguages);

  return (
    <Document>
      <Page size="A4" style={pdfStyles.page}>
        <View style={pdfStyles.header}>
          <Text style={pdfStyles.headerTitle}>
            {fullName || 'Your Name'}
            {headline ? ` - ${headline}` : ''}
          </Text>
          <Text style={pdfStyles.headerMeta}>
            {[cityCountry, phone, email].filter(Boolean).join(', ') ||
              'City, Country, Phone, Email'}
          </Text>
        </View>

        <View style={pdfStyles.linksSection}>
          <Text style={pdfStyles.linksTitle}>Links</Text>
          <View style={pdfStyles.linksBody}>
            <Text style={pdfStyles.linksText}>
              {visibleLinks.map((link, index) => (
                <Text key={link.id}>
                  <PdfLink src={link.url || '#'} style={pdfStyles.link}>
                    {link.label || link.url}
                  </PdfLink>
                  {index < visibleLinks.length - 1 ? ', ' : ''}
                </Text>
              ))}
            </Text>
          </View>
        </View>

        <View style={pdfStyles.employmentSection}>
          <Text style={pdfStyles.employmentTitle}>Employment history</Text>
          <View style={pdfStyles.employmentBody}>
            {experiences.map((experience) => (
              <View key={experience.id} style={pdfStyles.jobEntry}>
                <View style={pdfStyles.jobHeading}>
                  <Text style={pdfStyles.jobDate}>{experience.dateRange}</Text>
                  <Text style={pdfStyles.jobRole}>
                    {experience.role}
                    {experience.company ? `, ${experience.company}` : ''}
                  </Text>
                  <Text style={pdfStyles.jobLocation}>{experience.location}</Text>
                </View>

                <View style={pdfStyles.bulletList}>
                  {experience.bullets
                    .filter((bullet) => bullet.trim())
                    .map((bullet, index) => (
                      <Text key={`${experience.id}-${index}`} style={pdfStyles.bullet}>
                        {'\u2022'} {bullet}
                      </Text>
                    ))}
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={pdfStyles.section}>
          <Text style={pdfStyles.sectionTitle}>Skills</Text>
          <View style={[pdfStyles.sectionBody, pdfStyles.skillGrid]}>
            {skillRows.map((row, index) => (
              <View key={`skill-row-${index}`} style={pdfStyles.skillRow}>
                <Text style={pdfStyles.skillName}>{row[0] ?? ''}</Text>
                <Text style={pdfStyles.skillName}>{row[1] ?? ''}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={pdfStyles.section}>
          <Text style={pdfStyles.sectionTitle}>Languages</Text>
          <View style={[pdfStyles.sectionBody, pdfStyles.languageGrid]}>
            {languageRows.map((row, index) => (
              <View key={`language-row-${index}`} style={pdfStyles.languageRow}>
                <Text style={pdfStyles.languageCell}>{row[0] ?? ''}</Text>
                <Text style={pdfStyles.languageCell}>{row[1] ?? ''}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={pdfStyles.section}>
          <Text style={pdfStyles.sectionTitle}>Hobbies</Text>
          <View style={pdfStyles.sectionBody}>
            <Text>{hobbies}</Text>
          </View>
        </View>

        <View style={pdfStyles.section}>
          <Text style={pdfStyles.sectionTitle}>Education</Text>
          <View style={[pdfStyles.sectionBody, pdfStyles.columnGap]}>
            {education.map((item) => (
              <View key={item.id} style={pdfStyles.educationRow}>
                <View style={pdfStyles.educationBody}>
                  <Text style={pdfStyles.educationInstitution}>{item.institution}</Text>
                  <Text>{item.degree}</Text>
                </View>
                <Text style={pdfStyles.educationDate}>{item.dateRange}</Text>
              </View>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
}

export function ResumeGeneratorPage() {
  const [fullName, setFullName] = useState('Erick Hernandez');
  const [headline, setHeadline] = useState('Software Developer');
  const [cityCountry, setCityCountry] = useState('Mexico City');
  const [phone, setPhone] = useState('+52 5575251994');
  const [email, setEmail] = useState('yerickk8@gmail.com');

  const [links, setLinks] = useState<LinkItem[]>([
    { id: createId(), label: 'GitHub', url: 'https://github.com/erick-hz' },
    { id: createId(), label: 'Portfolio', url: 'https://erick-hz.vercel.app/' },
  ]);

  const [experiences, setExperiences] = useState<ExperienceItem[]>([
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
  ]);

  const [skills, setSkills] = useState<SkillItem[]>([
    { id: createId(), name: 'React JS', level: 'Expert' },
    { id: createId(), name: 'TypeScript', level: 'Expert' },
    { id: createId(), name: 'Redux', level: 'Expert' },
    { id: createId(), name: 'Node JS', level: 'Expert' },
    { id: createId(), name: 'Git', level: 'Expert' },
    { id: createId(), name: 'HTML & CSS', level: 'Expert' },
  ]);

  const [languages, setLanguages] = useState<string[]>(['English', 'Spanish', 'Japanese']);
  const [hobbies, setHobbies] = useState('Traveling - Fitness - Music - Reading');
  const [experiencePage, setExperiencePage] = useState(0);

  const [education, setEducation] = useState<EducationItem[]>([
    {
      id: createId(),
      dateRange: 'Jan 2017 - Jan 2020',
      institution: 'Universidad Tecnologica de Mexico',
      degree: 'Software and Network Engineering',
    },
  ]);

  const updateLink = (id: string, patch: Partial<LinkItem>) => {
    setLinks((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  };

  const updateExperience = (id: string, patch: Partial<ExperienceItem>) => {
    setExperiences((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  };

  const updateExperienceBullet = (id: string, bulletIndex: number, value: string) => {
    setExperiences((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              bullets: item.bullets.map((bullet, index) =>
                index === bulletIndex ? value : bullet,
              ),
            }
          : item,
      ),
    );
  };

  const updateSkill = (id: string, patch: Partial<SkillItem>) => {
    setSkills((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  };

  const updateEducation = (id: string, patch: Partial<EducationItem>) => {
    setEducation((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  };

  const totalExperiences = experiences.length;
  const activeExperienceIndex = Math.min(experiencePage, Math.max(totalExperiences - 1, 0));
  const activeExperience = experiences[activeExperienceIndex];
  const canGoToPreviousExperience = activeExperienceIndex > 0;
  const canGoToNextExperience = activeExperienceIndex < totalExperiences - 1;

  const goToPreviousExperience = () => {
    setExperiencePage((prev) => Math.max(prev - 1, 0));
  };

  const goToNextExperience = () => {
    setExperiencePage((prev) => Math.min(prev + 1, totalExperiences - 1));
  };

  const resumeDocument = (
    <ResumePdfDocument
      fullName={fullName}
      headline={headline}
      cityCountry={cityCountry}
      phone={phone}
      email={email}
      links={links}
      experiences={experiences}
      skills={skills}
      languages={languages}
      hobbies={hobbies}
      education={education}
    />
  );

  return (
    <section className="section-stack resume-generator-stack">
      <section className="panel resume-form-panel" aria-labelledby="resume-form-title">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Resume Builder</p>
            <h2 id="resume-form-title">Dynamic Fields</h2>
          </div>
        </div>

        <div className="resume-form-grid">
          <label>
            Full name
            <input value={fullName} onChange={(event) => setFullName(event.target.value)} />
          </label>
          <label>
            Headline
            <input value={headline} onChange={(event) => setHeadline(event.target.value)} />
          </label>
          <label>
            City / Country
            <input value={cityCountry} onChange={(event) => setCityCountry(event.target.value)} />
          </label>
          <label>
            Phone
            <input value={phone} onChange={(event) => setPhone(event.target.value)} />
          </label>
          <label className="resume-form-grid-full">
            Email
            <input value={email} onChange={(event) => setEmail(event.target.value)} />
          </label>
        </div>

        <section className="resume-form-section" aria-label="Links">
          <div className="resume-form-section-header">
            <h3>Links</h3>
          </div>

          {links.map((link) => (
            <div key={link.id} className="resume-inline-grid">
              <input
                placeholder="Label"
                value={link.label}
                onChange={(event) => updateLink(link.id, { label: event.target.value })}
              />
              <input
                placeholder="URL"
                value={link.url}
                onChange={(event) => updateLink(link.id, { url: event.target.value })}
              />
            </div>
          ))}
        </section>

        <section className="resume-form-section" aria-label="Employment history">
          <div className="resume-form-section-header">
            <h3>Employment history</h3>
            <div
              className="resume-section-paginator"
              role="group"
              aria-label="Employment history pages"
            >
              <button
                type="button"
                className="route-pill"
                onClick={goToPreviousExperience}
                disabled={!canGoToPreviousExperience}
              >
                Previous
              </button>
              <span className="resume-paginator-status" aria-live="polite">
                {totalExperiences === 0
                  ? '0 / 0'
                  : `${activeExperienceIndex + 1} / ${totalExperiences}`}
              </span>
              <button
                type="button"
                className="route-pill"
                onClick={goToNextExperience}
                disabled={!canGoToNextExperience}
              >
                Next
              </button>
            </div>
          </div>

          {activeExperience ? (
            <article key={activeExperience.id} className="resume-dynamic-card">
              <div className="resume-form-grid">
                <label>
                  Date range
                  <input
                    value={activeExperience.dateRange}
                    onChange={(event) =>
                      updateExperience(activeExperience.id, { dateRange: event.target.value })
                    }
                  />
                </label>
                <label>
                  Role
                  <input
                    value={activeExperience.role}
                    onChange={(event) =>
                      updateExperience(activeExperience.id, { role: event.target.value })
                    }
                  />
                </label>
                <label>
                  Company
                  <input
                    value={activeExperience.company}
                    onChange={(event) =>
                      updateExperience(activeExperience.id, { company: event.target.value })
                    }
                  />
                </label>
                <label>
                  Location
                  <input
                    value={activeExperience.location}
                    onChange={(event) =>
                      updateExperience(activeExperience.id, { location: event.target.value })
                    }
                  />
                </label>
              </div>

              <div className="resume-bullets-editor">
                <p>Bullet points</p>
                {activeExperience.bullets.map((bullet, bulletIndex) => (
                  <div key={`${activeExperience.id}-${bulletIndex}`} className="resume-inline-grid">
                    <input
                      placeholder="Describe your impact"
                      value={bullet}
                      onChange={(event) =>
                        updateExperienceBullet(activeExperience.id, bulletIndex, event.target.value)
                      }
                    />
                  </div>
                ))}
              </div>
            </article>
          ) : (
            <p className="resume-empty-state">No employment entries available.</p>
          )}
        </section>

        <section className="resume-form-section" aria-label="Skills">
          <div className="resume-form-section-header">
            <h3>Skills</h3>
          </div>

          {skills.map((skill) => (
            <div key={skill.id} className="resume-inline-grid">
              <input
                placeholder="Skill"
                value={skill.name}
                onChange={(event) => updateSkill(skill.id, { name: event.target.value })}
              />
            </div>
          ))}
        </section>

        <section className="resume-form-section" aria-label="Languages and hobbies">
          <div className="resume-form-section-header">
            <h3>Languages</h3>
          </div>

          {languages.map((language, index) => (
            <div key={`${language}-${index}`} className="resume-inline-grid">
              <input
                placeholder="Language"
                value={language}
                onChange={(event) =>
                  setLanguages((prev) =>
                    prev.map((item, itemIndex) =>
                      itemIndex === index ? event.target.value : item,
                    ),
                  )
                }
              />
            </div>
          ))}

          <label>
            Hobbies
            <input value={hobbies} onChange={(event) => setHobbies(event.target.value)} />
          </label>
        </section>

        <section className="resume-form-section" aria-label="Education">
          <div className="resume-form-section-header">
            <h3>Education</h3>
          </div>

          {education.map((item) => (
            <article key={item.id} className="resume-dynamic-card">
              <div className="resume-form-grid">
                <label>
                  Date range
                  <input
                    value={item.dateRange}
                    onChange={(event) =>
                      updateEducation(item.id, { dateRange: event.target.value })
                    }
                  />
                </label>
                <label>
                  Institution
                  <input
                    value={item.institution}
                    onChange={(event) =>
                      updateEducation(item.id, { institution: event.target.value })
                    }
                  />
                </label>
                <label className="resume-form-grid-full">
                  Degree
                  <input
                    value={item.degree}
                    onChange={(event) => updateEducation(item.id, { degree: event.target.value })}
                  />
                </label>
              </div>
            </article>
          ))}
        </section>
      </section>

      <section className="panel resume-preview-panel" aria-labelledby="resume-preview-title">
        <BlobProvider document={resumeDocument}>
          {({ url, loading }) => (
            <>
              <div className="panel-header">
                <div>
                  <p className="eyebrow">Preview</p>
                  <h2 id="resume-preview-title">Resume Generator</h2>
                </div>

                {loading || !url ? (
                  <span className="route-cta route-cta-primary">Generating PDF...</span>
                ) : (
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="route-cta route-cta-primary"
                  >
                    Download PDF
                  </a>
                )}
              </div>

              <div className="resume-preview-frame">
                {loading || !url ? (
                  <p className="resume-pdf-loading">Rendering preview...</p>
                ) : (
                  <iframe
                    className="resume-pdf-iframe"
                    title="Resume preview"
                    src={`${url}#toolbar=0&navpanes=0&scrollbar=0&zoom=page-fit`}
                  />
                )}
              </div>
            </>
          )}
        </BlobProvider>
      </section>
    </section>
  );
}
