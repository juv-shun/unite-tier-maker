import styled from "@emotion/styled";

/**
 * DraggablePokemonコンポーネントのスタイル
 */
export const PokemonContainer = styled.div<{
  isDragging: boolean;
  isOver: boolean;
  canDrop: boolean;
  isSelected?: boolean;
}>`
  opacity: ${(props) => (props.isDragging ? 0.5 : 1)};
  cursor: move;
  width: 50px;
  height: 50px;
  margin: 10px 0px 10px 5px;
  display: inline-block;
  background-color: ${(props) =>
    props.isOver && props.canDrop ? "rgba(0, 255, 0, 0.1)" : "transparent"};
  border-radius: 4px;
  transition:
    opacity 0.2s ease,
    background-color 0.2s ease;
`;

export const PokemonImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

export const RemoveButton = styled.div`
  position: absolute;
  top: -5px;
  right: -5px;
  width: 18px;
  height: 18px;
  background-color: rgba(255, 0, 0, 0.8);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 12px;
  font-weight: bold;
  z-index: 10;

  &:hover {
    background-color: rgba(255, 0, 0, 1);
  }
`;

export const PokemonWrapper = styled.div<{ isSelected?: boolean }>`
  position: relative;
  display: inline-block;
`;

export const PlacedMark = styled.div`
  position: absolute;
  top: 2px;
  right: 2px;
  width: 16px;
  height: 16px;
  background-color: #4CAF50;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: bold;
  z-index: 10;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
`;
