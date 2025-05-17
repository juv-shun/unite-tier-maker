/**
 * ポケモンデータの型定義
 */
export interface Pokemon {
  id: string;
  name: string;
  imageUrl: string;
}

/**
 * Tier IDの列挙型
 */
export enum TierId {
  S = 'S',
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
  UNASSIGNED = 'unassigned'
}

/**
 * ドラッグ＆ドロップアイテムの型定義
 */
export interface DragItem {
  id: string;
  originalIndex: number;
  originalTierLocation: string;
}

/**
 * ポケモン配置情報の型定義
 */
export interface PokemonAssignment {
  pokemonId: string;
  location: string; // TierId または 'unassigned'
  position: number; // Tier内での位置（順序）
}

/**
 * DnDアイテムタイプの定数
 */
export const DND_ITEM_TYPE = 'pokemon' as const;
