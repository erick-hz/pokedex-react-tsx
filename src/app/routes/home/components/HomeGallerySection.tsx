import type { HomePageModel } from '@app/routes/home/useHomePageModel';
import {
  CopyBlock,
  PaginationControls,
  PokemonPreviewLink,
  SectionCard,
  StatusMessage,
} from '@shared/ui';

type HomeGallerySectionProps = Pick<
  HomePageModel,
  | 't'
  | 'gallerySearchTerm'
  | 'filteredGalleryItems'
  | 'paginatedGalleryItems'
  | 'hasGallerySearch'
  | 'galleryPage'
  | 'totalGalleryPages'
  | 'goToPreviousGalleryPage'
  | 'goToNextGalleryPage'
  | 'setGallerySearchTerm'
  | 'updateRouteActivity'
  | 'pushRecentSpotlight'
>;

function GallerySearchBar({
  t,
  gallerySearchTerm,
  hasGallerySearch,
  setGallerySearchTerm,
  paginatedGalleryItems,
  filteredGalleryItems,
}: Pick<
  HomeGallerySectionProps,
  | 't'
  | 'gallerySearchTerm'
  | 'hasGallerySearch'
  | 'setGallerySearchTerm'
  | 'paginatedGalleryItems'
  | 'filteredGalleryItems'
>) {
  return (
    <div className="route-search-row">
      <label htmlFor="home-gallery-search" className="route-search-label">
        {t('homeDynamic.search.label')}
      </label>

      <div className="route-search-control">
        <input
          id="home-gallery-search"
          type="search"
          className="route-search-input"
          value={gallerySearchTerm}
          onChange={(event) => setGallerySearchTerm(event.currentTarget.value)}
          placeholder={t('homeDynamic.search.placeholder')}
          aria-label={t('homeDynamic.search.label')}
        />

        {hasGallerySearch ? (
          <button
            type="button"
            className="route-search-clear"
            onClick={() => setGallerySearchTerm('')}
          >
            {t('homeDynamic.search.clear')}
          </button>
        ) : null}
      </div>

      <p className="route-search-count">
        {t('homeDynamic.search.results', {
          count: paginatedGalleryItems.length,
          total: filteredGalleryItems.length,
        })}
      </p>
    </div>
  );
}

function GalleryGrid({
  t,
  paginatedGalleryItems,
  updateRouteActivity,
  pushRecentSpotlight,
}: Pick<
  HomeGallerySectionProps,
  't' | 'paginatedGalleryItems' | 'updateRouteActivity' | 'pushRecentSpotlight'
>) {
  return (
    <div className="route-photo-grid">
      {paginatedGalleryItems.map((pokemon) => (
        <PokemonPreviewLink
          key={pokemon.name}
          to="/pokedex/$pokemonName"
          params={{ pokemonName: pokemon.name }}
          className="route-photo-card"
          name={pokemon.displayName ?? pokemon.name}
          image={pokemon.image}
          placeholder={t('noImage')}
          imageClassName="route-photo-card__image"
          placeholderClassName="route-photo-card__placeholder"
          labelClassName="route-photo-card__label"
          onClick={() => {
            updateRouteActivity('spotlight');
            pushRecentSpotlight(pokemon.name);
          }}
        />
      ))}
    </div>
  );
}

function GalleryPager({
  t,
  galleryPage,
  totalGalleryPages,
  goToPreviousGalleryPage,
  goToNextGalleryPage,
}: Pick<
  HomeGallerySectionProps,
  't' | 'galleryPage' | 'totalGalleryPages' | 'goToPreviousGalleryPage' | 'goToNextGalleryPage'
>) {
  if (totalGalleryPages <= 1) {
    return null;
  }

  return (
    <PaginationControls
      ariaLabel={t('homeDynamic.search.paginationLabel')}
      className="route-gallery-pager"
      previousButtonClassName="route-search-clear"
      nextButtonClassName="route-search-clear"
      statusClassName="route-gallery-page-text"
      previousLabel={t('homeDynamic.search.prev')}
      nextLabel={t('homeDynamic.search.next')}
      onPrevious={goToPreviousGalleryPage}
      onNext={goToNextGalleryPage}
      isPreviousDisabled={galleryPage === 1}
      isNextDisabled={galleryPage === totalGalleryPages}
      status={t('homeDynamic.search.page', { current: galleryPage, total: totalGalleryPages })}
    />
  );
}

export function HomeGallerySection({
  t,
  gallerySearchTerm,
  filteredGalleryItems,
  paginatedGalleryItems,
  hasGallerySearch,
  galleryPage,
  totalGalleryPages,
  goToPreviousGalleryPage,
  goToNextGalleryPage,
  setGallerySearchTerm,
  updateRouteActivity,
  pushRecentSpotlight,
}: HomeGallerySectionProps) {
  return (
    <SectionCard eyebrow={t('routeHub.spotlight')} title={t('routeHub.quickJump')}>
      <CopyBlock className="route-home-copy">{t('homeDynamic.gallerySubtitle')}</CopyBlock>

      <GallerySearchBar
        t={t}
        gallerySearchTerm={gallerySearchTerm}
        hasGallerySearch={hasGallerySearch}
        setGallerySearchTerm={setGallerySearchTerm}
        paginatedGalleryItems={paginatedGalleryItems}
        filteredGalleryItems={filteredGalleryItems}
      />

      <GalleryGrid
        t={t}
        paginatedGalleryItems={paginatedGalleryItems}
        updateRouteActivity={updateRouteActivity}
        pushRecentSpotlight={pushRecentSpotlight}
      />

      {filteredGalleryItems.length === 0 ? (
        <StatusMessage className="route-search-empty">
          {t('homeDynamic.search.empty', { query: gallerySearchTerm.trim() })}
        </StatusMessage>
      ) : null}

      <GalleryPager
        t={t}
        galleryPage={galleryPage}
        totalGalleryPages={totalGalleryPages}
        goToPreviousGalleryPage={goToPreviousGalleryPage}
        goToNextGalleryPage={goToNextGalleryPage}
      />
    </SectionCard>
  );
}
