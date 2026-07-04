import type { ResumeGeneratorModel } from '../useResumeGeneratorModel';
import { useTranslation } from 'react-i18next';
import { FIELD_LIMITS } from '../useResumeGeneratorModel';

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
    <section
      className="resume-form-section"
      aria-label={t('resumeGenerator.sections.languagesAndHobbies')}
    >
      <div className="resume-form-section-header">
        <h3>{t('resumeGenerator.sections.languages')}</h3>
      </div>

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
    </section>
  );
}
