import React from "react";
import { ROW_COLOR_PALETTE } from "../constants/rowColors";
import {
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalTitle,
  CloseButton,
  SwatchGrid,
  ColorSwatch,
  ModalActions,
  DangerButton,
  SecondaryButton,
} from "../styles/rowSettings.styles";
import type { RowDef } from "../hooks/useRowManager";

type Props = {
  open: boolean;
  row: RowDef | null;
  minRows: number;
  totalRows: number;
  onClose: () => void;
  onSelectColor: (color: string) => void;
  onDelete: () => void;
};

const RowSettingsModal: React.FC<Props> = ({
  open,
  row,
  minRows,
  totalRows,
  onClose,
  onSelectColor,
  onDelete,
}) => {
  if (!open || !row) return null;

  const canDelete = totalRows > minRows;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>行の設定</ModalTitle>
          <CloseButton onClick={onClose} aria-label="閉じる">
            ×
          </CloseButton>
        </ModalHeader>

        <div style={{ marginBottom: 8 }}>
          <div style={{ fontSize: 12, color: "#555", marginBottom: 6 }}>ラベル: {row.name}</div>
          <div style={{ fontSize: 12, color: "#555" }}>色を選択:</div>
        </div>

        <SwatchGrid>
          {ROW_COLOR_PALETTE.map((c) => (
            <ColorSwatch
              key={c}
              color={c}
              selected={row.color === c}
              onClick={() => onSelectColor(c)}
              aria-label={`色 ${c}`}
              title={`色 ${c}`}
            />)
          )}
        </SwatchGrid>

        <ModalActions>
          <DangerButton onClick={onDelete} disabled={!canDelete} title={canDelete ? "この行を削除" : `最小${minRows}行です`}>
            この行を削除
          </DangerButton>
          <SecondaryButton onClick={onClose}>閉じる</SecondaryButton>
        </ModalActions>
      </ModalContent>
    </ModalOverlay>
  );
};

export default RowSettingsModal;

