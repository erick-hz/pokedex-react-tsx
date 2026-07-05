import type { ResumeGeneratorModel } from '@app/routes/resume-generator/useResumeGeneratorModel';
import { useTranslation } from 'react-i18next';
import { FIELD_LIMITS } from '@app/routes/resume-generator/useResumeGeneratorModel';

type ResumeLinksSectionProps = Pick<ResumeGeneratorModel, 'links' | 'updateLink'>;

export function ResumeLinksSection({ links, updateLink }: ResumeLinksSectionProps) {
  const { t } = useTranslation();

  return (
    <section className="resume-form-section" aria-label={t('resumeGenerator.sections.links')}>
      <div className="resume-form-section-header">
        <h3>{t('resumeGenerator.sections.links')}</h3>
      </div>

      {links.map((link) => (
        <div key={link.id} className="resume-inline-grid">
          <input
            maxLength={FIELD_LIMITS.linkLabel}
            placeholder={t('resumeGenerator.fields.linkLabelPlaceholder')}
            value={link.label}
            onChange={(event) => updateLink(link.id, { label: event.target.value })}
          />
          <input
            maxLength={FIELD_LIMITS.linkUrl}
            placeholder={t('resumeGenerator.fields.linkUrlPlaceholder')}
            value={link.url}
            onChange={(event) => updateLink(link.id, { url: event.target.value })}
          />
        </div>
      ))}
    </section>
  );
}
