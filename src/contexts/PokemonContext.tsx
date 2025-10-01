import React, { createContext, useContext, ReactNode, useEffect, useState } from "react";
import { Pokemon } from "../types";
import { LoadingState } from "../types";
import { pokemonDataService } from "../services/pokemonDataService";

/**
 * ポケモンデータのコンテキスト型定義
 */
interface PokemonContextType {
  pokemonList: Pokemon[];
  getPokemonById: (id: string) => Pokemon | undefined;
  loadingState: LoadingState;
  refreshData: () => Promise<void>;
}

// デフォルト値の作成
const defaultContextValue: PokemonContextType = {
  pokemonList: [],
  getPokemonById: () => undefined,
  loadingState: { isLoading: false, error: null },
  refreshData: async () => {},
};

// コンテキストの作成
const PokemonContext = createContext<PokemonContextType>(defaultContextValue);

/**
 * ポケモンデータを提供するプロバイダーコンポーネント
 */
export const PokemonProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: true,
    error: null,
  });

  // ポケモンをIDで検索する関数
  const getPokemonById = (id: string): Pokemon | undefined => {
    return pokemonList.find((pokemon) => pokemon.id === id);
  };

  // データを取得/更新する関数
  const refreshData = async (): Promise<void> => {
    setLoadingState({ isLoading: true, error: null });

    try {
      const response = await pokemonDataService.fetchPokemonData();
      setPokemonList(response.data);
      setLoadingState({ isLoading: false, error: null });
    } catch (error) {
      console.error("Failed to fetch pokemon data:", error);
      setLoadingState({
        isLoading: false,
        error: error instanceof Error ? error.message : "データの取得に失敗しました",
      });
      // エラー時は空の配列を設定
      setPokemonList([]);
    }
  };

  // 初期データロード
  useEffect(() => {
    refreshData();
  }, []);

  // コンテキスト値
  const value: PokemonContextType = {
    pokemonList,
    getPokemonById,
    loadingState,
    refreshData,
  };

  return <PokemonContext.Provider value={value}>{children}</PokemonContext.Provider>;
};

/**
 * ポケモンデータにアクセスするためのカスタムフック
 */
export const usePokemon = (): PokemonContextType => {
  const context = useContext(PokemonContext);
  if (context === undefined) {
    throw new Error("usePokemon must be used within a PokemonProvider");
  }
  return context;
};
