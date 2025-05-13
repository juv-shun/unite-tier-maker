import React, { useRef } from 'react';
import { useDrag } from 'react-dnd';
import { Pokemon } from '../data/pokemon';

interface DraggablePokemonProps {
  pokemon: Pokemon;
}

const DraggablePokemon: React.FC<DraggablePokemonProps> = ({ pokemon }) => {
  const ref = useRef<HTMLDivElement>(null);
  
  const [{ isDragging }, connectDrag] = useDrag<{ id: string }, void, { isDragging: boolean }>(() => ({
    type: 'pokemon',
    item: { id: pokemon.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  // useEffectの代わりにconnectDragを直接呼び出す
  connectDrag(ref);

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
