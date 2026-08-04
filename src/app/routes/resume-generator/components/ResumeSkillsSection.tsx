import type { ResumeGeneratorModel } from '@app/routes/resume-generator/useResumeGeneratorModel';
import { useTranslation } from 'react-i18next';
import { DangerRoutePillButton, ResumeFormSection } from '@shared/ui';
import { FIELD_LIMITS } from '@app/routes/resume-generator/useResumeGeneratorModel';

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
    <ResumeFormSection
      title={t('resumeGenerator.sections.skills')}
      action={
        <DangerRoutePillButton type="button" onClick={clearSkills}>
          {t('resumeGenerator.actions.removeBlock')}
        </DangerRoutePillButton>
      }
    >
      <div className="resume-skills-grid">
        {skills.map((skill) => (
          <div key={skill.id} className="resume-skills-item">
            <input
              maxLength={FIELD_LIMITS.skillName}
              placeholder={t('resumeGenerator.fields.skillPlaceholder')}
              value={skill.name}
              onChange={(event) => updateSkill(skill.id, { name: event.target.value })}
            />
          </div>
        ))}
      </div>
    </ResumeFormSection>
  );
}
