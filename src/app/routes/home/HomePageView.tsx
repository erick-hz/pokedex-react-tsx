import {
  CopyBlock,
  PokemonPreviewLink,
  RouteActionButton,
  RouteActionLink,
  SectionCard,
  StatCard,
} from '@shared/ui';

import type { HomePageModel } from '@app/routes/home/useHomePageModel';

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
      <SectionCard eyebrow={t('routes.home')} title={t('routeHub.title')}>
        <CopyBlock className="route-home-copy">{t('homeDynamic.shortIntro')}</CopyBlock>

        <p className="route-recommend-chip">{recommendationText}</p>

        {pokemonTcgQuery.isLoading ? (
          <p className="route-home-copy">{t('homeDynamic.tcg.loading')}</p>
        ) : pokemonTcgQuery.isError ? (
          <p className="route-home-copy">{t('homeDynamic.tcg.error')}</p>
        ) : activeSlide ? (
          <div
            className="route-carousel"
            role="region"
            aria-label={t('homeDynamic.tcg.carousel.region')}
          >
            <article className="route-carousel-card">
              <div className="route-carousel-media">
                {activeSlide.card.image ? (
                  <img
                    src={activeSlide.card.image}
                    alt={activeSlide.title}
                    className="route-carousel-image"
                    loading="lazy"
                  />
                ) : (
                  <div className="route-carousel-placeholder">{t('noImage')}</div>
                )}
              </div>

              <div className="route-carousel-body">
                <strong>{activeSlide.title}</strong>
                <p>{activeSlide.subtitle}</p>
                <em>
                  {t('homeDynamic.tcg.carousel.meta', {
                    set: activeSlide.card.setName,
                    rarity: activeSlide.card.rarity,
                    hp: activeSlide.card.hp,
                  })}
                </em>

                <RouteActionButton type="button" tone="primary" onClick={openCarouselPokemonInfo}>
                  {t('homeDynamic.tcg.carousel.open')}
                </RouteActionButton>
              </div>
            </article>

            <div className="route-carousel-controls">
              <div
                className="route-carousel-dots"
                role="tablist"
                aria-label={t('homeDynamic.tcg.carousel.pagination')}
              >
                {carouselSlides.map((slide, index) => (
                  <button
                    key={slide.key}
                    type="button"
                    role="tab"
                    aria-selected={carouselIndex === index}
                    aria-label={t('homeDynamic.tcg.carousel.slide', {
                      current: index + 1,
                      total: carouselSlides.length,
                    })}
                    className={['route-carousel-dot', carouselIndex === index ? 'active' : '']
                      .filter(Boolean)
                      .join(' ')}
                    onClick={() => setCarouselIndex(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <p className="route-home-copy">{t('homeDynamic.tcg.empty')}</p>
        )}
      </SectionCard>

      <SectionCard eyebrow={t('routeHub.spotlight')} title={t('routeHub.quickJump')}>
        <CopyBlock className="route-home-copy">{t('homeDynamic.gallerySubtitle')}</CopyBlock>

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

        {filteredGalleryItems.length > 0 ? (
          <div className="route-gallery-pager" aria-label={t('homeDynamic.search.paginationLabel')}>
            <button
              type="button"
              className="route-search-clear"
              onClick={goToPreviousGalleryPage}
              disabled={galleryPage === 1}
            >
              {t('homeDynamic.search.prev')}
            </button>

            <p className="route-gallery-page-text">
              {t('homeDynamic.search.page', { current: galleryPage, total: totalGalleryPages })}
            </p>

            <button
              type="button"
              className="route-search-clear"
              onClick={goToNextGalleryPage}
              disabled={galleryPage === totalGalleryPages}
            >
              {t('homeDynamic.search.next')}
            </button>
          </div>
        ) : null}

        {filteredGalleryItems.length === 0 ? (
          <p className="route-search-empty">
            {t('homeDynamic.search.empty', { query: gallerySearchTerm.trim() })}
          </p>
        ) : null}
      </SectionCard>

      <SectionCard
        eyebrow={t('homeDynamic.eyebrow')}
        title={t('homeDynamic.title', {
          name: selectedSpotlight?.displayName ?? effectiveFeaturedPokemon,
        })}
        className="route-home-live"
      >
        <div className="route-live-header">
          <p className="route-live-greeting">{t(greetingKey)}</p>
          <span className="route-live-clock">{localizedClock}</span>
        </div>

        <div className="route-live-grid">
          <article className="route-live-media">
            {spotlightImage ? (
              <img
                src={spotlightImage}
                alt={selectedSpotlight?.displayName ?? effectiveFeaturedPokemon}
                className="route-live-image"
                loading="lazy"
              />
            ) : (
              <div className="route-live-placeholder">{t('noImage')}</div>
            )}
          </article>

          <div className="route-live-content">
            <CopyBlock className="route-home-copy">{t('homeDynamic.subtitle')}</CopyBlock>

            <div className="route-home-actions">
              <RouteActionButton type="button" tone="primary" onClick={randomizeSpotlight}>
                {t('homeDynamic.randomize')}
              </RouteActionButton>

              <RouteActionLink
                to="/pokedex/$pokemonName"
                params={{ pokemonName: effectiveFeaturedPokemon }}
                className="route-cta-muted"
                onClick={() => {
                  updateRouteActivity('spotlight');
                  pushRecentSpotlight(effectiveFeaturedPokemon);
                }}
              >
                {t('homeDynamic.openSpotlight')}
              </RouteActionLink>
            </div>

            <div className="route-metric-row">
              <StatCard
                label={t('homeDynamic.metrics.loaded')}
                value={spotlightCandidates.length}
                className="route-metric-card"
              />
              <StatCard
                label={t('homeDynamic.metrics.language')}
                value={t(
                  i18n.language.startsWith('es')
                    ? 'spanish'
                    : i18n.language.startsWith('ja')
                      ? 'japanese'
                      : 'english',
                )}
                className="route-metric-card"
              />
              <StatCard
                label={t('homeDynamic.metrics.routes')}
                value="4"
                className="route-metric-card"
              />
            </div>
          </div>
        </div>
      </SectionCard>

      <section className="route-bottom-grid">
        <SectionCard
          eyebrow={t('homeDynamic.missionEyebrow')}
          title={t('homeDynamic.missionTitle')}
        >
          <div className="route-tip-card">
            <CopyBlock>{t(tipKeys[tipIndex])}</CopyBlock>
          </div>

          <div className="route-mission-grid">
            <article>
              <p className="route-mission-label">{t('homeDynamic.recentTitle')}</p>
              <div className="route-recent-grid">
                {recentSpotlightItems.length > 0 ? (
                  recentSpotlightItems.map((pokemon) => (
                    <PokemonPreviewLink
                      key={pokemon.name}
                      to="/pokedex/$pokemonName"
                      params={{ pokemonName: pokemon.name }}
                      className="route-recent-card"
                      name={pokemon.displayName ?? pokemon.name}
                      image={pokemon.image}
                      placeholder={t('noImage')}
                      imageClassName="route-recent-card__image"
                      labelClassName="route-recent-card__label"
                      placeholderClassName="route-recent-card__placeholder"
                      onClick={() => updateRouteActivity('spotlight')}
                    />
                  ))
                ) : (
                  <span className="route-mission-empty">{t('homeDynamic.recentEmpty')}</span>
                )}
              </div>
            </article>

            <article>
              <p className="route-mission-label">{t('homeDynamic.nextMove')}</p>
              <RouteActionButton
                type="button"
                tone="primary"
                onClick={() => {
                  if (recommendedRouteKey === 'pokedex') {
                    goToRoute('/pokedex', 'pokedex');
                    return;
                  }

                  if (recommendedRouteKey === 'intel') {
                    goToRoute('/intel', 'intel');
                    return;
                  }

                  goToRoute('/battle-lab', 'battleLab');
                }}
              >
                {t('homeDynamic.followRecommendation')}
              </RouteActionButton>
            </article>
          </div>
        </SectionCard>

        <SectionCard
          eyebrow={t('homeDynamic.github.eyebrow')}
          title={t('homeDynamic.github.title')}
          className="github-panel-card"
        >
          <div className="github-panel-head">
            <img
              src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
              alt="GitHub"
              className="github-logo"
              loading="lazy"
            />

            <div className="github-panel-meta">
              <strong>{String(githubRepoQuery.data?.full_name ?? 'pokedex-react-tsx')}</strong>
              <a
                href={String(
                  githubRepoQuery.data?.html_url ?? 'https://github.com/erick-hz/pokedex-react-tsx',
                )}
                target="_blank"
                rel="noreferrer"
                className="route-cta route-cta-muted"
              >
                {t('homeDynamic.github.openRepo')}
              </a>
            </div>
          </div>

          <div className="github-stat-grid">
            <article className="github-stat-card">
              <span>{t('homeDynamic.github.stars')}</span>
              <strong>{githubStats.stars}</strong>
            </article>
            <article className="github-stat-card">
              <span>{t('homeDynamic.github.forks')}</span>
              <strong>{githubStats.forks}</strong>
            </article>
            <article className="github-stat-card">
              <span>{t('homeDynamic.github.issues')}</span>
              <strong>{githubStats.issues}</strong>
            </article>
            <article className="github-stat-card">
              <span>{t('homeDynamic.github.language')}</span>
              <strong>{githubStats.language}</strong>
            </article>
          </div>

          <CopyBlock className="github-description">{githubMetadata.description}</CopyBlock>

          <div className="github-meta-grid">
            <article className="github-meta-item">
              <span>{t('homeDynamic.github.owner')}</span>
              <strong>{githubMetadata.owner}</strong>
            </article>
            <article className="github-meta-item">
              <span>{t('homeDynamic.github.visibility')}</span>
              <strong>{githubMetadata.visibility}</strong>
            </article>
            <article className="github-meta-item">
              <span>{t('homeDynamic.github.branch')}</span>
              <strong>{githubMetadata.branch}</strong>
            </article>
            <article className="github-meta-item">
              <span>{t('homeDynamic.github.licenseLabel')}</span>
              <strong>{githubMetadata.license}</strong>
            </article>
            <article className="github-meta-item">
              <span>{t('homeDynamic.github.watchers')}</span>
              <strong>{githubMetadata.watchers}</strong>
            </article>
            <article className="github-meta-item">
              <span>{t('homeDynamic.github.size')}</span>
              <strong>{githubMetadata.sizeKb} KB</strong>
            </article>
            <article className="github-meta-item">
              <span>{t('homeDynamic.github.created')}</span>
              <strong>{formatRepoDate(githubMetadata.createdAt)}</strong>
            </article>
            <article className="github-meta-item">
              <span>{t('homeDynamic.github.updated')}</span>
              <strong>{formatRepoDate(githubMetadata.updatedAt)}</strong>
            </article>
          </div>

          {githubMetadata.topics.length > 0 && (
            <div className="github-topic-list" aria-label={t('homeDynamic.github.topics')}>
              {githubMetadata.topics.map((topic) => (
                <span key={topic} className="github-topic-chip">
                  #{topic}
                </span>
              ))}
            </div>
          )}

          <div className="github-commit-section">
            <p className="route-mission-label">{t('homeDynamic.github.recentCommits')}</p>

            <div className="github-commit-list">
              {githubRecentCommits.map((commit) => (
                <article key={commit.id} className="github-commit-item">
                  {commit.url ? (
                    <a
                      href={commit.url}
                      target="_blank"
                      rel="noreferrer"
                      className="github-commit-link"
                    >
                      {commit.title}
                    </a>
                  ) : (
                    <strong className="github-commit-title">{commit.title}</strong>
                  )}

                  <span className="github-commit-meta">
                    {t('homeDynamic.github.commitBy', {
                      author: commit.author,
                      date: formatRepoDate(commit.date),
                    })}
                  </span>
                </article>
              ))}

              {!githubCommitsQuery.isLoading &&
              !githubCommitsQuery.isError &&
              githubRecentCommits.length === 0 ? (
                <p className="route-home-copy">{t('homeDynamic.github.noCommits')}</p>
              ) : null}
            </div>
          </div>

          {githubRepoQuery.isLoading ? (
            <p className="route-home-copy">{t('homeDynamic.github.loading')}</p>
          ) : githubRepoQuery.isError ? (
            <p className="route-home-copy">{t('homeDynamic.github.error')}</p>
          ) : null}

          {githubCommitsQuery.isLoading ? (
            <p className="route-home-copy">{t('homeDynamic.github.loadingCommits')}</p>
          ) : githubCommitsQuery.isError ? (
            <p className="route-home-copy">{t('homeDynamic.github.errorCommits')}</p>
          ) : null}
        </SectionCard>
      </section>
    </section>
  );
}
