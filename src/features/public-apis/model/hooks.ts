import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import {
  fetchPokemonBattleIntel,
  fetchPokemonCompanionData,
} from '@features/public-apis/api/publicApisApi';

import { publicApisKeys } from '@features/public-apis/model/queryKeys';

export function usePokemonCompanionData(name: string) {
  const { i18n } = useTranslation();
  const language = i18n.resolvedLanguage ?? i18n.language;

  return useQuery({
    queryKey: publicApisKeys.companion(name, language),
    queryFn: () => fetchPokemonCompanionData(name, language),
    enabled: Boolean(name),
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
  });
}

export function usePokemonBattleIntel(name: string) {
  const { i18n } = useTranslation();
  const language = i18n.resolvedLanguage ?? i18n.language;

  return useQuery({
    queryKey: publicApisKeys.battle(name, language),
    queryFn: () => fetchPokemonBattleIntel(name, language),
    enabled: Boolean(name),
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
  });
}
