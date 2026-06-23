import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import {
  fetchPokemonDetails,
  fetchPokemonListWithNames,
} from '../api/pokemonApi'

import { pokemonKeys } from './queryKeys'

const POKEMON_LIMIT = 20

export function usePokemonList() {
  const { i18n } = useTranslation()

  return useQuery({
    queryKey: pokemonKeys.list(i18n.language),
    queryFn: () =>
      fetchPokemonListWithNames(POKEMON_LIMIT, i18n.language),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  })
}

export function usePokemonDetails(name: string) {
  const { i18n } = useTranslation()

  return useQuery({
    queryKey: pokemonKeys.detail(name, i18n.language),
    queryFn: () => fetchPokemonDetails(name, i18n.language),
    enabled: Boolean(name),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  })
}