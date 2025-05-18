import React, { useRef, memo } from 'react';
import { useDrag, useDrop, XYCoord } from 'react-dnd'; 
import { Pokemon } from '../data/pokemon';
import { DragItem, DND_ITEM_TYPE } from '../types';
import { PokemonContainer, PokemonImage } from '../styles/DraggablePokemon.styles';

interface DraggablePokemonProps {
  pokemon: Pokemon;
  index: number;  
  tierLocation: string;  
  onMove: (draggedPokemonId: string, targetTierLocation: string, targetIndexInTier: number | undefined) => void;
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
      item: { id: pokemon.id, originalIndex: index, originalTierLocation: tierLocation },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
      end: (item, monitor) => {
        // ドロップが失敗した場合は何もしない
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
        if (draggedItem.id === pokemon.id) return;

        const hoverIndex = index;
        onMove(draggedItem.id, tierLocation, hoverIndex);

        draggedItem.originalIndex = hoverIndex;
        draggedItem.originalTierLocation = tierLocation;
      },
      canDrop: (draggedItem: DragItem) => { 
        return draggedItem.id !== pokemon.id;
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
