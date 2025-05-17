import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Pokemon } from '../data/pokemon';

interface DraggablePokemonProps {
  pokemon: Pokemon;
  index?: number;  // Tier内での位置
  tierLocation?: string;  // 所属するTierの位置
  onReorder?: (sourceIndex: number, targetIndex: number) => void;  // 並び替え時のコールバック
}

const DraggablePokemon: React.FC<DraggablePokemonProps> = ({ pokemon, index, tierLocation, onReorder }) => {
  const ref = useRef<HTMLDivElement>(null);
  
  // ドラッグの設定
  const [{ isDragging }, connectDrag] = useDrag<
    { id: string; index: number | undefined; tierLocation: string | undefined },
    void,
    { isDragging: boolean }
  >(() => ({
    type: 'pokemon',
    item: { id: pokemon.id, index, tierLocation },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    canDrag: true,
  }));

  // 同じTier内でのドロップの設定（順序変更用）
  const [{ isOver }, connectDrop] = useDrop<
    { id: string; index: number | undefined; tierLocation: string | undefined },
    void,
    { isOver: boolean }
  >(() => ({
    accept: 'pokemon',
    hover: (item, monitor) => {
      // 同じTier内での並び替えのみをサポート
      if (!ref.current || 
          item.id === pokemon.id || 
          item.tierLocation !== tierLocation || 
          item.tierLocation === 'unassigned' || 
          tierLocation === 'unassigned' || 
          item.index === undefined || 
          index === undefined) {
        return;
      }

      // ドラッグ中のアイテムの位置とドロップ先の位置を比較
      const dragIndex = item.index;
      const hoverIndex = index;

      // 同じ位置の場合は何もしない
      if (dragIndex === hoverIndex) {
        return;
      }

      // 並び替えのコールバックを呼び出す
      if (onReorder) {
        onReorder(dragIndex, hoverIndex);
      }

      // ポインタの位置情報を更新
      item.index = hoverIndex;
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  // dragとdropの両方の参照を結合
  const dragDropRef = (node: HTMLDivElement | null) => {
    connectDrag(node);
    connectDrop(node);
  };

  return (
    <div
      ref={dragDropRef}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
        width: '60px',
        height: '60px',
        margin: '5px',
        display: 'inline-block',
        backgroundColor: isOver ? 'rgba(0, 255, 0, 0.1)' : 'transparent',
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
