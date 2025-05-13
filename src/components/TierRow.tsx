import React, { useRef } from 'react';
import { useDrop } from 'react-dnd';
import { Pokemon } from '../data/pokemon';
import DraggablePokemon from './DraggablePokemon';

interface TierRowProps {
  tier: string;
  color: string;
  pokemon: Pokemon[];
  onDrop: (pokemonId: string, tierId: string) => void;
}

const TierRow: React.FC<TierRowProps> = ({ tier, color, pokemon, onDrop }) => {
  const ref = useRef<HTMLDivElement>(null);
  
  const [{ isOver }, connectDrop] = useDrop<{ id: string }, void, { isOver: boolean }>(() => ({
    accept: 'pokemon',
    drop: (item: { id: string }) => {
      onDrop(item.id, tier);
      return undefined;
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  // connectDropを直接呼び出す
  connectDrop(ref);

  return (
    <div className="tier-row" style={{ display: 'flex', marginBottom: '10px' }}>
      <div
        className="tier-label"
        style={{
          backgroundColor: color,
          color: 'white',
          fontWeight: 'bold',
          padding: '10px',
          width: '50px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {tier}
      </div>
      <div
        ref={ref}
        className="tier-content"
        style={{
          flex: 1,
          minHeight: '70px',
          backgroundColor: isOver ? 'rgba(0, 0, 0, 0.1)' : 'rgba(0, 0, 0, 0.05)',
          display: 'flex',
          flexWrap: 'wrap',
          padding: '5px',
        }}
      >
        {pokemon.map((p) => (
          <DraggablePokemon key={p.id} pokemon={p} />
        ))}
      </div>
    </div>
  );
};

export default TierRow;
