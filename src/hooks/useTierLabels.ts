import { useState, useCallback, useEffect } from "react";
import { TierId } from "../types";

const STORAGE_KEY = "tierLabels";

export interface TierLabel {
  id: TierId;
  name: string;
}

const DEFAULT_TIER_LABELS: TierLabel[] = [
  { id: TierId.S, name: "S" },
  { id: TierId.A, name: "A" },
  { id: TierId.B, name: "B" },
  { id: TierId.C, name: "C" },
];

export const useTierLabels = () => {
  const getDefaultLabels = useCallback((): TierLabel[] => {
    return DEFAULT_TIER_LABELS.map((tier) => ({
      id: tier.id,
      name: tier.name,
    }));
  }, []);

  const getSavedLabels = useCallback((): TierLabel[] | null => {
    try {
      const savedLabels = localStorage.getItem(STORAGE_KEY);
      if (savedLabels) {
        const parsed = JSON.parse(savedLabels);
        return parsed;
      }
    } catch (e) {
      console.error("Tierラベルの復元に失敗しました:", e);
    }
    return null;
  }, []);

  const [tierLabels, setTierLabels] = useState<TierLabel[]>(() => {
    const savedLabels = getSavedLabels();
    if (savedLabels && savedLabels.length > 0) {
      const defaultLabels = getDefaultLabels();
      const labelMap = new Map(savedLabels.map((label) => [label.id, label.name]));

      return defaultLabels.map((defaultLabel) => ({
        id: defaultLabel.id,
        name: labelMap.get(defaultLabel.id) || defaultLabel.name,
      }));
    }
    return getDefaultLabels();
  });

  const saveLabelsToStorage = useCallback((labels: TierLabel[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(labels));
    } catch (e) {
      console.error("Tierラベルの保存に失敗しました:", e);
    }
  }, []);

  useEffect(() => {
    saveLabelsToStorage(tierLabels);
  }, [tierLabels, saveLabelsToStorage]);

  const updateTierLabel = useCallback((tierId: TierId, newName: string) => {
    setTierLabels((prevLabels) =>
      prevLabels.map((label) => (label.id === tierId ? { ...label, name: newName } : label))
    );
  }, []);

  const resetToDefaults = useCallback(() => {
    const defaultLabels = getDefaultLabels();
    setTierLabels(defaultLabels);
    localStorage.removeItem(STORAGE_KEY);
  }, [getDefaultLabels]);

  const getTierLabel = useCallback(
    (tierId: TierId): string => {
      const label = tierLabels.find((label) => label.id === tierId);
      return label?.name || "";
    },
    [tierLabels]
  );

  return {
    tierLabels,
    updateTierLabel,
    resetToDefaults,
    getTierLabel,
  };
};
