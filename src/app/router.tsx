/* eslint-disable react-refresh/only-export-components */

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { createRootRoute, createRoute, createRouter, Link, Outlet, useNavigate, useParams, useSearch } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

import { LanguageSwitcher } from '@features/language-switcher'
import { PokemonDetail, PokemonList, usePokemonDetails, usePokemonList } from '@features/pokemon'
import { PublicApisDashboard } from '@features/public-apis'
import { ThemeToggle } from '@features/theme-toggle'
import { SectionCard } from '@shared/ui'

type PokemonSearch = {
  pokemon?: string
}

type BattleLabSearch = {
  pokemon?: string
  rival?: string
}

type RouteActivity = {
  pokedex: number
  intel: number
  battleLab: number
  spotlight: number
}

const ROUTE_ACTIVITY_STORAGE_KEY = 'home-route-activity'
const RECENT_SPOTLIGHT_STORAGE_KEY = 'home-recent-spotlight'

const DEFAULT_ROUTE_ACTIVITY: RouteActivity = {
  pokedex: 0,
  intel: 0,
  battleLab: 0,
  spotlight: 0,
}

function loadRouteActivity(): RouteActivity {
  if (typeof window === 'undefined') {
    return DEFAULT_ROUTE_ACTIVITY
  }

  const rawValue = window.localStorage.getItem(ROUTE_ACTIVITY_STORAGE_KEY)

  if (!rawValue) {
    return DEFAULT_ROUTE_ACTIVITY
  }

  try {
    const parsedValue = JSON.parse(rawValue) as Partial<RouteActivity>

    return {
      pokedex: Number(parsedValue.pokedex ?? 0),
      intel: Number(parsedValue.intel ?? 0),
      battleLab: Number(parsedValue.battleLab ?? 0),
      spotlight: Number(parsedValue.spotlight ?? 0),
    }
  } catch {
    return DEFAULT_ROUTE_ACTIVITY
  }
}

function loadRecentSpotlight(): string[] {
  if (typeof window === 'undefined') {
    return []
  }

  const rawValue = window.localStorage.getItem(RECENT_SPOTLIGHT_STORAGE_KEY)

  if (!rawValue) {
    return []
  }

  try {
    const parsedValue = JSON.parse(rawValue) as string[]

    return Array.isArray(parsedValue)
      ? parsedValue.filter((item) => typeof item === 'string').slice(0, 6)
      : []
  } catch {
    return []
  }
}

const sanitizePokemonName = (value: unknown) => {
  if (typeof value !== 'string') {
    return undefined
  }

  const cleanValue = value.trim().toLowerCase()

  return cleanValue.length > 0 ? cleanValue : undefined
}

const getPokemonIdFromUrl = (url: string) => {
  const match = url.match(/\/pokemon\/(\d+)\/?$/)

  if (!match) {
    return null
  }

  return Number(match[1])
}

