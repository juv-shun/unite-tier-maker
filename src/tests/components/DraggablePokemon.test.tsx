import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import DraggablePokemon from "../../components/DraggablePokemon";
import { TierId } from "../../types";

// react-dndをモック
jest.mock("react-dnd", () => ({
  useDrag: () => [{ isDragging: false }, jest.fn(), jest.fn()],
  useDrop: () => [{ isOver: false, canDrop: true }, jest.fn()],
}));

describe("DraggablePokemon - 視覚的区別機能", () => {
  const mockPokemon = {
    id: "pikachu",
    name: "ピカチュウ",
    imageUrl: "https://example.com/pikachu.png",
    assignmentId: "assignment-1",
    isFromUnassignedArea: false,
  };

  const mockOnMove = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("未配置エリアでの視覚的区別", () => {
    test("配置済みポケモンには済マークが表示される", () => {
      render(
        <DraggablePokemon
          pokemon={{ ...mockPokemon, isPlacedElsewhere: true }}
          index={0}
          tierLocation={TierId.UNASSIGNED}
          onMove={mockOnMove}
          onDelete={mockOnDelete}
        />
      );

      const placedMark = screen.getByText("✓");
      expect(placedMark).toBeInTheDocument();
    });

    test("未配置ポケモンには済マークが表示されない", () => {
      render(
        <DraggablePokemon
          pokemon={{ ...mockPokemon, isPlacedElsewhere: false }}
          index={0}
          tierLocation={TierId.UNASSIGNED}
          onMove={mockOnMove}
          onDelete={mockOnDelete}
        />
      );

      const placedMark = screen.queryByText("✓");
      expect(placedMark).not.toBeInTheDocument();
    });

    test("Tier内のポケモンには済マークが表示されない", () => {
      render(
        <DraggablePokemon
          pokemon={{ ...mockPokemon, isPlacedElsewhere: true }}
          index={0}
          tierLocation="attacker-S"
          onMove={mockOnMove}
          onDelete={mockOnDelete}
        />
      );

      const placedMark = screen.queryByText("✓");
      // Tier内では isPlacedElsewhere が true でも済マークは表示されない
      expect(placedMark).not.toBeInTheDocument();
    });
  });

  describe("初期状態での表示", () => {
    test("ページ読み込み時に正しい視覚状態で表示される", () => {
      // 初期状態で配置済みのポケモン
      render(
        <DraggablePokemon
          pokemon={{ ...mockPokemon, isPlacedElsewhere: true }}
          index={0}
          tierLocation={TierId.UNASSIGNED}
          onMove={mockOnMove}
          onDelete={mockOnDelete}
        />
      );

      const placedMark = screen.getByText("✓");
      expect(placedMark).toBeInTheDocument();
    });

    test("初期状態で未配置のポケモンは通常表示", () => {
      render(
        <DraggablePokemon
          pokemon={{ ...mockPokemon, isPlacedElsewhere: false }}
          index={0}
          tierLocation={TierId.UNASSIGNED}
          onMove={mockOnMove}
          onDelete={mockOnDelete}
        />
      );

      const placedMark = screen.queryByText("✓");
      expect(placedMark).not.toBeInTheDocument();
    });
  });

  describe("プロパティの処理", () => {
    test("isPlacedElsewhere プロパティが未定義の場合は済マークが表示されない", () => {
      render(
        <DraggablePokemon
          pokemon={{ ...mockPokemon, isPlacedElsewhere: undefined }}
          index={0}
          tierLocation={TierId.UNASSIGNED}
          onMove={mockOnMove}
          onDelete={mockOnDelete}
        />
      );

      const placedMark = screen.queryByText("✓");
      expect(placedMark).not.toBeInTheDocument();
    });

    test("未配置エリア以外では isPlacedElsewhere の値に関係なく済マークが表示されない", () => {
      render(
        <DraggablePokemon
          pokemon={{ ...mockPokemon, isPlacedElsewhere: true }}
          index={0}
          tierLocation="attacker-A"
          onMove={mockOnMove}
          onDelete={mockOnDelete}
        />
      );

      const placedMark = screen.queryByText("✓");
      expect(placedMark).not.toBeInTheDocument();
    });
  });
});
