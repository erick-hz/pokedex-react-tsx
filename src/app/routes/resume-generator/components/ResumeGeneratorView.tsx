import type { ResumeGeneratorModel } from '@app/routes/resume-generator/useResumeGeneratorModel';
import { useTranslation } from 'react-i18next';

import { ResumeEducationSection } from '@app/routes/resume-generator/components/ResumeEducationSection';
import { ResumeExperienceSection } from '@app/routes/resume-generator/components/ResumeExperienceSection';
import { ResumeIdentitySection } from '@app/routes/resume-generator/components/ResumeIdentitySection';
import { ResumeLanguagesSection } from '@app/routes/resume-generator/components/ResumeLanguagesSection';
import { ResumeLinksSection } from '@app/routes/resume-generator/components/ResumeLinksSection';
import { ResumePdfDocument } from '@app/routes/resume-generator/components/ResumePdfDocument';
import { ResumePreviewPanel } from '@app/routes/resume-generator/components/ResumePreviewPanel';
import { ResumeSkillsSection } from '@app/routes/resume-generator/components/ResumeSkillsSection';
import { RoutePillButton, SectionCard } from '@shared/ui';

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
      <SectionCard
        eyebrow={t('resumeGenerator.form.eyebrow')}
        title={t('resumeGenerator.form.title')}
        className="resume-form-panel"
        action={
          <RoutePillButton
            type="button"
            className="route-pill-compact route-pill-success"
            onClick={resetAll}
          >
            {t('resumeGenerator.form.resetAll')}
          </RoutePillButton>
        }
      >
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
      </SectionCard>

      <section className="panel resume-preview-panel" aria-labelledby="resume-preview-title">
        <ResumePreviewPanel document={resumeDocument} />
      </section>
    </section>
  );
}
