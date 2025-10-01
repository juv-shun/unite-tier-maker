/**
 * ポケモンデータの型定義
 */
export interface Pokemon {
  id: string;
  name: string;
  imageUrl: string;
  type?: string; // S3のデータ形式に合わせてtypeフィールドを追加
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
 * 行のドラッグ＆ドロップアイテムの型定義
 */
export interface RowDragItem {
  rowId: string;
  originalIndex: number;
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
export const ROW_DND_ITEM_TYPE = "row" as const;

/**
 * データロード状態の型定義
 */
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

/**
 * キャッシュメタデータの型定義
 */
export interface CacheMetadata {
  etag?: string;
  lastModified?: string;
  timestamp: number;
}

/**
 * API レスポンスの型定義
 */
export interface ApiResponse<T> {
  data: T;
  etag?: string;
  lastModified?: string;
}
