import styled from '@emotion/styled';

/**
 * DraggablePokemonコンポーネントのスタイル
 */
export const PokemonContainer = styled.div<{ isDragging: boolean; isOver: boolean; canDrop: boolean }>`
  opacity: ${props => props.isDragging ? 0.5 : 1};
  cursor: move;
  width: 60px;
  height: 60px;
  margin: 5px;
  display: inline-block;
  background-color: ${props => props.isOver && props.canDrop ? 'rgba(0, 255, 0, 0.1)' : 'transparent'};
  border-radius: 4px;
  transition: opacity 0.2s ease, background-color 0.2s ease;
`;

export const PokemonImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;
