import React, { useState, useRef, useEffect } from "react";
import { LabelCell } from "../styles/TierList.styles";

interface EditableLabelProps {
  value: string;
  backgroundColor: string;
  onSave: (newValue: string) => void;
  onCancel?: () => void;
}

const EditableLabel: React.FC<EditableLabelProps> = ({
  value,
  backgroundColor,
  onSave,
  onCancel,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  const handleClick = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    const trimmedValue = editValue.trim();
    if (trimmedValue && trimmedValue !== value) {
      onSave(trimmedValue);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
    onCancel?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  const handleBlur = () => {
    handleSave();
  };

  if (isEditing) {
    return (
      <LabelCell backgroundColor={backgroundColor}>
        <input
          ref={inputRef}
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          style={{
            background: "transparent",
            border: "1px solid #666",
            borderRadius: "2px",
            padding: "2px 4px",
            fontSize: "inherit",
            color: "inherit",
            fontWeight: "inherit",
            width: "100%",
            minWidth: "80px",
          }}
        />
      </LabelCell>
    );
  }

  return (
    <LabelCell
      backgroundColor={backgroundColor}
      onClick={handleClick}
      style={{
        cursor: "pointer",
        position: "relative",
        transition: "all 0.2s ease",
        border: "2px solid transparent",
      }}
      title="クリックで編集"
      onMouseEnter={(e) => {
        e.currentTarget.style.border = "2px solid rgba(255, 255, 255, 0.6)";
        e.currentTarget.style.transform = "scale(1.02)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.border = "2px solid transparent";
        e.currentTarget.style.transform = "scale(1)";
      }}
    >
      {value}
      <span
        style={{
          position: "absolute",
          top: "4px",
          right: "4px",
          fontSize: "12px",
          opacity: 0.7,
          pointerEvents: "none",
        }}
      >
        ✏️
      </span>
    </LabelCell>
  );
};

export default EditableLabel;
