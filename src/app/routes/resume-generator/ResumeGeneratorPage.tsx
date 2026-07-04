import { ResumeGeneratorView } from './components/ResumeGeneratorView';
import { useResumeGeneratorModel } from './useResumeGeneratorModel';

export function ResumeGeneratorPage() {
  const model = useResumeGeneratorModel();

  return <ResumeGeneratorView {...model} />;
}
