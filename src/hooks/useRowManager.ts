import { useCallback, useEffect, useMemo, useState } from "react";
import { POSITIONS } from "../constants/positions";
import { ROW_COLOR_PALETTE } from "../constants/rowColors";

export interface RowDef {
  id: string;
  name: string;
  color: string;
}

const STORAGE_KEY = "dynamicRows";
const MIN_ROWS = 5;
const MAX_ROWS = 9;

export const useRowManager = () => {
  const defaultRows = useMemo<RowDef[]>(() => {
    return POSITIONS.map((p, idx) => ({
      id: p.id,
      name: p.name,
      color: ROW_COLOR_PALETTE[idx % ROW_COLOR_PALETTE.length],
    }));
  }, []);

  const loadSaved = useCallback((): RowDef[] | null => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as Partial<RowDef>[];
      // 簡易バリデーション＆マイグレーション（colorが無い旧データに色を割り当て）
      if (!Array.isArray(parsed)) return null;
      return parsed
        .filter((r) => r && typeof r.id === "string" && typeof r.name === "string")
        .map((r, idx) => ({
          id: r!.id as string,
          name: r!.name as string,
          color:
            typeof r!.color === "string" && r!.color
              ? (r!.color as string)
              : ROW_COLOR_PALETTE[idx % ROW_COLOR_PALETTE.length],
        }));
    } catch {
      return null;
    }
  }, []);

  const [rows, setRows] = useState<RowDef[]>(() => {
    const saved = loadSaved();
    if (saved && saved.length >= MIN_ROWS) return saved.slice(0, MAX_ROWS);
    return defaultRows;
  });

  const save = useCallback((next: RowDef[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {}
  }, []);

  useEffect(() => {
    save(rows);
  }, [rows, save]);

  const addRow = useCallback(() => {
    setRows((prev) => {
      if (prev.length >= MAX_ROWS) return prev;
      // 新規ID生成（既存と衝突しないように）
      let idx = 1;
      const existing = new Set(prev.map((r) => r.id));
      let newId = `row-${idx}`;
      while (existing.has(newId)) {
        idx += 1;
        newId = `row-${idx}`;
      }
      const newRow: RowDef = {
        id: newId,
        name: `行 ${prev.length + 1}`,
        color: ROW_COLOR_PALETTE[prev.length % ROW_COLOR_PALETTE.length],
      };
      return [...prev, newRow];
    });
  }, []);

  const removeRow = useCallback((id: string) => {
    setRows((prev) => {
      if (prev.length <= MIN_ROWS) return prev;
      const next = prev.filter((r) => r.id !== id);
      // 名前のインデックスを整える（任意）
      return next;
    });
  }, []);

  const updateRowLabel = useCallback((id: string, name: string) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, name } : r)));
  }, []);

  const updateRowColor = useCallback((id: string, color: string) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, color } : r)));
  }, []);

  const resetRows = useCallback(() => {
    setRows(defaultRows);
    localStorage.removeItem(STORAGE_KEY);
  }, [defaultRows]);

  const getRowLabel = useCallback(
    (id: string): string => rows.find((r) => r.id === id)?.name ?? "",
    [rows]
  );

  return {
    rows,
    addRow,
    removeRow,
    updateRowLabel,
    updateRowColor,
    resetRows,
    getRowLabel,
    MIN_ROWS,
    MAX_ROWS,
  };
};
