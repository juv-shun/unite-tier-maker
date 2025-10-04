import React, { useRef, memo } from "react";
import { useDrop } from "react-dnd";
import { Pokemon } from "../types";
import DraggablePokemon from "./DraggablePokemon";
import { DragItem, DND_ITEM_TYPE } from "../types";
import { TierRowContainer, TierLabel, TierContent } from "../styles/TierRow.styles";

interface TierRowProps {
  tier: string;
  color: string;
  pokemon: (Pokemon & { assignmentId?: string })[];
  onMovePokemon: (
    draggedItemInfo: { pokemonId: string; assignmentId?: string },
    targetTierLocation: string,
    targetIndexInTier: number | undefined,
    isDroppedOutside?: boolean
  ) => void;
  onDeletePokemon?: (pokemonId: string, assignmentId: string) => void;
  positionId?: string; // ポジションIDを追加（オプショナル）
  hideLabel?: boolean; // Tierラベルを非表示にするかどうか（オプショナル）
}

const TierRow: React.FC<TierRowProps> = ({
  tier,
  color,
  pokemon,
  onMovePokemon,
  onDeletePokemon,
  positionId,
  hideLabel = false,
}) => {
  // ポジションとTierを組み合わせたロケーションキーを生成
  const locationKey = positionId ? `${positionId}-${tier}` : tier;
  const ref = useRef<HTMLDivElement>(null);

  const [{ isOver }, connectDrop] = useDrop<DragItem, void, { isOver: boolean }>(() => ({
    accept: DND_ITEM_TYPE,
    drop: (item: DragItem, monitor) => {
      // 子要素（DraggablePokemon）で既に処理されている場合は何もしない
      if (monitor.didDrop()) {
        return undefined;
      }

      // TierRowの空きスペースに直接ドロップされた場合のみ、このTierの末尾に追加
      onMovePokemon(
        { pokemonId: item.id, assignmentId: item.assignmentId },
        locationKey,
        undefined // undefinedで末尾に追加
      );
      return undefined;
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  connectDrop(ref);

  return (
    <TierRowContainer>
      {!hideLabel && <TierLabel backgroundColor={color}>{tier}</TierLabel>}
      <TierContent ref={ref} isOver={isOver} data-testid={`tier-cell-${locationKey}`}>
        {pokemon.map((p, index) => (
          <DraggablePokemon
            key={`${p.id}-${p.assignmentId ?? "base"}`}
            pokemon={p as any}
            index={index}
            tierLocation={locationKey}
            onMove={onMovePokemon}
            onDelete={onDeletePokemon}
          />
        ))}
      </TierContent>
    </TierRowContainer>
  );
};

// React.memoでコンポーネントをメモ化し、不要な再レンダリングを防止
export default memo(TierRow);
