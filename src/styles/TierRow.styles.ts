import styled from "@emotion/styled";

/**
 * TierRowコンポーネントのスタイル
 */
export const TierRowContainer = styled.div`
  display: flex;
  flex: 1;
`;

export const TierLabel = styled.div<{ backgroundColor: string }>`
  background-color: ${(props) => props.backgroundColor};
  color: white;
  font-weight: bold;
  padding: 10px;
  width: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const TierContent = styled.div<{ isOver: boolean }>`
  flex: 1;
  min-height: 70px;
  background-color: ${(props) => (props.isOver ? "rgba(0, 0, 0, 0.1)" : "rgba(0, 0, 0, 0.05)")};
  display: flex;
  flex-wrap: wrap;
  margin-left: 5px;
  transition: background-color 0.2s ease;
`;
