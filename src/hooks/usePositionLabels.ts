import { useState, useCallback, useEffect } from "react";
import { Position, POSITIONS } from "../constants/positions";

const STORAGE_KEY = "positionLabels";

export interface PositionLabel {
  id: Position;
  name: string;
}

export const usePositionLabels = () => {
  const getDefaultLabels = useCallback((): PositionLabel[] => {
    return POSITIONS.map((position) => ({
      id: position.id,
      name: position.name,
    }));
  }, []);

  const getSavedLabels = useCallback((): PositionLabel[] | null => {
    try {
      const savedLabels = localStorage.getItem(STORAGE_KEY);
      if (savedLabels) {
        const parsed = JSON.parse(savedLabels);
        return parsed;
      }
    } catch (e) {
      console.error("ポジションラベルの復元に失敗しました:", e);
    }
    return null;
  }, []);

  const [positionLabels, setPositionLabels] = useState<PositionLabel[]>(() => {
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

  const saveLabelsToStorage = useCallback((labels: PositionLabel[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(labels));
    } catch (e) {
      console.error("ポジションラベルの保存に失敗しました:", e);
    }
  }, []);

  useEffect(() => {
    saveLabelsToStorage(positionLabels);
  }, [positionLabels, saveLabelsToStorage]);

  const updatePositionLabel = useCallback((positionId: Position, newName: string) => {
    setPositionLabels((prevLabels) =>
      prevLabels.map((label) => (label.id === positionId ? { ...label, name: newName } : label))
    );
  }, []);

  const resetToDefaults = useCallback(() => {
    const defaultLabels = getDefaultLabels();
    setPositionLabels(defaultLabels);
    localStorage.removeItem(STORAGE_KEY);
  }, [getDefaultLabels]);

  const getPositionLabel = useCallback(
    (positionId: Position): string => {
      const label = positionLabels.find((label) => label.id === positionId);
      return label?.name || "";
    },
    [positionLabels]
  );

  return {
    positionLabels,
    updatePositionLabel,
    resetToDefaults,
    getPositionLabel,
  };
};
