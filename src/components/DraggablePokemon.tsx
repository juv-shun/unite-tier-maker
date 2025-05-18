import React, { useRef, memo } from 'react';
import { useDrag, useDrop, XYCoord } from 'react-dnd'; 
import { Pokemon } from '../data/pokemon';
import { DragItem, DND_ITEM_TYPE, TierId } from '../types';
import { PokemonContainer, PokemonImage } from '../styles/DraggablePokemon.styles';

interface DraggablePokemonProps {
  pokemon: Pokemon & { assignmentId?: string; isFromUnassignedArea?: boolean };
  index: number;  
  tierLocation: string;  
  onMove: (draggedItemInfo: { pokemonId: string; assignmentId?: string }, targetTierLocation: string, targetIndexInTier: number | undefined, isDroppedOutside?: boolean) => void;
}

const DraggablePokemon: React.FC<DraggablePokemonProps> = ({ pokemon, index, tierLocation, onMove }) => {
  const ref = useRef<HTMLDivElement>(null);
  
  const [{ isDragging }, drag, preview] = useDrag<
    DragItem, 
    void,    
    { isDragging: boolean } 
  >(
    () => ({
      type: DND_ITEM_TYPE, 
      item: { 
        id: pokemon.id, 
        assignmentId: tierLocation === TierId.UNASSIGNED ? undefined : pokemon.assignmentId, // 下部からはundefinedでコピー扱い
        originalIndex: index, 
        originalTierLocation: tierLocation 
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
        if (!ref.current) return;
        if (draggedItem.id === pokemon.id && draggedItem.assignmentId === pokemon.assignmentId) return;

        const hoverIndex = index;
        // アサインメントIDを含む呼び出しに変更
        onMove({ pokemonId: draggedItem.id, assignmentId: draggedItem.assignmentId }, tierLocation, hoverIndex, false);

        draggedItem.originalIndex = hoverIndex;
        draggedItem.originalTierLocation = tierLocation;
      },
      canDrop: (draggedItem: DragItem) => { 
        // 同じポケモンでもアサインメントIDが異なれば許可（複数配置のため）
        return !(draggedItem.id === pokemon.id && draggedItem.assignmentId === pokemon.assignmentId);
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver() && monitor.canDrop(),
        canDrop: !!monitor.canDrop(), 
      }),
    }),
    [pokemon, index, tierLocation, onMove]
  );

  drag(drop(ref));

  return (
    <PokemonContainer
      ref={ref} 
      isDragging={isDragging}
      isOver={isOver}
      canDrop={dropCanDrop}
    >
      <PokemonImage
        src={pokemon.imageUrl}
        alt={pokemon.name}
        title={pokemon.name}
      />
    </PokemonContainer>
  );
};

// React.memoでコンポーネントをメモ化し、不要な再レンダリングを防止
export default memo(DraggablePokemon);
