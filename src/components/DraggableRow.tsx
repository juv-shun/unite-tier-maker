import React, { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { ROW_DND_ITEM_TYPE, RowDragItem } from "../types";
import { DraggableRowContainer, DragHandle } from "../styles/DraggableRow.styles";

interface DraggableRowProps {
  rowId: string;
  index: number;
  onReorderRow: (dragIndex: number, hoverIndex: number) => void;
  children: React.ReactNode;
}

const DraggableRow: React.FC<DraggableRowProps> = ({ rowId, index, onReorderRow, children }) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag<RowDragItem, void, { isDragging: boolean }>({
    type: ROW_DND_ITEM_TYPE,
    item: { rowId, originalIndex: index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop<RowDragItem, void, { isOver: boolean }>({
    accept: ROW_DND_ITEM_TYPE,
    hover: (draggedItem: RowDragItem) => {
      if (!ref.current) return;
      if (draggedItem.rowId === rowId) return;

      const dragIndex = draggedItem.originalIndex;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      // 並び替えを実行
      onReorderRow(dragIndex, hoverIndex);

      // ドラッグ中の元のインデックスを更新
      draggedItem.originalIndex = hoverIndex;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  // ドラッグハンドルを行全体に適用
  drag(drop(ref));

  return (
    <DragHandle>
      <DraggableRowContainer ref={ref} isDragging={isDragging} isOver={isOver}>
        {children}
      </DraggableRowContainer>
    </DragHandle>
  );
};

export default DraggableRow;
