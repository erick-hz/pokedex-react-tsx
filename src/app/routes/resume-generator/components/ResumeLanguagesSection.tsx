import type { ResumeGeneratorModel } from '@app/routes/resume-generator/useResumeGeneratorModel';
import { useTranslation } from 'react-i18next';
import { ResumeFormSection } from '@shared/ui';
import { FIELD_LIMITS } from '@app/routes/resume-generator/useResumeGeneratorModel';

type ResumeLanguagesSectionProps = Pick<
  ResumeGeneratorModel,
  'hobbies' | 'setHobbies' | 'languages' | 'updateLanguage'
>;

export function ResumeLanguagesSection({
  hobbies,
  setHobbies,
  languages,
  updateLanguage,
}: ResumeLanguagesSectionProps) {
  const { t } = useTranslation();

  return (
    <ResumeFormSection title={t('resumeGenerator.sections.languages')}>
      {languages.map((language, index) => (
        <div key={`${language}-${index}`} className="resume-inline-grid">
          <input
            maxLength={FIELD_LIMITS.language}
            placeholder={t('resumeGenerator.fields.languagePlaceholder')}
            value={language}
            onChange={(event) => updateLanguage(index, event.target.value)}
          />
        </div>
      ))}

      <label>
        {t('resumeGenerator.sections.hobbies')}
        <input
          maxLength={FIELD_LIMITS.hobbies}
          value={hobbies}
          onChange={(event) => setHobbies(event.target.value)}
        />
      </label>
    </ResumeFormSection>
  );
}
