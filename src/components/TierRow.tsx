import React, { useRef } from 'react';
import { useDrop } from 'react-dnd';
import { Pokemon } from '../data/pokemon';
import DraggablePokemon from './DraggablePokemon';
import { DragItem, DND_ITEM_TYPE } from '../types';

interface TierRowProps {
  tier: string;
  color: string;
  pokemon: Pokemon[];
  onMovePokemon: (draggedPokemonId: string, targetTierLocation: string, targetIndexInTier: number | undefined) => void;
}

const TierRow: React.FC<TierRowProps> = ({ tier, color, pokemon, onMovePokemon }) => {
  const ref = useRef<HTMLDivElement>(null);
  
  const [{ isOver }, connectDrop] = useDrop<
    DragItem, 
    void, 
    { isOver: boolean }
  >(() => ({
    accept: DND_ITEM_TYPE,
    drop: (item: DragItem) => {
      // TierRowの空きスペースにドロップされた場合
      // ドラッグ元のTierとドロップ先のTierが異なる場合に、このTierの末尾に追加
      if (item.originalTierLocation !== tier) {
        onMovePokemon(item.id, tier, undefined); 
      }
      // 同じTier内での移動で、Tierの空きスペースにドロップされた場合の処理は、
      // DraggablePokemonのhoverによる並び替えに任せるか、ここで明示的に末尾に追加するか検討の余地あり。
      // 現状では、異なるTierからの移動のみをここで処理。
      return undefined;
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

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
        {pokemon.map((p, index) => (
          <DraggablePokemon 
            key={p.id} 
            pokemon={p} 
            index={index} 
            tierLocation={tier} 
            onMove={onMovePokemon}
          />
        ))}
      </div>
    </div>
  );
};

export default TierRow;
