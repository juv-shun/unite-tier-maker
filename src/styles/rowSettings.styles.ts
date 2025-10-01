import styled from "@emotion/styled";

export const SettingsButton = styled.button`
  position: absolute;
  top: -8px;
  right: -8px;
  width: 24px;
  height: 24px;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  background: #ffffff;
  color: #333;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  transition:
    transform 0.15s ease,
    box-shadow 0.2s ease,
    opacity 0.2s ease;
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 14px rgba(0, 0, 0, 0.18);
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
`;

export const ModalContent = styled.div`
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  width: 360px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

export const ModalTitle = styled.h3`
  margin: 0;
  font-size: 16px;
`;

export const CloseButton = styled.button`
  background: transparent;
  border: none;
  font-size: 18px;
  cursor: pointer;
`;

export const SwatchGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
  margin: 12px 0 16px;
`;

export const ColorSwatch = styled.button<{ color: string; selected?: boolean }>`
  width: 48px;
  height: 32px;
  border-radius: 6px;
  border: 2px solid ${(p) => (p.selected ? "#333" : "transparent")};
  background: ${(p) => p.color};
  cursor: pointer;
`;

export const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;

export const DangerButton = styled.button`
  padding: 8px 12px;
  background: #f44336;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:disabled {
    background: #bdbdbd; /* grey for disabled */
    color: #fff;
    opacity: 1; /* keep readable */
    cursor: not-allowed;
  }
`;

export const SecondaryButton = styled.button`
  padding: 8px 12px;
  background: #e0e0e0;
  color: #333;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

export const PrimaryButton = styled.button`
  padding: 8px 12px;
  background: #2196f3; /* Blue 500 */
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.15s ease;
  &:hover:not(:disabled) {
    background: #1976d2; /* Blue 700 */
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
