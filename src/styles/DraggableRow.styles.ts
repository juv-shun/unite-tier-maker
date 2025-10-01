import styled from "@emotion/styled";

/**
 * DraggableRowコンポーネントのスタイル
 */
export const DraggableRowContainer = styled.div<{
  isDragging: boolean;
  isOver: boolean;
}>`
  display: grid;
  grid-template-columns: 130px 1fr 1fr 1fr 1fr;
  margin-bottom: 5px;
  gap: 0;
  opacity: ${(props) => (props.isDragging ? 0.5 : 1)};
  transition: opacity 0.2s ease;
  position: relative;

  ${(props) =>
    props.isOver &&
    `
    &::before {
      content: "";
      position: absolute;
      top: -3px;
      left: 0;
      right: 0;
      height: 3px;
      background-color: #4a90e2;
    }
  `}
`;

export const DragHandle = styled.div`
  cursor: grab;
  user-select: none;

  &:active {
    cursor: grabbing;
  }
`;
