import React, { useRef } from 'react';
import { useDrag, useDrop, XYCoord } from 'react-dnd'; 
import { Pokemon } from '../data/pokemon';
import { DragItem, DND_ITEM_TYPE } from '../types';

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
    <div
      ref={ref} 
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
        width: '60px',
        height: '60px',
        margin: '5px',
        display: 'inline-block',
        backgroundColor: isOver && dropCanDrop ? 'rgba(0, 255, 0, 0.1)' : 'transparent', 
        borderRadius: '4px',
      }}
    >
      <img
        src={pokemon.imageUrl}
        alt={pokemon.name}
        title={pokemon.name}
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
      />
    </div>
  );
};

export default DraggablePokemon;
