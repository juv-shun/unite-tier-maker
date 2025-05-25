import { Position } from "../data/pokemon";

/**
 * ポケモンデータの型定義
 */
export interface Pokemon {
  id: string;
  name: string;
  imageUrl: string;
  position: Position;
}

/**
 * Tier IDの列挙型
 */
export enum TierId {
  S = "S",
  A = "A",
  B = "B",
  C = "C",
  // D値を削除
  UNASSIGNED = "unassigned",
}

/**
 * ドラッグ＆ドロップアイテムの型定義
 */
export interface DragItem {
  id: string;
  assignmentId?: string; // 追加: アサインメントのID
  originalIndex: number;
  originalTierLocation: string;
}

/**
 * ポケモン配置情報の型定義
 */
export interface PokemonAssignment {
  id: string; // 追加: 各配置に固有のID
  pokemonId: string;
  location: string; // TierId単体、または '{Position}-{TierId}' の形式、あるいは 'unassigned'
  position: number; // そのロケーション内での位置（順序）
  isFromUnassignedArea: boolean; // 追加: 未配置エリアからのものかどうか
}

/**
 * DnDアイテムタイプの定数
 */
export const DND_ITEM_TYPE = "pokemon" as const;
