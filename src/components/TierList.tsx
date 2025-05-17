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

  // ドロップされた時のハンドラー
  const handleDrop = useCallback((pokemonId: string, targetLocation: string) => {
    setAssignments(prev => {
      // 同じロケーションのポケモンの最大ポジションを取得
      const maxPosition = Math.max(
        ...prev
          .filter(a => a.location === targetLocation)
          .map(a => a.position),
        -1
      );

      return prev.map(assignment => 
        assignment.pokemonId === pokemonId
          ? { ...assignment, location: targetLocation, position: maxPosition + 1 }
          : assignment
      );
    });
  }, []);

  // 同じTier内でのポケモンの位置を変更するハンドラー
  const handleReorderPokemon = useCallback((pokemonId: string, sourceIndex: number, targetIndex: number, tierLocation: string) => {
    setAssignments(prev => {
      // 同じTier内のポケモンのみフィルタリング
      const tierPokemons = prev
        .filter(a => a.location === tierLocation)
        .sort((a, b) => a.position - b.position);
      
      // ドラッグしているポケモンのインデックスを見つける
      const pokemonIndex = tierPokemons.findIndex(p => p.pokemonId === pokemonId);
      
      if (pokemonIndex === -1) return prev; // ポケモンが見つからない場合は何もしない
      
      // 配列内で位置を入れ替える
      const newOrder = [...tierPokemons];
      const [removed] = newOrder.splice(pokemonIndex, 1);
      newOrder.splice(targetIndex, 0, removed);
      
      // 新しい位置情報を割り当てる
      const updatedPokemonIds = newOrder.map(p => p.pokemonId);
      
      return prev.map(assignment => {
        if (assignment.location !== tierLocation) return assignment;
        
        const newIndex = updatedPokemonIds.indexOf(assignment.pokemonId);
        if (newIndex === -1) return assignment;
        
        return {
          ...assignment,
          position: newIndex
        };
      });
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
              onDrop={handleDrop}
              onReorder={handleReorderPokemon}
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
            {unassignedPokemon.map((pokemon) => (
              <DraggablePokemon key={pokemon.id} pokemon={pokemon} />
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
