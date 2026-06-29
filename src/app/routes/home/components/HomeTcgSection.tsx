import type { HomePageModel } from '@app/routes/home/useHomePageModel';
import { CopyBlock, FallbackImage, RouteActionButton, SectionCard } from '@shared/ui';

type HomeTcgSectionProps = Pick<
  HomePageModel,
  | 't'
  | 'recommendationText'
  | 'activeSlide'
  | 'carouselSlides'
  | 'carouselIndex'
  | 'pokemonTcgQuery'
  | 'openCarouselPokemonInfo'
  | 'setCarouselIndex'
>;

function TcgCarouselDots({
  t,
  carouselSlides,
  carouselIndex,
  setCarouselIndex,
}: Pick<HomeTcgSectionProps, 't' | 'carouselSlides' | 'carouselIndex' | 'setCarouselIndex'>) {
  return (
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
  );
}

function TcgCarouselCard({
  t,
  activeSlide,
  openCarouselPokemonInfo,
}: Pick<HomeTcgSectionProps, 't' | 'activeSlide' | 'openCarouselPokemonInfo'>) {
  if (!activeSlide) {
    return null;
  }

  return (
    <article className="route-carousel-card">
      <div className="route-carousel-media">
        {activeSlide.card.image ? (
          <FallbackImage
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
  );
}

export function HomeTcgSection({
  t,
  recommendationText,
  activeSlide,
  carouselSlides,
  carouselIndex,
  pokemonTcgQuery,
  openCarouselPokemonInfo,
  setCarouselIndex,
}: HomeTcgSectionProps) {
  return (
    <SectionCard eyebrow={t('routes.home')} title={t('routeHub.title')}>
      <CopyBlock className="route-home-copy">{t('homeDynamic.shortIntro')}</CopyBlock>

      <p className="route-recommend-chip">{recommendationText}</p>

      {pokemonTcgQuery.isLoading && !activeSlide ? (
        <p className="route-home-copy">{t('homeDynamic.tcg.loading')}</p>
      ) : pokemonTcgQuery.isError && !activeSlide ? (
        <p className="route-home-copy">{t('homeDynamic.tcg.error')}</p>
      ) : activeSlide ? (
        <div
          className="route-carousel"
          role="region"
          aria-label={t('homeDynamic.tcg.carousel.region')}
        >
          <TcgCarouselCard
            t={t}
            activeSlide={activeSlide}
            openCarouselPokemonInfo={openCarouselPokemonInfo}
          />

          <div className="route-carousel-controls">
            <TcgCarouselDots
              t={t}
              carouselSlides={carouselSlides}
              carouselIndex={carouselIndex}
              setCarouselIndex={setCarouselIndex}
            />
          </div>
        </div>
      ) : (
        <p className="route-home-copy">{t('homeDynamic.tcg.empty')}</p>
      )}
    </SectionCard>
  );
}
