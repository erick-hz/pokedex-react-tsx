import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { fetchPokemonDetails, fetchPokemonList } from '@features/pokemon/api/pokemonApi';
import { pokemonKeys } from '@features/pokemon/model/queryKeys';
import type { PokemonListResponse } from '@features/pokemon/model/types';
import {
  fetchPokemonBattleIntel,
  fetchPokemonCompanionData,
} from '@features/public-apis/api/publicApisApi';
import { publicApisKeys } from '@features/public-apis/model/queryKeys';

const PREFETCH_POKEMON_LIMIT = 1000;
const PREFETCH_DETAIL_COUNT = 18;

export function AppPrefetch() {
  const queryClient = useQueryClient();
  const { i18n } = useTranslation();
  const language = i18n.resolvedLanguage ?? i18n.language;

  useEffect(() => {
    let cancelled = false;

    const prefetchAll = async () => {
      await queryClient.prefetchQuery({
        queryKey: pokemonKeys.list(language),
        queryFn: () => fetchPokemonList(PREFETCH_POKEMON_LIMIT),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 30,
      });

      if (cancelled) {
        return;
      }

      const pokemonList = queryClient.getQueryData<PokemonListResponse>(pokemonKeys.list(language));
      const names = (pokemonList?.results ?? [])
        .slice(0, PREFETCH_DETAIL_COUNT)
        .map((entry) => entry.name);

      if (names.length === 0) {
        return;
      }

      const tasks = names.flatMap((name) => [
        queryClient.prefetchQuery({
          queryKey: pokemonKeys.detail(name, language),
          queryFn: () => fetchPokemonDetails(name, language),
          staleTime: 1000 * 60 * 5,
          gcTime: 1000 * 60 * 30,
        }),
        queryClient.prefetchQuery({
          queryKey: publicApisKeys.companion(name, language),
          queryFn: () => fetchPokemonCompanionData(name, language),
          staleTime: 1000 * 60 * 30,
          gcTime: 1000 * 60 * 60,
        }),
        queryClient.prefetchQuery({
          queryKey: publicApisKeys.battle(name, language),
          queryFn: () => fetchPokemonBattleIntel(name, language),
          staleTime: 1000 * 60 * 30,
          gcTime: 1000 * 60 * 60,
        }),
      ]);

      await Promise.allSettled(tasks);
    };

    void prefetchAll();

    return () => {
      cancelled = true;
    };
  }, [language, queryClient]);

  return null;
}
