import { ResumeGeneratorView } from '@app/routes/resume-generator/components/ResumeGeneratorView';
import { useResumeGeneratorModel } from '@app/routes/resume-generator/useResumeGeneratorModel';

export function ResumeGeneratorPage() {
  const model = useResumeGeneratorModel();

  return <ResumeGeneratorView {...model} />;
}
