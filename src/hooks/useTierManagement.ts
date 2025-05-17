import { useState, useCallback } from 'react';
import { Pokemon, pokemonList } from '../data/pokemon';
import { PokemonAssignment, TierId } from '../types';
import { TIERS } from '../constants/tiers';

// 型定義とTIERSは types と constants に移動しました

export const useTierManagement = () => {
  const [assignments, setAssignments] = useState<PokemonAssignment[]>(
    pokemonList.map((pokemon, index) => ({
      pokemonId: pokemon.id,
      location: TierId.UNASSIGNED,
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
        location: TierId.UNASSIGNED,
        position: index
      }))
    );
  }, []);

  return {
    assignments, // フェーズ2以降で内部状態にするか検討
    getPokemonsByLocation,
    handleMovePokemon,
    handleResetTiers,
  };
};
