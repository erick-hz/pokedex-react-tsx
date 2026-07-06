import type { ResumeGeneratorModel } from '@app/routes/resume-generator/useResumeGeneratorModel';
import { useTranslation } from 'react-i18next';
import { ResumeFormSection } from '@shared/ui';
import { FIELD_LIMITS } from '@app/routes/resume-generator/useResumeGeneratorModel';

type ResumeEducationSectionProps = Pick<ResumeGeneratorModel, 'education' | 'updateEducation'>;

export function ResumeEducationSection({
  education,
  updateEducation,
}: ResumeEducationSectionProps) {
  const { t } = useTranslation();

  return (
    <ResumeFormSection title={t('resumeGenerator.sections.education')}>
      {education.map((item) => (
        <article key={item.id} className="resume-dynamic-card">
          <div className="resume-form-grid">
            <label>
              {t('resumeGenerator.fields.dateRange')}
              <input
                maxLength={FIELD_LIMITS.educationDateRange}
                value={item.dateRange}
                onChange={(event) => updateEducation(item.id, { dateRange: event.target.value })}
              />
            </label>
            <label>
              {t('resumeGenerator.fields.institution')}
              <input
                maxLength={FIELD_LIMITS.educationInstitution}
                value={item.institution}
                onChange={(event) => updateEducation(item.id, { institution: event.target.value })}
              />
            </label>
            <label className="resume-form-grid-full">
              {t('resumeGenerator.fields.degree')}
              <input
                maxLength={FIELD_LIMITS.educationDegree}
                value={item.degree}
                onChange={(event) => updateEducation(item.id, { degree: event.target.value })}
              />
            </label>
          </div>
        </article>
      ))}
    </ResumeFormSection>
  );
}
