import React, { createContext, useContext, ReactNode } from 'react';
import { Pokemon, pokemonList } from '../data/pokemon';

/**
 * ポケモンデータのコンテキスト型定義
 */
interface PokemonContextType {
  pokemonList: Pokemon[];
  getPokemonById: (id: string) => Pokemon | undefined;
}

// デフォルト値の作成
const defaultContextValue: PokemonContextType = {
  pokemonList: [],
  getPokemonById: () => undefined,
};

// コンテキストの作成
const PokemonContext = createContext<PokemonContextType>(defaultContextValue);

/**
 * ポケモンデータを提供するプロバイダーコンポーネント
 */
export const PokemonProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // ポケモンをIDで検索する関数
  const getPokemonById = (id: string): Pokemon | undefined => {
    return pokemonList.find(pokemon => pokemon.id === id);
  };

  // コンテキスト値
  const value: PokemonContextType = {
    pokemonList,
    getPokemonById,
  };

  return (
    <PokemonContext.Provider value={value}>
      {children}
    </PokemonContext.Provider>
  );
};

/**
 * ポケモンデータにアクセスするためのカスタムフック
 */
export const usePokemon = (): PokemonContextType => {
  const context = useContext(PokemonContext);
  if (context === undefined) {
    throw new Error('usePokemon must be used within a PokemonProvider');
  }
  return context;
};
