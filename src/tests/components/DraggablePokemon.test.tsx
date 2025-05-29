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
    test("配置済みポケモンはgrayscaleフィルターが適用される", () => {
      render(
        <DraggablePokemon
          pokemon={{ ...mockPokemon, isPlacedElsewhere: true }}
          index={0}
          tierLocation={TierId.UNASSIGNED}
          onMove={mockOnMove}
          onDelete={mockOnDelete}
        />
      );

      const pokemonImage = screen.getByAltText("ピカチュウ");
      expect(pokemonImage).toHaveStyle({ filter: "grayscale(100%)" });
    });

    test("未配置ポケモンは通常表示される", () => {
      render(
        <DraggablePokemon
          pokemon={{ ...mockPokemon, isPlacedElsewhere: false }}
          index={0}
          tierLocation={TierId.UNASSIGNED}
          onMove={mockOnMove}
          onDelete={mockOnDelete}
        />
      );

      const pokemonImage = screen.getByAltText("ピカチュウ");
      expect(pokemonImage).not.toHaveStyle({ filter: "grayscale(100%)" });
    });

    test("Tier内のポケモンには視覚的区別が適用されない", () => {
      render(
        <DraggablePokemon
          pokemon={{ ...mockPokemon, isPlacedElsewhere: true }}
          index={0}
          tierLocation="attacker-S"
          onMove={mockOnMove}
          onDelete={mockOnDelete}
        />
      );

      const pokemonImage = screen.getByAltText("ピカチュウ");
      // Tier内では isPlacedElsewhere が true でも grayscale は適用されない
      expect(pokemonImage).not.toHaveStyle({ filter: "grayscale(100%)" });
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

      const pokemonImage = screen.getByAltText("ピカチュウ");
      expect(pokemonImage).toHaveStyle({ filter: "grayscale(100%)" });
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

      const pokemonImage = screen.getByAltText("ピカチュウ");
      expect(pokemonImage).not.toHaveStyle({ filter: "grayscale(100%)" });
    });
  });

  describe("プロパティの処理", () => {
    test("isPlacedElsewhere プロパティが未定義の場合は通常表示", () => {
      render(
        <DraggablePokemon
          pokemon={{ ...mockPokemon, isPlacedElsewhere: undefined }}
          index={0}
          tierLocation={TierId.UNASSIGNED}
          onMove={mockOnMove}
          onDelete={mockOnDelete}
        />
      );

      const pokemonImage = screen.getByAltText("ピカチュウ");
      expect(pokemonImage).not.toHaveStyle({ filter: "grayscale(100%)" });
    });

    test("未配置エリア以外では isPlacedElsewhere の値に関係なく通常表示", () => {
      render(
        <DraggablePokemon
          pokemon={{ ...mockPokemon, isPlacedElsewhere: true }}
          index={0}
          tierLocation="attacker-A"
          onMove={mockOnMove}
          onDelete={mockOnDelete}
        />
      );

      const pokemonImage = screen.getByAltText("ピカチュウ");
      expect(pokemonImage).not.toHaveStyle({ filter: "grayscale(100%)" });
    });
  });
});