import React from "react";
import { ROW_COLOR_PALETTE } from "../constants/rowColors";
import type { RowDef } from "../hooks/useRowManager";
import {
  CloseButton,
  ColorSwatch,
  DangerButton,
  ModalActions,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalTitle,
  PrimaryButton,
  SwatchGrid,
} from "../styles/rowSettings.styles";

type Props = {
  open: boolean;
  row: RowDef | null;
  minRows: number;
  totalRows: number;
  onClose: () => void;
  onDelete: () => void;
  onSave: (name: string, color: string) => void;
};

const RowSettingsModal: React.FC<Props> = ({
  open,
  row,
  minRows,
  totalRows,
  onClose,
  onDelete,
  onSave,
}) => {
  // Hooks must be called unconditionally
  const [name, setName] = React.useState<string>(row?.name ?? "");
  const [selectedColor, setSelectedColor] = React.useState<string>(row?.color ?? "");

  React.useEffect(() => {
    setName(row?.name ?? "");
    setSelectedColor(row?.color ?? "");
  }, [row]);

  if (!open || !row) return null;

  const canDelete = totalRows > minRows;
  const canSave = name.trim().length > 0;

  const handleSave = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const colorToSave = selectedColor || row.color;
    onSave(trimmed, colorToSave);
    onClose();
  };

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
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              // IME変換中のEnterは無視
              if (e.key === "Enter" && !e.nativeEvent.isComposing) {
                handleSave();
              }
            }}
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: 6,
              border: "1px solid #ccc",
              borderRadius: 4,
              marginBottom: 10,
            }}
            aria-label="行ラベル名"
          />
        </div>

        <SwatchGrid>
          {ROW_COLOR_PALETTE.map((c) => (
            <ColorSwatch
              key={c}
              color={c}
              selected={selectedColor ? selectedColor === c : row.color === c}
              onClick={() => setSelectedColor(c)}
              aria-label={`色 ${c}`}
              title={`色 ${c}`}
            />
          ))}
        </SwatchGrid>

        <ModalActions>
          <DangerButton
            onClick={onDelete}
            disabled={!canDelete}
            title={canDelete ? "この行を削除" : `最小${minRows}行です`}
          >
            この行を削除
          </DangerButton>
          <PrimaryButton
            onClick={handleSave}
            disabled={!canSave}
            title={canSave ? "保存" : "名前を入力してください"}
          >
            保存
          </PrimaryButton>
        </ModalActions>
      </ModalContent>
    </ModalOverlay>
  );
};

export default RowSettingsModal;
