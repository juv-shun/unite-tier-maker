import React, { useState, useCallback } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Pokemon, pokemonList } from '../data/pokemon';
import TierRow from './TierRow';
import DraggablePokemon from './DraggablePokemon';

const TIERS = [
  { id: 'S', color: '#FF7F7F' }, // 赤
  { id: 'A', color: '#FFBF7F' }, // オレンジ
  { id: 'B', color: '#FFFF7F' }, // 黄色
  { id: 'C', color: '#7FFF7F' }, // 緑
  { id: 'D', color: '#7FBFFF' }, // 青
];

// 配置情報を管理するためのインターフェイス
interface PokemonAssignment {
  pokemonId: string;
  location: string; // 'unassigned' または Tierの ID
  position: number; // Tier内での位置（順序）
}

const TierList: React.FC = () => {
  // 各ポケモンの配置情報を管理する状態
  const [assignments, setAssignments] = useState<PokemonAssignment[]>(
    pokemonList.map((pokemon, index) => ({
      pokemonId: pokemon.id,
      location: 'unassigned',
      position: index
    }))
  );

  // ポケモンIDからポケモン情報を取得するヘルパー関数
  const getPokemonById = useCallback((id: string): Pokemon | undefined => {
    return pokemonList.find(pokemon => pokemon.id === id);
  }, []);

  // 特定の場所に配置されているポケモンを取得するヘルパー関数（位置順にソート）
  const getPokemonsByLocation = useCallback((location: string): Pokemon[] => {
    return assignments
      .filter(assignment => assignment.location === location)
      .sort((a, b) => a.position - b.position) // 位置でソート
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
    targetIndexInTier: number | undefined // targetTierLocation内での挿入位置index、undefinedなら末尾
  ) => {
    setAssignments(prevAssignments => {
      const assignmentsCopy = prevAssignments.map(a => ({ ...a }));

      const draggedPokemonAssignment = assignmentsCopy.find(a => a.pokemonId === draggedPokemonId);
      if (!draggedPokemonAssignment) return prevAssignments;

      // 1. ドラッグされたポケモンを一時的に取り除く (後で正しい位置に挿入するため)
      const filteredAssignments = assignmentsCopy.filter(a => a.pokemonId !== draggedPokemonId);

      // 2. 各Tierのポケモンリストを再構築し、順序を正規化する
      const newTiersState: Record<string, PokemonAssignment[]> = {};
      const allTierIds = [...TIERS.map(t => t.id), 'unassigned'];

      allTierIds.forEach(tierId => {
        newTiersState[tierId] = filteredAssignments
          .filter(a => a.location === tierId)
          .sort((a, b) => a.position - b.position);
      });

      // 3. ドラッグされたポケモンをターゲットTierの指定位置に挿入
      draggedPokemonAssignment.location = targetTierLocation;
      if (targetIndexInTier !== undefined) {
        newTiersState[targetTierLocation].splice(targetIndexInTier, 0, draggedPokemonAssignment);
      } else {
        newTiersState[targetTierLocation].push(draggedPokemonAssignment); // 末尾に追加
      }

      // 4. 全てのポケモンの位置を再採番し、最終的なリストを生成
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

  // リセットボタンのハンドラー
  const handleResetTiers = useCallback(() => {
    setAssignments(
      pokemonList.map((pokemon, index) => ({
        pokemonId: pokemon.id,
        location: 'unassigned',
        position: index
      }))
    );
  }, []);

  // 未配置のポケモンを取得
  const unassignedPokemon = getPokemonsByLocation('unassigned');

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="tier-list-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div className="tier-list-header" style={{ margin: '20px 0', textAlign: 'center' }}>
          <h1>ポケモンユナイト Tierリスト</h1>
        </div>
        
        <div className="tier-list">
          {TIERS.map((tier) => (
            <TierRow
              key={tier.id}
              tier={tier.id}
              color={tier.color}
              pokemon={getPokemonsByLocation(tier.id)}
              onMovePokemon={handleMovePokemon}
            />
          ))}
        </div>
        
        <div 
          className="unassigned-pokemon"
          style={{ 
            marginTop: '30px',
            padding: '15px', 
            backgroundColor: '#f5f5f5',
            borderRadius: '5px'
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {unassignedPokemon.map((pokemon, index) => (
              <DraggablePokemon 
                key={pokemon.id} 
                pokemon={pokemon} 
                tierLocation="unassigned"
                index={index} // unassignedエリア内でのindex
                onMove={handleMovePokemon} // 未配置エリアのポケモンも移動できるようにする
              />
            ))}
          </div>
        </div>
        
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button 
            onClick={handleResetTiers}
            style={{
              padding: '10px 15px',
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            リセット
          </button>
        </div>
      </div>
    </DndProvider>
  );
};

export default TierList;
