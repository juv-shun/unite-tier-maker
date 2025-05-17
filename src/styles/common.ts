import { css } from '@emotion/react';

/**
 * アプリケーション全体で使用する共通スタイル
 */
export const commonStyles = {
  container: css`
    max-width: 800px;
    margin: 0 auto;
  `,
  header: css`
    margin: 20px 0;
    text-align: center;
  `,
  button: css`
    padding: 10px 15px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  `,
  resetButton: css`
    background-color: #f44336;
    color: white;
    ${css`
      &:hover {
        background-color: #d32f2f;
      }
    `}
  `,
  buttonContainer: css`
    text-align: center;
    margin-top: 20px;
  `,
};
