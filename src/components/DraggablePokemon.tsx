import React, { useRef, memo, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { Pokemon } from "../data/pokemon";
import { DragItem, DND_ITEM_TYPE, TierId } from "../types";
import {
  PokemonContainer,
  PokemonImage,
  RemoveButton,
  PokemonWrapper,
} from "../styles/DraggablePokemon.styles";

interface DraggablePokemonProps {
  pokemon: Pokemon & { assignmentId?: string; isFromUnassignedArea?: boolean };
  index: number;
  tierLocation: string;
  onMove: (
    draggedItemInfo: { pokemonId: string; assignmentId?: string },
    targetTierLocation: string,
    targetIndexInTier: number | undefined,
    isDroppedOutside?: boolean
  ) => void;
  onDelete?: (pokemonId: string, assignmentId: string) => void;
}

const DraggablePokemon: React.FC<DraggablePokemonProps> = ({
  pokemon,
  index,
  tierLocation,
  onMove,
  onDelete,
}) => {
  const [isSelected, setIsSelected] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag<DragItem, void, { isDragging: boolean }>(
    () => ({
      type: DND_ITEM_TYPE,
      item: {
        id: pokemon.id,
        assignmentId: tierLocation === TierId.UNASSIGNED ? undefined : pokemon.assignmentId, // 下部からはundefinedでコピー扱い
        originalIndex: index,
        originalTierLocation: tierLocation,
      },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
      end: (item, monitor) => {
        // エリア外ドロップによる削除機能は無効化
        if (!monitor.didDrop()) return;
      },
    }),
    [pokemon, index, tierLocation, onMove]
  );

  const [{ isOver, canDrop: dropCanDrop }, drop] = useDrop<
    DragItem,
    void,
    { isOver: boolean; canDrop: boolean }
  >(
    () => ({
      accept: DND_ITEM_TYPE,
      hover: (draggedItem: DragItem, monitor) => {
        // hoverでは移動処理を行わず、ビジュアルフィードバックのみ提供
        if (!ref.current) return;
        if (draggedItem.id === pokemon.id && draggedItem.assignmentId === pokemon.assignmentId)
          return;

        // ここでは実際の移動処理は行わない
      },
      drop: (draggedItem: DragItem, monitor) => {
        // dropイベントでのみ移動処理を実行
        if (!ref.current) return;
        if (draggedItem.id === pokemon.id && draggedItem.assignmentId === pokemon.assignmentId)
          return;

        const hoverIndex = index;
        // アサインメントIDを含む呼び出しに変更
        onMove(
          { pokemonId: draggedItem.id, assignmentId: draggedItem.assignmentId },
          tierLocation,
          hoverIndex,
          false
        );
      },
      canDrop: (draggedItem: DragItem) => {
        // 同じポケモンでもアサインメントIDが異なれば許可（複数配置のため）
        return !(
          draggedItem.id === pokemon.id && draggedItem.assignmentId === pokemon.assignmentId
        );
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver() && monitor.canDrop(),
        canDrop: !!monitor.canDrop(),
      }),
    }),
    [pokemon, index, tierLocation, onMove]
  );

  drag(drop(ref));

  // ポケモンをクリックしたときの処理
  const handleClick = (event: React.MouseEvent) => {
    // ドラッグ中はクリックイベントを発火させない
    if (isDragging) return;

    // 未割り当てエリアのポケモンの場合は選択状態にしない
    if (tierLocation === TierId.UNASSIGNED) return;

    setIsSelected(!isSelected);
    event.stopPropagation();
  };

  // バツボタンクリック時の処理
  const handleRemove = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (onDelete && pokemon.assignmentId) {
      onDelete(pokemon.id, pokemon.assignmentId);
      setIsSelected(false);
    }
  };

  return (
    <PokemonContainer
      ref={ref}
      isDragging={isDragging}
      isOver={isOver}
      canDrop={dropCanDrop}
      isSelected={isSelected}
      onClick={handleClick}
    >
      <PokemonWrapper isSelected={isSelected}>
        <PokemonImage src={pokemon.imageUrl} alt={pokemon.name} title={pokemon.name} />
        {isSelected && tierLocation !== TierId.UNASSIGNED && (
          <RemoveButton onClick={handleRemove}>×</RemoveButton>
        )}
      </PokemonWrapper>
    </PokemonContainer>
  );
};

// React.memoでコンポーネントをメモ化し、不要な再レンダリングを防止
export default memo(DraggablePokemon);
