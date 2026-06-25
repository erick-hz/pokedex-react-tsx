import { HomePageView } from '@app/routes/home/HomePageView';
import { useHomePageModel } from '@app/routes/home/useHomePageModel';

export function HomePage() {
  const model = useHomePageModel();

  return <HomePageView {...model} />;
}
