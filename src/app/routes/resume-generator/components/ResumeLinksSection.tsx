import type { ResumeGeneratorModel } from '@app/routes/resume-generator/useResumeGeneratorModel';
import { useTranslation } from 'react-i18next';
import { ResumeFormSection } from '@shared/ui';
import { FIELD_LIMITS } from '@app/routes/resume-generator/useResumeGeneratorModel';

type ResumeLinksSectionProps = Pick<ResumeGeneratorModel, 'links' | 'updateLink'>;

export function ResumeLinksSection({ links, updateLink }: ResumeLinksSectionProps) {
  const { t } = useTranslation();

  return (
    <ResumeFormSection title={t('resumeGenerator.sections.links')}>
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
    </ResumeFormSection>
  );
}
