import { TierId } from "../types";

/**
 * Tierの定義
 * 各Tierの表示色とIDを管理
 */
export const TIERS = [
  { id: TierId.S, color: "#FF7F7F" }, // 赤
  { id: TierId.A, color: "#FFBF7F" }, // オレンジ
  { id: TierId.B, color: "#FFDF7F" }, // 黄色っぽいオレンジ
  { id: TierId.C, color: "#7FFF7F" }, // 緑
  // D列を削除
];