const getPokemonArtworkFromUrl = (url: string) => {
  const pokemonId = getPokemonIdFromUrl(url)

  if (!pokemonId) {
    return ''
  }

  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`
}

const pokemonSearchValidator = (search: Record<string, unknown>): PokemonSearch => ({
  pokemon: sanitizePokemonName(search.pokemon),
})

const battleLabSearchValidator = (search: Record<string, unknown>): BattleLabSearch => ({
  pokemon: sanitizePokemonName(search.pokemon),
  rival: sanitizePokemonName(search.rival),
})

const rootRoute = createRootRoute({
  component: RootLayout,
  notFoundComponent: NotFoundPage,
})

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
})

const pokedexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/pokedex',
  validateSearch: pokemonSearchValidator,
  component: PokedexPage,
})

const pokemonSpotlightRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/pokedex/$pokemonName',
  component: PokemonSpotlightPage,
})

const intelRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/intel',
  validateSearch: pokemonSearchValidator,
  component: PokemonIntelPage,
})

const battleLabRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/battle-lab',
  validateSearch: battleLabSearchValidator,
  component: BattleLabPage,
})

const routeTree = rootRoute.addChildren([
  homeRoute,
  pokedexRoute,
  pokemonSpotlightRoute,
  intelRoute,
  battleLabRoute,
])

export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

function RootLayout() {
  const { t } = useTranslation()
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window === 'undefined') {
      return false
    }

    const savedTheme = window.localStorage.getItem('theme')

    if (savedTheme === 'dark' || savedTheme === 'light') {
      return savedTheme === 'dark'
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light')
    window.localStorage.setItem('theme', isDarkMode ? 'dark' : 'light')
  }, [isDarkMode])

  return (
    <main className="pokedex-shell">
      <header className="gateway-header gateway-header--router">
        <div className="header-brand-block">
          <p className="eyebrow">{t('pokedex')}</p>
          <h1>{t('appTitle')}</h1>
        </div>

        <nav className="route-nav" aria-label={t('routes.navigation')}>
          <Link to="/" className="route-nav-link" activeProps={{ className: 'route-nav-link active' }}>
            {t('routes.home')}
          </Link>
          <Link to="/pokedex" className="route-nav-link" activeProps={{ className: 'route-nav-link active' }}>
            {t('routes.pokedex')}
          </Link>
          <Link to="/intel" className="route-nav-link" activeProps={{ className: 'route-nav-link active' }}>
            {t('routes.intel')}
          </Link>
          <Link to="/battle-lab" className="route-nav-link" activeProps={{ className: 'route-nav-link active' }}>
            {t('routes.battleLab')}
          </Link>
        </nav>

        <div className="header-actions">
          <LanguageSwitcher />
          <ThemeToggle isDarkMode={isDarkMode} onToggle={() => setIsDarkMode((prev) => !prev)} />
        </div>
      </header>

      <Outlet />
    </main>
  )
}

function HomePage() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate({ from: '/' })
  const pokemonListQuery = usePokemonList()
  const githubRepoQuery = useQuery({
    queryKey: ['github-repo', 'erick-hz/pokedex-react-tsx'],
    queryFn: async (): Promise<Record<string, unknown>> => {
      const response = await fetch('https://api.github.com/repos/erick-hz/pokedex-react-tsx')

      if (!response.ok) {
        throw new Error(`GitHub API request failed: ${response.status}`)
      }

      return response.json() as Promise<Record<string, unknown>>
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  })
  const [featuredPokemon, setFeaturedPokemon] = useState('pikachu')
  const [now, setNow] = useState(() => new Date())
  const [tipIndex, setTipIndex] = useState(0)
  const [carouselIndex, setCarouselIndex] = useState(0)
  const [carouselPhotoOffset, setCarouselPhotoOffset] = useState(0)
  const [routeActivity, setRouteActivity] = useState<RouteActivity>(() => loadRouteActivity())
  const [recentSpotlight, setRecentSpotlight] = useState<string[]>(() => loadRecentSpotlight())

  const tipKeys = useMemo(
    () => [
      'homeDynamic.tips.0',
      'homeDynamic.tips.1',
      'homeDynamic.tips.2',
      'homeDynamic.tips.3',
    ],
    [],
  )

  const spotlightCandidates = useMemo(
    () => pokemonListQuery.data?.results.slice(0, 20) ?? [],
    [pokemonListQuery.data],
  )

  const quickJumpCandidates = useMemo(
    () => pokemonListQuery.data?.results.slice(0, 8) ?? [],
    [pokemonListQuery.data],
  )

  const galleryItems = useMemo(
    () => quickJumpCandidates.map((pokemon) => ({
      ...pokemon,
      image: getPokemonArtworkFromUrl(pokemon.url),
    })),
    [quickJumpCandidates],
  )

  const effectiveFeaturedPokemon =
    spotlightCandidates.some((entry) => entry.name === featuredPokemon)
      ? featuredPokemon
      : spotlightCandidates[0]?.name ?? featuredPokemon

  const spotlightDetailsQuery = usePokemonDetails(effectiveFeaturedPokemon)

  const selectedSpotlight = useMemo(
    () => spotlightCandidates.find((entry) => entry.name === effectiveFeaturedPokemon),
    [effectiveFeaturedPokemon, spotlightCandidates],
  )

  const recentSpotlightCandidates = useMemo(
    () => recentSpotlight
      .map((name) => spotlightCandidates.find((entry) => entry.name === name))
      .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry)),
    [recentSpotlight, spotlightCandidates],
  )

  const recentSpotlightItems = useMemo(
    () => recentSpotlightCandidates.map((pokemon) => ({
      ...pokemon,
      image: getPokemonArtworkFromUrl(pokemon.url),
    })),
    [recentSpotlightCandidates],
  )

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date())
    }, 1000)

    return () => {
      window.clearInterval(timer)
    }
  }, [])

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTipIndex((prev) => (prev + 1) % tipKeys.length)
    }, 5500)

    return () => {
      window.clearInterval(timer)
    }
  }, [tipKeys])

  useEffect(() => {
    if (spotlightCandidates.length <= 1) {
      return
    }

    const timer = window.setInterval(() => {
      setFeaturedPokemon((current) => {
        const alternatives = spotlightCandidates.filter((entry) => entry.name !== current)
        const source = alternatives.length > 0 ? alternatives : spotlightCandidates
        const randomPick = source[Math.floor(Math.random() * source.length)]

        return randomPick.name
      })
    }, 12000)

    return () => {
      window.clearInterval(timer)
    }
  }, [spotlightCandidates])

  const localeCode = i18n.resolvedLanguage ?? i18n.language
  const localizedClock = useMemo(
    () =>
      new Intl.DateTimeFormat(localeCode, {
        weekday: 'short',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }).format(now),
    [localeCode, now],
  )

  const greetingKey =
    now.getHours() < 12
      ? 'homeDynamic.greetingMorning'
      : now.getHours() < 18
        ? 'homeDynamic.greetingAfternoon'
        : 'homeDynamic.greetingEvening'

  const spotlightImage =
    spotlightDetailsQuery.data?.sprites.other?.['official-artwork']?.front_default ??
    spotlightDetailsQuery.data?.sprites.front_default ??
    ''

  const updateRouteActivity = useCallback((routeKey: keyof RouteActivity) => {
    setRouteActivity((prev) => {
      const next = {
        ...prev,
        [routeKey]: prev[routeKey] + 1,
      }

      window.localStorage.setItem(ROUTE_ACTIVITY_STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const pushRecentSpotlight = useCallback((pokemonName: string) => {
    setRecentSpotlight((prev) => {
      const next = [pokemonName, ...prev.filter((item) => item !== pokemonName)].slice(0, 6)
      window.localStorage.setItem(RECENT_SPOTLIGHT_STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const goToRoute = useCallback(
    (route: '/pokedex' | '/intel' | '/battle-lab', routeKey: keyof RouteActivity) => {
      updateRouteActivity(routeKey)
      void navigate({ to: route })
    },
    [navigate, updateRouteActivity],
  )

  const randomizeSpotlight = () => {
    if (spotlightCandidates.length === 0) {
      return
    }

    const alternatives = spotlightCandidates.filter((entry) => entry.name !== effectiveFeaturedPokemon)
    const source = alternatives.length > 0 ? alternatives : spotlightCandidates
    const randomPick = source[Math.floor(Math.random() * source.length)]

    setFeaturedPokemon(randomPick.name)
  }

  const routeConfig = useMemo(
    () => [
      {
        key: 'pokedex' as const,
        title: t('routeHub.openPokedex'),
        subtitle: t('homeDynamic.routeCards.pokedex'),
        action: () => goToRoute('/pokedex', 'pokedex'),
      },
      {
        key: 'intel' as const,
        title: t('routeHub.openIntel'),
        subtitle: t('homeDynamic.routeCards.intel'),
        action: () => goToRoute('/intel', 'intel'),
      },
      {
        key: 'battleLab' as const,
        title: t('routeHub.openLab'),
        subtitle: t('homeDynamic.routeCards.battleLab'),
        action: () => goToRoute('/battle-lab', 'battleLab'),
      },
    ],
    [goToRoute, t],
  )

  const carouselSlides = useMemo(
    () => routeConfig.map((route, index) => ({
      ...route,
      pokemon:
        galleryItems.length > 0
          ? galleryItems[(index + carouselPhotoOffset) % galleryItems.length]
          : null,
    })),
    [carouselPhotoOffset, galleryItems, routeConfig],
  )

  const activeSlide = carouselSlides[carouselIndex % Math.max(carouselSlides.length, 1)]

  useEffect(() => {
    if (carouselSlides.length <= 1) {
      return
    }

    const timer = window.setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % carouselSlides.length)
      setCarouselPhotoOffset((prev) => {
        if (galleryItems.length <= 1) {
          return prev
        }

        return (prev + 1) % galleryItems.length
      })
    }, 3600)

    return () => {
      window.clearInterval(timer)
    }
  }, [carouselSlides.length, galleryItems.length])

  const recommendedRouteKey = useMemo(() => {
    const totalUsage = Object.values(routeActivity).reduce((acc, value) => acc + value, 0)

    if (totalUsage === 0) {
      if (now.getHours() < 12) return 'pokedex'
      if (now.getHours() < 18) return 'intel'
      return 'battleLab'
    }

    const ranking: Array<{ key: 'pokedex' | 'intel' | 'battleLab', value: number }> = [
      { key: 'pokedex', value: routeActivity.pokedex },
      { key: 'intel', value: routeActivity.intel },
      { key: 'battleLab', value: routeActivity.battleLab },
    ]

    return ranking.sort((a, b) => b.value - a.value)[0].key
  }, [now, routeActivity])

  const recommendationText = t(`homeDynamic.recommendation.${recommendedRouteKey}`)

  const githubStats = useMemo(() => ({
    stars: Number(githubRepoQuery.data?.stargazers_count ?? 0),
    forks: Number(githubRepoQuery.data?.forks_count ?? 0),
    issues: Number(githubRepoQuery.data?.open_issues_count ?? 0),
    language: String(githubRepoQuery.data?.language ?? t('homeDynamic.github.unknown')),
  }), [githubRepoQuery.data, t])

  const githubMetadata = useMemo(() => ({
    owner: String(githubRepoQuery.data?.owner && typeof githubRepoQuery.data.owner === 'object' ? (githubRepoQuery.data.owner as { login?: string }).login ?? t('homeDynamic.github.unknown') : t('homeDynamic.github.unknown')),
    visibility: String(githubRepoQuery.data?.visibility ?? t('homeDynamic.github.unknown')),
    branch: String(githubRepoQuery.data?.default_branch ?? t('homeDynamic.github.unknown')),
    license: String(
      githubRepoQuery.data?.license && typeof githubRepoQuery.data.license === 'object'
        ? (githubRepoQuery.data.license as { spdx_id?: string; name?: string }).spdx_id ??
            (githubRepoQuery.data.license as { name?: string }).name ??
            t('homeDynamic.github.unknown')
        : t('homeDynamic.github.none'),
    ),
    sizeKb: Number(githubRepoQuery.data?.size ?? 0),
    watchers: Number(githubRepoQuery.data?.watchers_count ?? 0),
    createdAt: String(githubRepoQuery.data?.created_at ?? ''),
    updatedAt: String(githubRepoQuery.data?.updated_at ?? ''),
    description: String(githubRepoQuery.data?.description ?? t('homeDynamic.github.noDescription')),
    homepage: String(githubRepoQuery.data?.homepage ?? ''),
    topics:
      Array.isArray(githubRepoQuery.data?.topics)
        ? (githubRepoQuery.data.topics as string[]).slice(0, 6)
        : [],
  }), [githubRepoQuery.data, t])

  const formatRepoDate = useCallback(
    (isoDate: string) => {
      if (!isoDate) {
        return t('homeDynamic.github.unknown')
      }

      const parsedDate = new Date(isoDate)

      if (Number.isNaN(parsedDate.getTime())) {
        return t('homeDynamic.github.unknown')
      }

      return new Intl.DateTimeFormat(localeCode, {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
      }).format(parsedDate)
    },
    [localeCode, t],
  )

  const openCarouselPokemonInfo = useCallback(() => {
    const pokemonName = activeSlide?.pokemon?.name ?? effectiveFeaturedPokemon

    updateRouteActivity('spotlight')
    pushRecentSpotlight(pokemonName)
    void navigate({ to: '/pokedex/$pokemonName', params: { pokemonName } })
  }, [activeSlide?.pokemon?.name, effectiveFeaturedPokemon, navigate, pushRecentSpotlight, updateRouteActivity])

  return (
    <section className="section-stack route-home-grid">
      <SectionCard eyebrow={t('routes.home')} title={t('routeHub.title')}>
        <p className="route-home-copy">
          {t('homeDynamic.shortIntro')}
        </p>

        <p className="route-recommend-chip">
          {recommendationText}
        </p>

        {activeSlide ? (
          <div className="route-carousel" role="region" aria-label={t('homeDynamic.carousel.region')}>
            <article className="route-carousel-card">
              <div className="route-carousel-media">
                {activeSlide.pokemon?.image ? (
                  <img
                    src={activeSlide.pokemon.image}
                    alt={activeSlide.pokemon.displayName ?? activeSlide.pokemon.name}
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
                <em>{t('homeDynamic.launches', { count: routeActivity[activeSlide.key] })}</em>

                <button
                  type="button"
                  className="route-cta route-cta-primary"
                  onClick={openCarouselPokemonInfo}
                >
                  {t('homeDynamic.carousel.open')}
                </button>
              </div>
            </article>

            <div className="route-carousel-controls">
              <div className="route-carousel-dots" role="tablist" aria-label={t('homeDynamic.carousel.pagination')}>
                {carouselSlides.map((slide, index) => (
                  <button
                    key={slide.key}
                    type="button"
                    role="tab"
                    aria-selected={carouselIndex === index}
                    aria-label={t('homeDynamic.carousel.slide', { current: index + 1, total: carouselSlides.length })}
                    className={['route-carousel-dot', carouselIndex === index ? 'active' : ''].filter(Boolean).join(' ')}
                    onClick={() => setCarouselIndex(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </SectionCard>

      <SectionCard eyebrow={t('routeHub.spotlight')} title={t('routeHub.quickJump')}>
        <p className="route-home-copy">{t('homeDynamic.gallerySubtitle')}</p>
        <div className="route-photo-grid">
          {galleryItems.map((pokemon) => (
            <Link
              key={pokemon.name}
              to="/pokedex/$pokemonName"
              params={{ pokemonName: pokemon.name }}
              className="route-photo-card"
              onClick={() => {
                updateRouteActivity('spotlight')
                pushRecentSpotlight(pokemon.name)
              }}
            >
              {pokemon.image ? (
                <img
                  src={pokemon.image}
                  alt={pokemon.displayName ?? pokemon.name}
                  className="route-photo-card__image"
                  loading="lazy"
                />
              ) : (
                <div className="route-photo-card__placeholder">{t('noImage')}</div>
              )}
              <span className="route-photo-card__label">{pokemon.displayName ?? pokemon.name}</span>
            </Link>
          ))}
        </div>
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
            <p className="route-home-copy">
              {t('homeDynamic.subtitle')}
            </p>

            <div className="route-home-actions">
              <button
                type="button"
                className="route-cta route-cta-primary"
                onClick={randomizeSpotlight}
              >
                {t('homeDynamic.randomize')}
              </button>

              <Link
                to="/pokedex/$pokemonName"
                params={{ pokemonName: effectiveFeaturedPokemon }}
                className="route-cta route-cta-muted"
                onClick={() => {
                  updateRouteActivity('spotlight')
                  pushRecentSpotlight(effectiveFeaturedPokemon)
                }}
              >
                {t('homeDynamic.openSpotlight')}
              </Link>
            </div>

            <div className="route-metric-row">
              <div className="route-metric-card">
                <span>{t('homeDynamic.metrics.loaded')}</span>
                <strong>{spotlightCandidates.length}</strong>
              </div>
              <div className="route-metric-card">
                <span>{t('homeDynamic.metrics.language')}</span>
                <strong>{t(i18n.language.startsWith('es') ? 'spanish' : i18n.language.startsWith('ja') ? 'japanese' : 'english')}</strong>
              </div>
              <div className="route-metric-card">
                <span>{t('homeDynamic.metrics.routes')}</span>
                <strong>4</strong>
              </div>
            </div>
          </div>
        </div>
      </SectionCard>

      <section className="route-bottom-grid">
        <SectionCard eyebrow={t('homeDynamic.missionEyebrow')} title={t('homeDynamic.missionTitle')}>
          <div className="route-tip-card">
            <p>{t(tipKeys[tipIndex])}</p>
          </div>

          <div className="route-mission-grid">
            <article>
              <p className="route-mission-label">{t('homeDynamic.recentTitle')}</p>
              <div className="route-recent-grid">
                {recentSpotlightItems.length > 0 ? recentSpotlightItems.map((pokemon) => (
                  <Link
                    key={pokemon.name}
                    to="/pokedex/$pokemonName"
                    params={{ pokemonName: pokemon.name }}
                    className="route-recent-card"
                    onClick={() => updateRouteActivity('spotlight')}
                  >
                    {pokemon.image ? (
                      <img
                        src={pokemon.image}
                        alt={pokemon.displayName ?? pokemon.name}
                        className="route-recent-card__image"
                        loading="lazy"
                      />
                    ) : null}
                    <span>{pokemon.displayName ?? pokemon.name}</span>
                  </Link>
                )) : <span className="route-mission-empty">{t('homeDynamic.recentEmpty')}</span>}
              </div>
            </article>

            <article>
              <p className="route-mission-label">{t('homeDynamic.nextMove')}</p>
              <button
                type="button"
                className="route-cta route-cta-primary"
                onClick={() => {
                  if (recommendedRouteKey === 'pokedex') {
                    goToRoute('/pokedex', 'pokedex')
                    return
                  }

                  if (recommendedRouteKey === 'intel') {
                    goToRoute('/intel', 'intel')
                    return
                  }

                  goToRoute('/battle-lab', 'battleLab')
                }}
              >
                {t('homeDynamic.followRecommendation')}
              </button>
            </article>
          </div>
        </SectionCard>

        <SectionCard eyebrow={t('homeDynamic.github.eyebrow')} title={t('homeDynamic.github.title')} className="github-panel-card">
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
                href={String(githubRepoQuery.data?.html_url ?? 'https://github.com/erick-hz/pokedex-react-tsx')}
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

          <p className="github-description">{githubMetadata.description}</p>

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
                <span key={topic} className="github-topic-chip">#{topic}</span>
              ))}
            </div>
          )}

          {githubRepoQuery.isLoading ? (
            <p className="route-home-copy">{t('homeDynamic.github.loading')}</p>
          ) : githubRepoQuery.isError ? (
            <p className="route-home-copy">{t('homeDynamic.github.error')}</p>
          ) : null}
        </SectionCard>
      </section>
    </section>
  )
}

function PokedexPage() {
  const { t } = useTranslation()
  const navigate = useNavigate({ from: '/pokedex' })
  const search = useSearch({ from: '/pokedex' })

  const selectedPokemon = search.pokemon ?? 'pikachu'

  return (
    <>
      <section className="pokedex-grid section-stack">
        <PokemonList
          selectedPokemon={selectedPokemon}
          onSelectPokemon={(pokemonName) =>
            void navigate({
              search: (prev) => ({ ...prev, pokemon: pokemonName }),
              replace: true,
            })
          }
        />

        <PokemonDetail selectedPokemon={selectedPokemon} />
      </section>

      <section className="section-stack route-inline-actions">
        <Link
          to="/pokedex/$pokemonName"
          params={{ pokemonName: selectedPokemon }}
          className="route-cta route-cta-primary"
        >
          {t('routes.actions.openSpotlight')}
        </Link>
        <Link to="/battle-lab" search={{ pokemon: selectedPokemon }} className="route-cta route-cta-muted">
          {t('routes.actions.openBattleLab')}
        </Link>
      </section>
    </>
  )
}

function PokemonSpotlightPage() {
  const { t } = useTranslation()
  const { pokemonName } = useParams({ from: '/pokedex/$pokemonName' })

  return (
    <section className="section-stack route-spotlight-stack">
      <div className="route-inline-actions">
        <Link to="/pokedex" search={{ pokemon: pokemonName }} className="route-cta route-cta-muted">
          {t('routes.actions.backToList')}
        </Link>
        <Link to="/intel" search={{ pokemon: pokemonName }} className="route-cta route-cta-muted">
          {t('routes.actions.openIntel')}
        </Link>
      </div>

      <PokemonDetail selectedPokemon={pokemonName} />
      <PublicApisDashboard selectedPokemon={pokemonName} />
    </section>
  )
}

function PokemonIntelPage() {
  const navigate = useNavigate({ from: '/intel' })
  const search = useSearch({ from: '/intel' })

  const selectedPokemon = search.pokemon ?? 'eevee'

  return (
    <section className="section-stack route-intel-grid">
      <PokemonList
        selectedPokemon={selectedPokemon}
        onSelectPokemon={(pokemonName) =>
          void navigate({
            search: (prev) => ({ ...prev, pokemon: pokemonName }),
            replace: true,
          })
        }
      />

      <PublicApisDashboard selectedPokemon={selectedPokemon} />
    </section>
  )
}

function BattleLabPage() {
  const { t } = useTranslation()
  const navigate = useNavigate({ from: '/battle-lab' })
  const search = useSearch({ from: '/battle-lab' })
  const rivalListQuery = usePokemonList()

  const selectedPokemon = search.pokemon ?? 'pikachu'
  const rivalPokemon = search.rival ?? 'charizard'

  const rivalCandidates = useMemo(() => rivalListQuery.data?.results.slice(0, 8) ?? [], [rivalListQuery.data])

  return (
    <section className="section-stack route-battle-stack">
      <SectionCard eyebrow={t('routes.battleLab')} title={t('battleLab.title')}>
        <div className="route-inline-actions">
          <Link to="/pokedex" search={{ pokemon: selectedPokemon }} className="route-cta route-cta-muted">
            {t('battleLab.editChallenger')}
          </Link>

          {rivalCandidates.map((rival) => (
            <button
              key={rival.name}
              type="button"
              className={['route-pill', rivalPokemon === rival.name ? 'active' : ''].filter(Boolean).join(' ')}
              onClick={() =>
                void navigate({
                  search: (prev) => ({ ...prev, rival: rival.name }),
                  replace: true,
                })
              }
            >
              {rival.displayName ?? rival.name}
            </button>
          ))}
        </div>
      </SectionCard>

      <section className="route-battle-grid">
        <PokemonList
          selectedPokemon={selectedPokemon}
          onSelectPokemon={(pokemonName) =>
            void navigate({
              search: (prev) => ({ ...prev, pokemon: pokemonName }),
              replace: true,
            })
          }
        />

        <div className="route-battle-duel">
          <PokemonDetail selectedPokemon={selectedPokemon} />
          <PokemonDetail selectedPokemon={rivalPokemon} />
        </div>
      </section>
    </section>
  )
}

function NotFoundPage() {
  const { t } = useTranslation()

  return (
    <section className="section-stack">
      <SectionCard eyebrow="404" title={t('routes.notFound.title')}>
        <p className="route-home-copy">{t('routes.notFound.description')}</p>
        <div className="route-home-actions">
          <Link to="/" className="route-cta route-cta-primary">
            {t('routes.notFound.backHome')}
          </Link>
          <Link to="/pokedex" className="route-cta route-cta-muted">
            {t('routes.notFound.openPokedex')}
          </Link>
        </div>
      </SectionCard>
    </section>
  )
}
