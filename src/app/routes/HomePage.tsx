import { HomePageView } from './home/HomePageView'
import { useHomePageModel } from './home/useHomePageModel'

export function HomePage() {
  const model = useHomePageModel()

  return <HomePageView {...model} />
}
