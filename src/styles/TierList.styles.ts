import { css } from '@emotion/react';
import styled from '@emotion/styled';

/**
 * TierListコンポーネントのスタイル
 */
export const tierListStyles = {
  container: css`
    max-width: 800px;
    margin: 0 auto;
  `,
  header: css`
    margin: 20px 0;
    text-align: center;
  `,
  tierList: css`
    margin-bottom: 20px;
  `,
  unassignedContainer: css`
    margin-top: 30px;
    padding: 15px;
    background-color: #f5f5f5;
    border-radius: 5px;
  `,
  unassignedGrid: css`
    display: flex;
    flex-wrap: wrap;
  `,
  buttonContainer: css`
    text-align: center;
    margin-top: 20px;
  `,
  resetButton: css`
    padding: 10px 15px;
    background-color: #f44336;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    &:hover {
      background-color: #d32f2f;
    }
  `,
};

// スタイル付きコンポーネント
export const TierListContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

export const TierListHeader = styled.div`
  margin: 20px 0;
  text-align: center;
`;

export const TierListContent = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 5px;
`;

export const TierLabelsColumn = styled.div`
  width: 40px;
  margin-right: 5px;
`;

export const TierLabelOnly = styled.div<{ backgroundColor: string }>`
  padding: 0;
  text-align: center;
  background-color: ${props => props.backgroundColor};
  color: white;
  font-weight: bold;
  border-radius: 4px;
  margin-bottom: 5px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
`;

export const PositionColumn = styled.div`
  flex: 1;
  min-width: 0;
`;

export const PositionHeader = styled.div<{ backgroundColor: string }>`
  padding: 8px;
  text-align: center;
  background-color: ${props => props.backgroundColor};
  color: white;
  font-weight: bold;
  border-radius: 4px 4px 0 0;
  margin-bottom: 5px;
  box-sizing: border-box;
`;

export const EmptyTierLabel = styled.div`
  height: 30px; // PositionHeaderの高さに合わせる
  margin-bottom: 15px;
  box-sizing: border-box;
`;

export const UnassignedContainer = styled.div`
  margin-top: 30px;
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: 5px;
`;

export const UnassignedGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

export const ButtonContainer = styled.div`
  text-align: center;
  margin-top: 20px;
`;

export const ResetButton = styled.button`
  padding: 10px 15px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #d32f2f;
  }
`;
