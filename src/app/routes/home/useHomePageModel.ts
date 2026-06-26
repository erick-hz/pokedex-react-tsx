import { useCallback, useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import { usePokemonDetails, usePokemonList } from '@features/pokemon';

type PokemonTcgResponse = {
  data?: Array<{
    id?: string;
    name?: string;
    rarity?: string;
    hp?: string;
    images?: {
      small?: string;
    };
    set?: {
      name?: string;
    };
  }>;
};

type GithubCommitsResponse = Array<{
  sha?: string;
  html_url?: string;
  commit?: {
    message?: string;
    author?: {
      name?: string;
      date?: string;
    };
  };
}>;

export type RouteActivity = {
  pokedex: number;
  intel: number;
  battleLab: number;
  spotlight: number;
};

const ROUTE_ACTIVITY_STORAGE_KEY = 'home-route-activity';
const RECENT_SPOTLIGHT_STORAGE_KEY = 'home-recent-spotlight';
const GALLERY_PAGE_SIZE = 8;

const DEFAULT_ROUTE_ACTIVITY: RouteActivity = {
  pokedex: 0,
  intel: 0,
  battleLab: 0,
  spotlight: 0,
};

function loadRouteActivity(): RouteActivity {
  if (typeof window === 'undefined') {
    return DEFAULT_ROUTE_ACTIVITY;
  }

  const rawValue = window.localStorage.getItem(ROUTE_ACTIVITY_STORAGE_KEY);

  if (!rawValue) {
    return DEFAULT_ROUTE_ACTIVITY;
  }

  try {
    const parsedValue = JSON.parse(rawValue) as Partial<RouteActivity>;

    return {
      pokedex: Number(parsedValue.pokedex ?? 0),
      intel: Number(parsedValue.intel ?? 0),
      battleLab: Number(parsedValue.battleLab ?? 0),
      spotlight: Number(parsedValue.spotlight ?? 0),
    };
  } catch {
    return DEFAULT_ROUTE_ACTIVITY;
  }
}

function loadRecentSpotlight(): string[] {
  if (typeof window === 'undefined') {
    return [];
  }

  const rawValue = window.localStorage.getItem(RECENT_SPOTLIGHT_STORAGE_KEY);

  if (!rawValue) {
    return [];
  }

  try {
    const parsedValue = JSON.parse(rawValue) as string[];

    return Array.isArray(parsedValue)
      ? parsedValue.filter((item) => typeof item === 'string').slice(0, 6)
      : [];
  } catch {
    return [];
  }
}

const getPokemonIdFromUrl = (url: string) => {
  const match = url.match(/\/pokemon\/(\d+)\/?$/);

  if (!match) {
    return null;
  }

  return Number(match[1]);
};

const getPokemonArtworkFromUrl = (url: string) => {
  const pokemonId = getPokemonIdFromUrl(url);

  if (!pokemonId) {
    return '';
  }

  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`;
};

export function useHomePageModel() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate({ from: '/' });
  const pokemonListQuery = usePokemonList();
  const githubRepoQuery = useQuery({
    queryKey: ['github-repo', 'erick-hz/pokedex-react-tsx'],
    queryFn: async (): Promise<Record<string, unknown>> => {
      const response = await fetch('https://api.github.com/repos/erick-hz/pokedex-react-tsx');

      if (!response.ok) {
        throw new Error(`GitHub API request failed: ${response.status}`);
      }

      return response.json() as Promise<Record<string, unknown>>;
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });
  const githubCommitsQuery = useQuery({
    queryKey: ['github-repo-commits', 'erick-hz/pokedex-react-tsx'],
    queryFn: async (): Promise<GithubCommitsResponse> => {
      const response = await fetch(
        'https://api.github.com/repos/erick-hz/pokedex-react-tsx/commits?per_page=2',
      );

      if (!response.ok) {
        throw new Error(`GitHub commits API request failed: ${response.status}`);
      }

      return response.json() as Promise<GithubCommitsResponse>;
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });
  const [featuredPokemon, setFeaturedPokemon] = useState('pikachu');
  const [now, setNow] = useState(() => new Date());
  const [tipIndex, setTipIndex] = useState(0);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [gallerySearchTerm, setRawGallerySearchTerm] = useState('');
  const [galleryPage, setGalleryPage] = useState(1);
  const [routeActivity, setRouteActivity] = useState<RouteActivity>(() => loadRouteActivity());
  const [recentSpotlight, setRecentSpotlight] = useState<string[]>(() => loadRecentSpotlight());

  const tipKeys = useMemo(
    () => ['homeDynamic.tips.0', 'homeDynamic.tips.1', 'homeDynamic.tips.2', 'homeDynamic.tips.3'],
    [],
  );

  const spotlightCandidates = useMemo(
    () => pokemonListQuery.data?.results.slice(0, 20) ?? [],
    [pokemonListQuery.data],
  );

  const quickJumpCandidates = useMemo(
    () => pokemonListQuery.data?.results ?? [],
    [pokemonListQuery.data],
  );

  const galleryItems = useMemo(
    () =>
      quickJumpCandidates.map((pokemon) => ({
        ...pokemon,
        image: getPokemonArtworkFromUrl(pokemon.url),
      })),
    [quickJumpCandidates],
  );

  const normalizedGallerySearch = gallerySearchTerm.trim().toLowerCase();

  const filteredGalleryItems = useMemo(() => {
    if (!normalizedGallerySearch) {
      return galleryItems;
    }

    return galleryItems.filter((pokemon) => {
      const localizedName = pokemon.displayName ?? '';

      return [pokemon.name, localizedName].some((name) =>
        name.toLowerCase().includes(normalizedGallerySearch),
      );
    });
  }, [galleryItems, normalizedGallerySearch]);

  const totalGalleryPages = Math.max(1, Math.ceil(filteredGalleryItems.length / GALLERY_PAGE_SIZE));

  const effectiveGalleryPage = Math.min(galleryPage, totalGalleryPages);

  const paginatedGalleryItems = useMemo(() => {
    const startIndex = (effectiveGalleryPage - 1) * GALLERY_PAGE_SIZE;

    return filteredGalleryItems.slice(startIndex, startIndex + GALLERY_PAGE_SIZE);
  }, [effectiveGalleryPage, filteredGalleryItems]);

  const goToPreviousGalleryPage = useCallback(() => {
    setGalleryPage((current) => Math.max(1, Math.min(current, totalGalleryPages) - 1));
  }, [totalGalleryPages]);

  const goToNextGalleryPage = useCallback(() => {
    setGalleryPage((current) =>
      Math.min(totalGalleryPages, Math.min(current, totalGalleryPages) + 1),
    );
  }, [totalGalleryPages]);

  const setGallerySearchTerm = useCallback((value: string) => {
    setRawGallerySearchTerm(value);
    setGalleryPage(1);
  }, []);

  const effectiveFeaturedPokemon = spotlightCandidates.some(
    (entry) => entry.name === featuredPokemon,
  )
    ? featuredPokemon
    : (spotlightCandidates[0]?.name ?? featuredPokemon);

  const pokemonTcgQuery = useQuery({
    queryKey: ['pokemon-tcg-cards', effectiveFeaturedPokemon],
    queryFn: async (): Promise<PokemonTcgResponse> => {
      const query = new URLSearchParams({
        q: `name:${effectiveFeaturedPokemon}`,
        pageSize: '6',
      });

      const response = await fetch(`https://api.pokemontcg.io/v2/cards?${query.toString()}`);

      if (!response.ok) {
        throw new Error(`Pokemon TCG API request failed: ${response.status}`);
      }

      return response.json() as Promise<PokemonTcgResponse>;
    },
    enabled: Boolean(effectiveFeaturedPokemon),
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
  });

  const pokemonTcgCards = useMemo(
    () =>
      (pokemonTcgQuery.data?.data ?? []).map((card, index) => ({
        id: card.id ?? `${effectiveFeaturedPokemon}-${index}`,
        name: card.name ?? effectiveFeaturedPokemon,
        image: card.images?.small ?? '',
        setName: card.set?.name ?? t('homeDynamic.tcg.unknown'),
        rarity: card.rarity ?? t('homeDynamic.tcg.unknown'),
        hp: card.hp ?? t('homeDynamic.tcg.unknown'),
      })),
    [effectiveFeaturedPokemon, pokemonTcgQuery.data?.data, t],
  );

  const spotlightDetailsQuery = usePokemonDetails(effectiveFeaturedPokemon);

  const selectedSpotlight = useMemo(
    () => spotlightCandidates.find((entry) => entry.name === effectiveFeaturedPokemon),
    [effectiveFeaturedPokemon, spotlightCandidates],
  );

  const recentSpotlightCandidates = useMemo(
    () =>
      recentSpotlight
        .map((name) => spotlightCandidates.find((entry) => entry.name === name))
        .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry)),
    [recentSpotlight, spotlightCandidates],
  );

  const recentSpotlightItems = useMemo(
    () =>
      recentSpotlightCandidates.map((pokemon) => ({
        ...pokemon,
        image: getPokemonArtworkFromUrl(pokemon.url),
      })),
    [recentSpotlightCandidates],
  );

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTipIndex((prev) => (prev + 1) % tipKeys.length);
    }, 5500);

    return () => {
      window.clearInterval(timer);
    };
  }, [tipKeys]);

  useEffect(() => {
    if (spotlightCandidates.length <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setFeaturedPokemon((current) => {
        const alternatives = spotlightCandidates.filter((entry) => entry.name !== current);
        const source = alternatives.length > 0 ? alternatives : spotlightCandidates;
        const randomPick = source[Math.floor(Math.random() * source.length)];

        return randomPick.name;
      });
    }, 12000);

    return () => {
      window.clearInterval(timer);
    };
  }, [spotlightCandidates]);

  const localeCode = i18n.resolvedLanguage ?? i18n.language;
  const localizedClock = useMemo(
    () =>
      new Intl.DateTimeFormat(localeCode, {
        weekday: 'short',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }).format(now),
    [localeCode, now],
  );

  const greetingKey =
    now.getHours() < 12
      ? 'homeDynamic.greetingMorning'
      : now.getHours() < 18
        ? 'homeDynamic.greetingAfternoon'
        : 'homeDynamic.greetingEvening';

  const spotlightImage =
    spotlightDetailsQuery.data?.sprites.other?.['official-artwork']?.front_default ??
    spotlightDetailsQuery.data?.sprites.front_default ??
    '';

  const updateRouteActivity = useCallback((routeKey: keyof RouteActivity) => {
    setRouteActivity((prev) => {
      const next = {
        ...prev,
        [routeKey]: prev[routeKey] + 1,
      };

      window.localStorage.setItem(ROUTE_ACTIVITY_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const pushRecentSpotlight = useCallback((pokemonName: string) => {
    setRecentSpotlight((prev) => {
      const next = [pokemonName, ...prev.filter((item) => item !== pokemonName)].slice(0, 6);
      window.localStorage.setItem(RECENT_SPOTLIGHT_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const goToRoute = useCallback(
    (route: '/pokedex' | '/intel' | '/battle-lab', routeKey: keyof RouteActivity) => {
      updateRouteActivity(routeKey);
      void navigate({ to: route });
    },
    [navigate, updateRouteActivity],
  );

  const randomizeSpotlight = () => {
    if (spotlightCandidates.length === 0) {
      return;
    }

    const alternatives = spotlightCandidates.filter(
      (entry) => entry.name !== effectiveFeaturedPokemon,
    );
    const source = alternatives.length > 0 ? alternatives : spotlightCandidates;
    const randomPick = source[Math.floor(Math.random() * source.length)];

    setFeaturedPokemon(randomPick.name);
  };

  const carouselSlides = useMemo(
    () =>
      pokemonTcgCards.map((card) => ({
        key: card.id,
        title: card.name,
        subtitle: t('homeDynamic.tcg.carousel.subtitle'),
        card,
      })),
    [pokemonTcgCards, t],
  );

  const effectiveCarouselIndex =
    carouselSlides.length > 0 ? carouselIndex % carouselSlides.length : 0;

  const activeSlide = carouselSlides.length > 0 ? carouselSlides[effectiveCarouselIndex] : null;

  useEffect(() => {
    if (carouselSlides.length <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % carouselSlides.length);
    }, 3600);

    return () => {
      window.clearInterval(timer);
    };
  }, [carouselSlides.length]);

  const recommendedRouteKey = useMemo(() => {
    const totalUsage = Object.values(routeActivity).reduce((acc, value) => acc + value, 0);

    if (totalUsage === 0) {
      if (now.getHours() < 12) return 'pokedex';
      if (now.getHours() < 18) return 'intel';
      return 'battleLab';
    }

    const ranking: Array<{ key: 'pokedex' | 'intel' | 'battleLab'; value: number }> = [
      { key: 'pokedex', value: routeActivity.pokedex },
      { key: 'intel', value: routeActivity.intel },
      { key: 'battleLab', value: routeActivity.battleLab },
    ];

    return ranking.sort((a, b) => b.value - a.value)[0].key;
  }, [now, routeActivity]);

  const recommendationText = t(`homeDynamic.recommendation.${recommendedRouteKey}`);

  const githubStats = useMemo(
    () => ({
      stars: Number(githubRepoQuery.data?.stargazers_count ?? 0),
      forks: Number(githubRepoQuery.data?.forks_count ?? 0),
      issues: Number(githubRepoQuery.data?.open_issues_count ?? 0),
      language: String(githubRepoQuery.data?.language ?? t('homeDynamic.github.unknown')),
    }),
    [githubRepoQuery.data, t],
  );

  const githubMetadata = useMemo(
    () => ({
      owner: String(
        githubRepoQuery.data?.owner && typeof githubRepoQuery.data.owner === 'object'
          ? ((githubRepoQuery.data.owner as { login?: string }).login ??
              t('homeDynamic.github.unknown'))
          : t('homeDynamic.github.unknown'),
      ),
      visibility: String(githubRepoQuery.data?.visibility ?? t('homeDynamic.github.unknown')),
      branch: String(githubRepoQuery.data?.default_branch ?? t('homeDynamic.github.unknown')),
      license: String(
        githubRepoQuery.data?.license && typeof githubRepoQuery.data.license === 'object'
          ? ((githubRepoQuery.data.license as { spdx_id?: string; name?: string }).spdx_id ??
              (githubRepoQuery.data.license as { name?: string }).name ??
              t('homeDynamic.github.unknown'))
          : t('homeDynamic.github.none'),
      ),
      sizeKb: Number(githubRepoQuery.data?.size ?? 0),
      watchers: Number(githubRepoQuery.data?.watchers_count ?? 0),
      createdAt: String(githubRepoQuery.data?.created_at ?? ''),
      updatedAt: String(githubRepoQuery.data?.updated_at ?? ''),
      description: String(
        githubRepoQuery.data?.description ?? t('homeDynamic.github.noDescription'),
      ),
      homepage: String(githubRepoQuery.data?.homepage ?? ''),
      topics: Array.isArray(githubRepoQuery.data?.topics)
        ? (githubRepoQuery.data.topics as string[]).slice(0, 6)
        : [],
    }),
    [githubRepoQuery.data, t],
  );

  const githubRecentCommits = useMemo(
    () =>
      (githubCommitsQuery.data ?? []).slice(0, 2).map((commit, index) => {
        const rawMessage = String(commit.commit?.message ?? '').trim();

        return {
          id: String(commit.sha ?? index),
          title: rawMessage.split('\n')[0] || t('homeDynamic.github.commitUnknown'),
          author: String(commit.commit?.author?.name ?? t('homeDynamic.github.unknown')),
          date: String(commit.commit?.author?.date ?? ''),
          url: String(commit.html_url ?? ''),
        };
      }),
    [githubCommitsQuery.data, t],
  );

  const formatRepoDate = useCallback(
    (isoDate: string) => {
      if (!isoDate) {
        return t('homeDynamic.github.unknown');
      }

      const parsedDate = new Date(isoDate);

      if (Number.isNaN(parsedDate.getTime())) {
        return t('homeDynamic.github.unknown');
      }

      return new Intl.DateTimeFormat(localeCode, {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
      }).format(parsedDate);
    },
    [localeCode, t],
  );

  const openCarouselPokemonInfo = useCallback(() => {
    const pokemonName = effectiveFeaturedPokemon;

    updateRouteActivity('spotlight');
    pushRecentSpotlight(pokemonName);
    void navigate({ to: '/pokedex/$pokemonName', params: { pokemonName } });
  }, [effectiveFeaturedPokemon, navigate, pushRecentSpotlight, updateRouteActivity]);

  return {
    t,
    i18n,
    spotlightCandidates,
    galleryItems,
    filteredGalleryItems,
    paginatedGalleryItems,
    gallerySearchTerm,
    galleryPage: effectiveGalleryPage,
    totalGalleryPages,
    hasGallerySearch: Boolean(normalizedGallerySearch),
    selectedSpotlight,
    recentSpotlightItems,
    tipKeys,
    tipIndex,
    routeActivity,
    recommendationText,
    recommendedRouteKey,
    activeSlide,
    carouselSlides,
    carouselIndex: effectiveCarouselIndex,
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
    pokemonTcgCards,
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
  };
}

export type HomePageModel = ReturnType<typeof useHomePageModel>;
