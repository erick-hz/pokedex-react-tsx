import type { ResumeGeneratorModel } from '../useResumeGeneratorModel';
import { useTranslation } from 'react-i18next';
import { DangerRoutePillButton } from '@shared/ui';
import { FIELD_LIMITS } from '../useResumeGeneratorModel';

type ResumeSkillsSectionProps = Pick<
  ResumeGeneratorModel,
  'clearSkills' | 'skills' | 'updateSkill'
>;

export function ResumeSkillsSection({
  clearSkills,
  skills,
  updateSkill,
}: ResumeSkillsSectionProps) {
  const { t } = useTranslation();

  return (
    <section className="resume-form-section" aria-label={t('resumeGenerator.sections.skills')}>
      <div className="resume-form-section-header">
        <h3>{t('resumeGenerator.sections.skills')}</h3>
        <DangerRoutePillButton type="button" onClick={clearSkills}>
          {t('resumeGenerator.actions.removeBlock')}
        </DangerRoutePillButton>
      </div>

      {skills.map((skill) => (
        <div key={skill.id} className="resume-inline-grid">
          <input
            maxLength={FIELD_LIMITS.skillName}
            placeholder={t('resumeGenerator.fields.skillPlaceholder')}
            value={skill.name}
            onChange={(event) => updateSkill(skill.id, { name: event.target.value })}
          />
        </div>
      ))}
    </section>
  );
}
