import { useState, useCallback } from 'react';
import { Pokemon, pokemonList, Position, POSITIONS } from '../data/pokemon';
import { PokemonAssignment, TierId } from '../types';
import { TIERS } from '../constants/tiers';

// 型定義とTIERSは types と constants に移動しました

export const useTierManagement = () => {
  const [assignments, setAssignments] = useState<PokemonAssignment[]>(
    pokemonList.map((pokemon, index) => ({
      pokemonId: pokemon.id,
      location: TierId.UNASSIGNED, // 初期状態ではunassigned
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

      // ドラッグしたポケモンを除くすべての配置情報
      const filteredAssignments = assignmentsCopy.filter(a => a.pokemonId !== draggedPokemonId);

      // 各ロケーションごとの配置情報を展開
      const newTiersState: Record<string, PokemonAssignment[]> = {};
      
      // すべてのロケーションキーを生成
      // アサイメントから現在使用中のすべてのロケーションキーを取得
      const locationKeysSet = new Set<string>();
      locationKeysSet.add(TierId.UNASSIGNED);

      // 現在のアサイメントから使用中のロケーションキーを追加
      assignmentsCopy.forEach(a => {
        locationKeysSet.add(a.location);
      });
      
      // 新しいターゲットロケーションも追加
      locationKeysSet.add(targetTierLocation);
      
      // Setを配列に変換
      const locationKeys = Array.from(locationKeysSet);

      // 各ロケーションごとに配置情報をフィルタリングして保持
      locationKeys.forEach(locationKey => {
        newTiersState[locationKey] = filteredAssignments
          .filter(a => a.location === locationKey)
          .sort((a, b) => a.position - b.position);
      });

      // ドラッグしたポケモンの配置先を更新
      // targetTierLocationは文字列型(ポジションとTierの組み合わせや単純なTierIdやunassignedなど)
      draggedPokemonAssignment.location = targetTierLocation as string;
      
      // ターゲット位置に挿入または最後に追加
      if (targetIndexInTier !== undefined) {
        newTiersState[targetTierLocation].splice(targetIndexInTier, 0, draggedPokemonAssignment);
      } else {
        newTiersState[targetTierLocation].push(draggedPokemonAssignment);
      }

      // すべての配置情報を再構成し、各ロケーション内での位置を更新
      const finalAssignments: PokemonAssignment[] = [];
      locationKeys.forEach(locationKey => {
        newTiersState[locationKey].forEach((assignment, index) => {
          assignment.position = index;
          finalAssignments.push(assignment);
        });
      });
      
      return finalAssignments;
    });
  }, []);

  // すべてのポケモンを未配置状態にリセット
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
