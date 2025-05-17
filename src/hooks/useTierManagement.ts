import { useState, useCallback } from 'react';
import { Pokemon, pokemonList } from '../data/pokemon';

// Tierの定義
export const TIERS = [
  { id: 'S', color: '#FF7F7F' }, // 赤
  { id: 'A', color: '#FFBF7F' }, // オレンジ
  { id: 'B', color: '#FFFF7F' }, // 黄色
  { id: 'C', color: '#7FFF7F' }, // 緑
  { id: 'D', color: '#7FBFFF' }, // 青
];

// 配置情報を管理するためのインターフェイス
export interface PokemonAssignment {
  pokemonId: string;
  location: string; // 'unassigned' または Tierの ID
  position: number; // Tier内での位置（順序）
}

export const useTierManagement = () => {
  const [assignments, setAssignments] = useState<PokemonAssignment[]>(
    pokemonList.map((pokemon, index) => ({
      pokemonId: pokemon.id,
      location: 'unassigned',
      position: index
    }))
  );

  const getPokemonById = useCallback((id: string): Pokemon | undefined => {
    return pokemonList.find(pokemon => pokemon.id === id);
  }, []);

  const getPokemonsByLocation = useCallback((location: string): Pokemon[] => {
    return assignments
      .filter(assignment => assignment.location === location)
      .sort((a, b) => a.position - b.position)
      .map(assignment => {
        const pokemon = getPokemonById(assignment.pokemonId);
        if (!pokemon) return null;
        return pokemon;
      })
      .filter((pokemon): pokemon is Pokemon => pokemon !== null);
  }, [assignments, getPokemonById]);

  const handleMovePokemon = useCallback((
    draggedPokemonId: string,
    targetTierLocation: string,
    targetIndexInTier: number | undefined
  ) => {
    setAssignments(prevAssignments => {
      const assignmentsCopy = prevAssignments.map(a => ({ ...a }));
      const draggedPokemonAssignment = assignmentsCopy.find(a => a.pokemonId === draggedPokemonId);
      if (!draggedPokemonAssignment) return prevAssignments;

      const filteredAssignments = assignmentsCopy.filter(a => a.pokemonId !== draggedPokemonId);

      const newTiersState: Record<string, PokemonAssignment[]> = {};
      const allTierIds = [...TIERS.map(t => t.id), 'unassigned'];

      allTierIds.forEach(tierId => {
        newTiersState[tierId] = filteredAssignments
          .filter(a => a.location === tierId)
          .sort((a, b) => a.position - b.position);
      });

      draggedPokemonAssignment.location = targetTierLocation;
      if (targetIndexInTier !== undefined) {
        newTiersState[targetTierLocation].splice(targetIndexInTier, 0, draggedPokemonAssignment);
      } else {
        newTiersState[targetTierLocation].push(draggedPokemonAssignment);
      }

      const finalAssignments: PokemonAssignment[] = [];
      allTierIds.forEach(tierId => {
        newTiersState[tierId].forEach((pokemon, index) => {
          pokemon.position = index;
          finalAssignments.push(pokemon);
        });
      });
      return finalAssignments;
    });
  }, []);

  const handleResetTiers = useCallback(() => {
    setAssignments(
      pokemonList.map((pokemon, index) => ({
        pokemonId: pokemon.id,
        location: 'unassigned',
        position: index
      }))
    );
  }, []);

  return {
    TIERS,
    assignments, // フェーズ2以降で内部状態にするか検討
    getPokemonsByLocation,
    handleMovePokemon,
    handleResetTiers,
  };
};
