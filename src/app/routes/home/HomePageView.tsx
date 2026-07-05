import type { HomePageModel } from '@app/routes/home/useHomePageModel';

import { HomeGithubSection } from '@app/routes/home/components/HomeGithubSection';
import { HomeGallerySection } from '@app/routes/home/components/HomeGallerySection';
import { HomeMissionSection } from '@app/routes/home/components/HomeMissionSection';
import { HomeSpotlightSection } from '@app/routes/home/components/HomeSpotlightSection';
import { HomeTcgSection } from '@app/routes/home/components/HomeTcgSection';

type HomePageViewProps = HomePageModel;

export function HomePageView({
  t,
  i18n,
  spotlightCandidates,
  filteredGalleryItems,
  paginatedGalleryItems,
  gallerySearchTerm,
  galleryPage,
  totalGalleryPages,
  hasGallerySearch,
  selectedSpotlight,
  recentSpotlightItems,
  tipKeys,
  tipIndex,
  recommendationText,
  recommendedRouteKey,
  activeSlide,
  carouselSlides,
  carouselIndex,
  localizedClock,
  greetingKey,
  spotlightImage,
  effectiveFeaturedPokemon,
  githubRepoQuery,
  githubCommitsQuery,
  githubStats,
  githubMetadata,
  githubRecentCommits,
  pokemonTcgQuery,
  formatRepoDate,
  updateRouteActivity,
  pushRecentSpotlight,
  goToRoute,
  randomizeSpotlight,
  openCarouselPokemonInfo,
  goToPreviousGalleryPage,
  goToNextGalleryPage,
  setGallerySearchTerm,
  setCarouselIndex,
}: HomePageViewProps) {
  return (
    <section className="section-stack route-home-grid">
      <HomeTcgSection
        t={t}
        recommendationText={recommendationText}
        activeSlide={activeSlide}
        carouselSlides={carouselSlides}
        carouselIndex={carouselIndex}
        pokemonTcgQuery={pokemonTcgQuery}
        openCarouselPokemonInfo={openCarouselPokemonInfo}
        setCarouselIndex={setCarouselIndex}
      />

      <HomeGallerySection
        t={t}
        gallerySearchTerm={gallerySearchTerm}
        filteredGalleryItems={filteredGalleryItems}
        paginatedGalleryItems={paginatedGalleryItems}
        hasGallerySearch={hasGallerySearch}
        galleryPage={galleryPage}
        totalGalleryPages={totalGalleryPages}
        goToPreviousGalleryPage={goToPreviousGalleryPage}
        goToNextGalleryPage={goToNextGalleryPage}
        setGallerySearchTerm={setGallerySearchTerm}
        updateRouteActivity={updateRouteActivity}
        pushRecentSpotlight={pushRecentSpotlight}
      />

      <HomeSpotlightSection
        t={t}
        i18n={i18n}
        spotlightCandidates={spotlightCandidates}
        selectedSpotlight={selectedSpotlight}
        effectiveFeaturedPokemon={effectiveFeaturedPokemon}
        localizedClock={localizedClock}
        greetingKey={greetingKey}
        spotlightImage={spotlightImage}
        randomizeSpotlight={randomizeSpotlight}
        updateRouteActivity={updateRouteActivity}
        pushRecentSpotlight={pushRecentSpotlight}
      />

      <section className="route-bottom-grid">
        <HomeMissionSection
          t={t}
          tipKeys={tipKeys}
          tipIndex={tipIndex}
          recentSpotlightItems={recentSpotlightItems}
          recommendedRouteKey={recommendedRouteKey}
          goToRoute={goToRoute}
          updateRouteActivity={updateRouteActivity}
        />

        <HomeGithubSection
          t={t}
          githubRepoQuery={githubRepoQuery}
          githubCommitsQuery={githubCommitsQuery}
          githubStats={githubStats}
          githubMetadata={githubMetadata}
          githubRecentCommits={githubRecentCommits}
          formatRepoDate={formatRepoDate}
        />
      </section>
    </section>
  );
}
