import type {
  ResumeExperience,
  ResumeGeneratorModel,
} from '@app/routes/resume-generator/useResumeGeneratorModel';
import { useTranslation } from 'react-i18next';
import { DangerRoutePillButton, PaginationControls, StatusMessage } from '@shared/ui';
import { FIELD_LIMITS } from '@app/routes/resume-generator/useResumeGeneratorModel';

type ResumeExperienceSectionProps = Pick<
  ResumeGeneratorModel,
  | 'activeExperience'
  | 'activeExperienceIndex'
  | 'canGoToNextExperience'
  | 'canGoToPreviousExperience'
  | 'clearActiveExperience'
  | 'goToNextExperience'
  | 'goToPreviousExperience'
  | 'totalExperiences'
  | 'updateExperience'
  | 'updateExperienceBullet'
>;

function EmploymentCard({
  activeExperience,
  updateExperience,
  updateExperienceBullet,
}: {
  activeExperience: ResumeExperience;
  updateExperience: ResumeGeneratorModel['updateExperience'];
  updateExperienceBullet: ResumeGeneratorModel['updateExperienceBullet'];
}) {
  const { t } = useTranslation();

  return (
    <article key={activeExperience.id} className="resume-dynamic-card">
      <div className="resume-form-grid">
        <label>
          {t('resumeGenerator.fields.dateRange')}
          <input
            maxLength={FIELD_LIMITS.experienceDateRange}
            value={activeExperience.dateRange}
            onChange={(event) =>
              updateExperience(activeExperience.id, { dateRange: event.target.value })
            }
          />
        </label>
        <label>
          {t('resumeGenerator.fields.role')}
          <input
            maxLength={FIELD_LIMITS.experienceRole}
            value={activeExperience.role}
            onChange={(event) =>
              updateExperience(activeExperience.id, { role: event.target.value })
            }
          />
        </label>
        <label>
          {t('resumeGenerator.fields.company')}
          <input
            maxLength={FIELD_LIMITS.experienceCompany}
            value={activeExperience.company}
            onChange={(event) =>
              updateExperience(activeExperience.id, { company: event.target.value })
            }
          />
        </label>
        <label>
          {t('resumeGenerator.fields.location')}
          <input
            maxLength={FIELD_LIMITS.experienceLocation}
            value={activeExperience.location}
            onChange={(event) =>
              updateExperience(activeExperience.id, { location: event.target.value })
            }
          />
        </label>
      </div>

      <div className="resume-bullets-editor">
        <p>{t('resumeGenerator.fields.bulletPoints')}</p>
        {activeExperience.bullets.map((bullet, bulletIndex) => (
          <div key={`${activeExperience.id}-${bulletIndex}`} className="resume-inline-grid">
            <input
              maxLength={FIELD_LIMITS.experienceBullet}
              placeholder={t('resumeGenerator.fields.bulletPlaceholder')}
              value={bullet}
              onChange={(event) =>
                updateExperienceBullet(activeExperience.id, bulletIndex, event.target.value)
              }
            />
          </div>
        ))}
      </div>
    </article>
  );
}

export function ResumeExperienceSection({
  activeExperience,
  activeExperienceIndex,
  canGoToNextExperience,
  canGoToPreviousExperience,
  clearActiveExperience,
  goToNextExperience,
  goToPreviousExperience,
  totalExperiences,
  updateExperience,
  updateExperienceBullet,
}: ResumeExperienceSectionProps) {
  const { t } = useTranslation();

  return (
    <section
      className="resume-form-section"
      aria-label={t('resumeGenerator.sections.employmentHistory')}
    >
      <div className="resume-form-section-header">
        <h3>{t('resumeGenerator.sections.employmentHistory')}</h3>
        <DangerRoutePillButton type="button" onClick={clearActiveExperience}>
          {t('resumeGenerator.actions.removeBlock')}
        </DangerRoutePillButton>
      </div>

      {activeExperience ? (
        <EmploymentCard
          activeExperience={activeExperience}
          updateExperience={updateExperience}
          updateExperienceBullet={updateExperienceBullet}
        />
      ) : (
        <StatusMessage className="resume-empty-state">
          {t('resumeGenerator.states.noEmploymentEntries')}
        </StatusMessage>
      )}

      <PaginationControls
        ariaLabel={t('resumeGenerator.sections.employmentHistoryPages')}
        className="resume-section-paginator"
        previousButtonClassName="route-pill"
        nextButtonClassName="route-pill"
        statusClassName="resume-paginator-status"
        statusAs="span"
        previousLabel={t('resumeGenerator.actions.previous')}
        nextLabel={t('resumeGenerator.actions.next')}
        onPrevious={goToPreviousExperience}
        onNext={goToNextExperience}
        isPreviousDisabled={!canGoToPreviousExperience}
        isNextDisabled={!canGoToNextExperience}
        status={
          totalExperiences === 0 ? '0 / 0' : `${activeExperienceIndex + 1} / ${totalExperiences}`
        }
      />
    </section>
  );
}
