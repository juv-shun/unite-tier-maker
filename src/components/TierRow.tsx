import React, { useRef, memo } from 'react';
import { useDrop } from 'react-dnd';
import { Pokemon } from '../data/pokemon';
import DraggablePokemon from './DraggablePokemon';
import { DragItem, DND_ITEM_TYPE } from '../types';
import { TierRowContainer, TierLabel, TierContent } from '../styles/TierRow.styles';

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
    <TierRowContainer>
      <TierLabel backgroundColor={color}>
        {tier}
      </TierLabel>
      <TierContent ref={ref} isOver={isOver}>
        {pokemon.map((p, index) => (
          <DraggablePokemon 
            key={p.id} 
            pokemon={p} 
            index={index} 
            tierLocation={tier} 
            onMove={onMovePokemon}
          />
        ))}
      </TierContent>
    </TierRowContainer>
  );
};

// React.memoでコンポーネントをメモ化し、不要な再レンダリングを防止
export default memo(TierRow);
