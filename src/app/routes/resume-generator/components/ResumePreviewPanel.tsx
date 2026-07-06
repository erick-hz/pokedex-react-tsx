import type { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { BlobProvider } from '@react-pdf/renderer';
import type { DocumentProps } from '@react-pdf/renderer';
import { PanelHeader } from '@shared/ui';

type ResumePreviewPanelProps = {
  document: ReactElement<DocumentProps>;
};

export function ResumePreviewPanel({ document }: ResumePreviewPanelProps) {
  const { t } = useTranslation();

  return (
    <BlobProvider document={document}>
      {({ url, loading }) => (
        <>
          <PanelHeader
            eyebrow={t('resumeGenerator.form.previewEyebrow')}
            title={t('resumeGenerator.form.previewTitle')}
            titleId="resume-preview-title"
            action={
              loading || !url ? (
                <span className="route-cta route-cta-primary">
                  {t('resumeGenerator.form.generatingPdf')}
                </span>
              ) : (
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="route-cta route-cta-primary"
                >
                  {t('resumeGenerator.form.downloadPdf')}
                </a>
              )
            }
          />

          <div className="resume-preview-frame">
            {loading || !url ? (
              <p className="resume-pdf-loading">{t('resumeGenerator.form.renderingPreview')}</p>
            ) : (
              <iframe
                className="resume-pdf-iframe"
                title={t('resumeGenerator.form.previewFrameTitle')}
                src={`${url}#toolbar=0&navpanes=0&scrollbar=0&zoom=page-fit`}
              />
            )}
          </div>
        </>
      )}
    </BlobProvider>
  );
}
