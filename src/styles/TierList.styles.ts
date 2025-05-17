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
  max-width: 800px;
  margin: 0 auto;
`;

export const TierListHeader = styled.div`
  margin: 20px 0;
  text-align: center;
`;

export const TierListContent = styled.div`
  margin-bottom: 20px;
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
