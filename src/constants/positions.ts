export enum Position {
  TOP_CARRIER = "attacker",
  TOP_EXP = "speedster",
  JUNGLER = "all-rounder",
  BOTTOM_CARRIER = "defender",
  BOTTOM_EXP = "supporter",
}

export const POSITIONS = [
  { id: Position.TOP_CARRIER, name: "上キャリー" },
  { id: Position.TOP_EXP, name: "上学習" },
  { id: Position.JUNGLER, name: "中央エリア" },
  { id: Position.BOTTOM_CARRIER, name: "下キャリー" },
  { id: Position.BOTTOM_EXP, name: "下学習" },
];
