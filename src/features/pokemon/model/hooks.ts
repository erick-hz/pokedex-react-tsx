import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import {
  fetchPokemonDetails,
  fetchPokemonList,
} from '../api/pokemonApi'

import { pokemonKeys } from './queryKeys'

const POKEMON_LIMIT = 20

export function usePokemonList() {
  const { i18n } = useTranslation()
  const language = i18n.resolvedLanguage ?? i18n.language

  return useQuery({
    queryKey: pokemonKeys.list(language),
    queryFn: () => fetchPokemonList(POKEMON_LIMIT),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  })
}

export function usePokemonDetails(name: string) {
  const { i18n } = useTranslation()
  const language = i18n.resolvedLanguage ?? i18n.language

  return useQuery({
    queryKey: pokemonKeys.detail(name, language),
    queryFn: () => fetchPokemonDetails(name, language),
    enabled: Boolean(name),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  })
}