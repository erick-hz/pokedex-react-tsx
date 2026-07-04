import type { ResumeGeneratorModel } from '../useResumeGeneratorModel';
import { useTranslation } from 'react-i18next';

import { ResumeEducationSection } from './ResumeEducationSection';
import { ResumeExperienceSection } from './ResumeExperienceSection';
import { ResumeIdentitySection } from './ResumeIdentitySection';
import { ResumeLanguagesSection } from './ResumeLanguagesSection';
import { ResumeLinksSection } from './ResumeLinksSection';
import { ResumePdfDocument } from './ResumePdfDocument';
import { ResumePreviewPanel } from './ResumePreviewPanel';
import { ResumeSkillsSection } from './ResumeSkillsSection';

type ResumeGeneratorViewProps = ResumeGeneratorModel;

export function ResumeGeneratorView({
  activeExperience,
  activeExperienceIndex,
  canGoToNextExperience,
  canGoToPreviousExperience,
  cityCountry,
  clearActiveExperience,
  clearSkills,
  education,
  email,
  experiences,
  fullName,
  goToNextExperience,
  goToPreviousExperience,
  headline,
  hobbies,
  languages,
  links,
  phone,
  resetAll,
  setCityCountry,
  setEmail,
  setFullName,
  setHeadline,
  setHobbies,
  setPhone,
  skills,
  totalExperiences,
  updateEducation,
  updateExperience,
  updateExperienceBullet,
  updateLanguage,
  updateLink,
  updateSkill,
}: ResumeGeneratorViewProps) {
  const { t } = useTranslation();

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
            <p className="eyebrow">{t('resumeGenerator.form.eyebrow')}</p>
            <h2 id="resume-form-title">{t('resumeGenerator.form.title')}</h2>
          </div>
          <button
            type="button"
            className="route-pill route-pill-compact route-pill-success"
            onClick={resetAll}
          >
            {t('resumeGenerator.form.resetAll')}
          </button>
        </div>

        <ResumeIdentitySection
          fullName={fullName}
          setFullName={setFullName}
          headline={headline}
          setHeadline={setHeadline}
          cityCountry={cityCountry}
          setCityCountry={setCityCountry}
          phone={phone}
          setPhone={setPhone}
          email={email}
          setEmail={setEmail}
        />

        <ResumeLinksSection links={links} updateLink={updateLink} />

        <ResumeExperienceSection
          activeExperience={activeExperience}
          activeExperienceIndex={activeExperienceIndex}
          canGoToNextExperience={canGoToNextExperience}
          canGoToPreviousExperience={canGoToPreviousExperience}
          clearActiveExperience={clearActiveExperience}
          goToNextExperience={goToNextExperience}
          goToPreviousExperience={goToPreviousExperience}
          totalExperiences={totalExperiences}
          updateExperience={updateExperience}
          updateExperienceBullet={updateExperienceBullet}
        />

        <ResumeSkillsSection clearSkills={clearSkills} skills={skills} updateSkill={updateSkill} />

        <ResumeLanguagesSection
          hobbies={hobbies}
          setHobbies={setHobbies}
          languages={languages}
          updateLanguage={updateLanguage}
        />

        <ResumeEducationSection education={education} updateEducation={updateEducation} />
      </section>

      <section className="panel resume-preview-panel" aria-labelledby="resume-preview-title">
        <ResumePreviewPanel document={resumeDocument} />
      </section>
    </section>
  );
}
