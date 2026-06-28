import { useCallback, useEffect, useMemo, useState } from 'react';
import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import { fetchPokemonDetails } from '@features/pokemon/api/pokemonApi';
import {
  fetchPokemonBattleIntel,
  fetchPokemonCompanionData,
} from '@features/public-apis/api/publicApisApi';
import { publicApisKeys } from '@features/public-apis/model/queryKeys';
import { pokemonKeys } from '@features/pokemon/model/queryKeys';
import { usePokemonDetails, usePokemonList } from '@features/pokemon';
import { requestJson } from '@shared/logging/httpClient';
import { logger } from '@shared/logging/logger';

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
const HOME_ROTATION_MS = 9000;
const LIVE_PULSE_ROTATION_MS = 9000;
const CARD_ROTATION_MS = 9000;
const MAX_TCG_CANDIDATE_CHECKS = 30;

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

const preloadImage = (imageUrl: string) =>
  new Promise<void>((resolve) => {
    if (!imageUrl) {
      resolve();
      return;
    }

    const image = new Image();
    image.onload = () => resolve();
    image.onerror = () => resolve();
    image.src = imageUrl;
  });

export function useHomePageModel() {
  const { t, i18n } = useTranslation();
  const language = i18n.resolvedLanguage ?? i18n.language;
  const navigate = useNavigate({ from: '/' });
  const queryClient = useQueryClient();
  const pokemonListQuery = usePokemonList();
  const githubRepoQuery = useQuery({
    queryKey: ['github-repo', 'erick-hz/pokedex-react-tsx'],
    queryFn: async (): Promise<Record<string, unknown>> => {
      return requestJson<Record<string, unknown>>(
        'https://api.github.com/repos/erick-hz/pokedex-react-tsx',
        undefined,
        'homeGitHubApi',
      );
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });
  const githubCommitsQuery = useQuery({
    queryKey: ['github-repo-commits', 'erick-hz/pokedex-react-tsx'],
    queryFn: async (): Promise<GithubCommitsResponse> => {
      return requestJson<GithubCommitsResponse>(
        'https://api.github.com/repos/erick-hz/pokedex-react-tsx/commits?per_page=2',
        undefined,
        'homeGitHubCommitsApi',
      );
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });
  const [homeFeaturedPokemon, setHomeFeaturedPokemon] = useState('');
  const [livePulsePokemon, setLivePulsePokemon] = useState('');
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

  const quickJumpCandidates = useMemo(
    () => pokemonListQuery.data?.results ?? [],
    [pokemonListQuery.data],
  );

  const spotlightCandidates = useMemo(() => quickJumpCandidates, [quickJumpCandidates]);

  const pickRandomPokemonName = useCallback(
    (excludeNames: string[] = []) => {
      if (quickJumpCandidates.length === 0) {
        return null;
      }

      const excludeNameSet = new Set(excludeNames);
      const candidates = quickJumpCandidates.filter((entry) => !excludeNameSet.has(entry.name));
      const source = candidates.length > 0 ? candidates : quickJumpCandidates;
      const randomPick = source[Math.floor(Math.random() * source.length)];

      return randomPick.name;
    },
    [quickJumpCandidates],
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

  const effectiveHomeFeaturedPokemon = quickJumpCandidates.some(
    (entry) => entry.name === homeFeaturedPokemon,
  )
    ? homeFeaturedPokemon
    : (quickJumpCandidates[0]?.name ?? 'pikachu');

  const fallbackLivePulsePokemon =
    quickJumpCandidates.find((entry) => entry.name !== effectiveHomeFeaturedPokemon)?.name ??
    effectiveHomeFeaturedPokemon;

  const effectiveFeaturedPokemon =
    quickJumpCandidates.some((entry) => entry.name === livePulsePokemon) &&
    livePulsePokemon !== effectiveHomeFeaturedPokemon
      ? livePulsePokemon
      : fallbackLivePulsePokemon;

  const fetchPokemonTcgCards = useCallback(
    async (pokemonName: string): Promise<PokemonTcgResponse> => {
      const query = new URLSearchParams({
        q: `name:${pokemonName}`,
        pageSize: '6',
      });

      return requestJson<PokemonTcgResponse>(
        `https://api.pokemontcg.io/v2/cards?${query.toString()}`,
        undefined,
        'homePokemonTcgApi',
      );
    },
    [],
  );

  const prefetchPokemonTcgCards = useCallback(
    async (pokemonName: string) => {
      if (!pokemonName) {
        return null;
      }

      return queryClient.fetchQuery({
        queryKey: ['pokemon-tcg-cards', pokemonName],
        queryFn: () => fetchPokemonTcgCards(pokemonName),
        staleTime: 1000 * 60 * 10,
        gcTime: 1000 * 60 * 30,
      });
    },
    [fetchPokemonTcgCards, queryClient],
  );

  const prefetchPokemonDetailsWithImage = useCallback(
    async (pokemonName: string) => {
      if (!pokemonName) {
        return;
      }

      const details = await queryClient.fetchQuery({
        queryKey: pokemonKeys.detail(pokemonName, language),
        queryFn: () => fetchPokemonDetails(pokemonName, language),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 30,
      });

      const imageUrl =
        details.sprites.other?.['official-artwork']?.front_default ??
        details.sprites.front_default ??
        '';

      await preloadImage(imageUrl);
    },
    [language, queryClient],
  );

  const prefetchPokemonRouteData = useCallback(
    async (pokemonName: string) => {
      if (!pokemonName) {
        return;
      }

      await Promise.allSettled([
        prefetchPokemonDetailsWithImage(pokemonName),
        queryClient.prefetchQuery({
          queryKey: publicApisKeys.companion(pokemonName, language),
          queryFn: () => fetchPokemonCompanionData(pokemonName, language),
          staleTime: 1000 * 60 * 30,
          gcTime: 1000 * 60 * 60,
        }),
        queryClient.prefetchQuery({
          queryKey: publicApisKeys.battle(pokemonName, language),
          queryFn: () => fetchPokemonBattleIntel(pokemonName, language),
          staleTime: 1000 * 60 * 30,
          gcTime: 1000 * 60 * 60,
        }),
      ]);
    },
    [language, prefetchPokemonDetailsWithImage, queryClient],
  );

  const pickPokemonWithCards = useCallback(
    async (excludeNames: string[] = []) => {
      if (quickJumpCandidates.length === 0) {
        return null;
      }

      const excludedNamesSet = new Set(excludeNames);
      const source = quickJumpCandidates.filter((entry) => !excludedNamesSet.has(entry.name));
      const candidateNames = (source.length > 0 ? source : quickJumpCandidates)
        .map((entry) => entry.name)
        .sort(() => Math.random() - 0.5);
      const maxChecks = Math.min(candidateNames.length, MAX_TCG_CANDIDATE_CHECKS);

      for (let index = 0; index < maxChecks; index += 1) {
        const candidateName = candidateNames[index];

        try {
          const cardsData = await prefetchPokemonTcgCards(candidateName);

          if ((cardsData?.data?.length ?? 0) > 0) {
            return candidateName;
          }
        } catch {
          logger.warn('Failed to fetch cards for candidate during spotlight scan', {
            scope: 'homePokemonTcgApi',
            candidateName,
          });
        }
      }

      return null;
    },
    [prefetchPokemonTcgCards, quickJumpCandidates],
  );

  const pokemonTcgQuery = useQuery({
    queryKey: ['pokemon-tcg-cards', effectiveHomeFeaturedPokemon],
    queryFn: () => fetchPokemonTcgCards(effectiveHomeFeaturedPokemon),
    placeholderData: keepPreviousData,
    enabled: Boolean(effectiveHomeFeaturedPokemon),
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
  });

  const pokemonTcgCards = useMemo(
    () =>
      (pokemonTcgQuery.data?.data ?? []).map((card, index) => ({
        id: card.id ?? `${effectiveHomeFeaturedPokemon}-${index}`,
        name: card.name ?? effectiveHomeFeaturedPokemon,
        image: card.images?.small ?? '',
        setName: card.set?.name ?? t('homeDynamic.tcg.unknown'),
        rarity: card.rarity ?? t('homeDynamic.tcg.unknown'),
        hp: card.hp ?? t('homeDynamic.tcg.unknown'),
      })),
    [effectiveHomeFeaturedPokemon, pokemonTcgQuery.data?.data, t],
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
    if (quickJumpCandidates.length <= 1) {
      return;
    }

    if (pokemonTcgCards.length > 0 || pokemonTcgQuery.isFetching) {
      return;
    }

    let cancelled = false;

    void pickPokemonWithCards([effectiveHomeFeaturedPokemon, effectiveFeaturedPokemon]).then(
      (nextPokemon) => {
        if (!nextPokemon || cancelled) {
          return;
        }

        setHomeFeaturedPokemon(nextPokemon);
        setCarouselIndex(0);
      },
    );

    return () => {
      cancelled = true;
    };
  }, [
    effectiveFeaturedPokemon,
    effectiveHomeFeaturedPokemon,
    pickPokemonWithCards,
    pokemonTcgCards.length,
    pokemonTcgQuery.isFetching,
    quickJumpCandidates.length,
  ]);

  useEffect(() => {
    if (quickJumpCandidates.length <= 1) {
      return;
    }

    let isSelecting = false;

    const timer = window.setInterval(() => {
      if (isSelecting) {
        return;
      }

      isSelecting = true;

      void pickPokemonWithCards([effectiveHomeFeaturedPokemon, effectiveFeaturedPokemon])
        .then((nextPokemon) => {
          if (!nextPokemon) {
            return;
          }

          setHomeFeaturedPokemon(nextPokemon);
          setCarouselIndex(0);
        })
        .finally(() => {
          isSelecting = false;
        });
    }, HOME_ROTATION_MS);

    return () => {
      window.clearInterval(timer);
    };
  }, [
    effectiveFeaturedPokemon,
    effectiveHomeFeaturedPokemon,
    pickPokemonWithCards,
    quickJumpCandidates.length,
  ]);

  useEffect(() => {
    if (quickJumpCandidates.length <= 1) {
      return;
    }

    let isSelecting = false;

    const timer = window.setInterval(() => {
      if (isSelecting) {
        return;
      }

      const nextPokemon = pickRandomPokemonName([
        effectiveFeaturedPokemon,
        effectiveHomeFeaturedPokemon,
      ]);

      if (!nextPokemon) {
        return;
      }

      isSelecting = true;

      void prefetchPokemonDetailsWithImage(nextPokemon)
        .catch(() => undefined)
        .finally(() => {
          setLivePulsePokemon(nextPokemon);
          isSelecting = false;
        });
    }, LIVE_PULSE_ROTATION_MS);

    return () => {
      window.clearInterval(timer);
    };
  }, [
    effectiveFeaturedPokemon,
    effectiveHomeFeaturedPokemon,
    pickRandomPokemonName,
    prefetchPokemonDetailsWithImage,
    quickJumpCandidates.length,
  ]);

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
    if (quickJumpCandidates.length === 0) {
      return;
    }

    const nextPokemon = pickRandomPokemonName([
      effectiveFeaturedPokemon,
      effectiveHomeFeaturedPokemon,
    ]);

    if (!nextPokemon) {
      return;
    }

    void prefetchPokemonDetailsWithImage(nextPokemon)
      .catch(() => undefined)
      .finally(() => {
        setLivePulsePokemon(nextPokemon);
      });
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
    }, CARD_ROTATION_MS);

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

  const resolveCarouselPokemonName = useCallback(
    (cardName?: string) => {
      const normalizedCardName = ` ${(cardName ?? effectiveHomeFeaturedPokemon)
        .toLowerCase()
        .replaceAll('-', ' ')} `;

      const matchedPokemon = quickJumpCandidates
        .map((entry) => entry.name)
        .filter((entryName) => normalizedCardName.includes(` ${entryName.replaceAll('-', ' ')} `))
        .sort((left, right) => right.length - left.length)[0];

      return matchedPokemon ?? effectiveHomeFeaturedPokemon;
    },
    [effectiveHomeFeaturedPokemon, quickJumpCandidates],
  );

  useEffect(() => {
    const pokemonName = resolveCarouselPokemonName(activeSlide?.card.name);

    void prefetchPokemonRouteData(pokemonName);
  }, [activeSlide?.card.name, prefetchPokemonRouteData, resolveCarouselPokemonName]);

  const openCarouselPokemonInfo = useCallback(() => {
    const pokemonName = resolveCarouselPokemonName(activeSlide?.card.name);

    updateRouteActivity('spotlight');
    pushRecentSpotlight(pokemonName);
    void prefetchPokemonRouteData(pokemonName);
    void navigate({ to: '/pokedex/$pokemonName', params: { pokemonName } });
  }, [
    activeSlide?.card.name,
    navigate,
    prefetchPokemonRouteData,
    pushRecentSpotlight,
    resolveCarouselPokemonName,
    updateRouteActivity,
  ]);

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
