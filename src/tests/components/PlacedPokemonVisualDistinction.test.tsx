import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import TierList from "../../components/TierList";
import { useTierManagement } from "../../hooks/useTierManagement";
import { TierId } from "../../types";

// react-dndをモック
jest.mock("react-dnd", () => ({
  DndProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="dnd-provider">{children}</div>,
  useDrag: () => [{ isDragging: false }, jest.fn(), jest.fn()],
  useDrop: () => [{ isOver: false, canDrop: true }, jest.fn()],
}));

jest.mock("react-dnd-html5-backend", () => ({
  HTML5Backend: {},
}));

// モックデータ
const mockPokemon = [
  {
    id: "1",
    name: "ピカチュウ",
    imageUrl: "/images/pokemon/pikachu.png",
  },
  {
    id: "2",
    name: "フシギダネ",
    imageUrl: "/images/pokemon/bulbasaur.png",
  },
  {
    id: "3",
    name: "ヒトカゲ",
    imageUrl: "/images/pokemon/charmander.png",
  },
];

// useTierManagementフックをモック
jest.mock("../../hooks/useTierManagement");
const mockUseTierManagement = useTierManagement as jest.MockedFunction<typeof useTierManagement>;

describe("配置済みポケモンの視覚的区別", () => {
  let mockGetPokemonsByLocation: jest.Mock;
  let mockGetPlacedPokemonIds: jest.Mock;
  let mockHandleMovePokemon: jest.Mock;
  let mockHandleResetTiers: jest.Mock;
  let mockHandleDeletePokemon: jest.Mock;

  beforeEach(() => {
    mockGetPokemonsByLocation = jest.fn();
    mockGetPlacedPokemonIds = jest.fn();
    mockHandleMovePokemon = jest.fn();
    mockHandleResetTiers = jest.fn();
    mockHandleDeletePokemon = jest.fn();

    mockUseTierManagement.mockReturnValue({
      assignments: [],
      getPokemonsByLocation: mockGetPokemonsByLocation,
      getPlacedPokemonIds: mockGetPlacedPokemonIds,
      handleMovePokemon: mockHandleMovePokemon,
      handleResetTiers: mockHandleResetTiers,
      handleDeletePokemon: mockHandleDeletePokemon,
      saveAssignmentsToStorage: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderTierList = () => {
    return render(<TierList />);
  };

  describe("初期表示時の視覚的区別", () => {
    test("Tier表が空の場合、未配置エリアの全ポケモンが通常表示されること", () => {
      // 全てのポケモンが未配置エリアにある状態
      mockGetPokemonsByLocation.mockImplementation((location: string) => {
        if (location === TierId.UNASSIGNED) {
          return mockPokemon;
        }
        return [];
      });

      // 配置済みポケモンIDは空
      mockGetPlacedPokemonIds.mockReturnValue(new Set());

      renderTierList();

      // 未配置エリアの全ポケモンにis-placed-in-tierクラスが付与されていないことを確認
      const pikachuImage = screen.getByAltText("ピカチュウ");
      const fushigidaneImage = screen.getByAltText("フシギダネ");
      const hitokageImage = screen.getByAltText("ヒトカゲ");

      expect(pikachuImage).not.toHaveClass("is-placed-in-tier");
      expect(fushigidaneImage).not.toHaveClass("is-placed-in-tier");
      expect(hitokageImage).not.toHaveClass("is-placed-in-tier");
    });

    test("Tier表にポケモンが配置されている状態でページがロードされた場合、未配置エリアの該当ポケモンにis-placed-in-tierクラスが付与されること", () => {
      // ピカチュウとフシギダネがTierに配置済み、ヒトカゲは未配置
      mockGetPokemonsByLocation.mockImplementation((location: string) => {
        if (location === TierId.UNASSIGNED) {
          return mockPokemon; // 未配置エリアには全ポケモンが表示される
        }
        if (location === "attacker-S") {
          return [{
            ...mockPokemon[0],
            assignmentId: "assignment-1"
          }]; // ピカチュウがS tierに配置
        }
        if (location === "speedster-A") {
          return [{
            ...mockPokemon[1],
            assignmentId: "assignment-2"
          }]; // フシギダネがA tierに配置
        }
        return [];
      });

      // 配置済みポケモンIDにピカチュウとフシギダネを含める
      mockGetPlacedPokemonIds.mockReturnValue(new Set(["1", "2"]));

      renderTierList();

      // 未配置エリアのピカチュウとフシギダネにis-placed-in-tierクラスが付与されていることを確認
      const unplacedArea = screen.getByTestId("unplaced-area");
      const pikachuInUnplaced = unplacedArea.querySelector('[alt="ピカチュウ"]');
      const fushigidaneInUnplaced = unplacedArea.querySelector('[alt="フシギダネ"]');
      const hitokageInUnplaced = unplacedArea.querySelector('[alt="ヒトカゲ"]');

      expect(pikachuInUnplaced).toHaveClass("is-placed-in-tier");
      expect(fushigidaneInUnplaced).toHaveClass("is-placed-in-tier");
      expect(hitokageInUnplaced).not.toHaveClass("is-placed-in-tier");
    });
  });

  describe("配置時の視覚的変化", () => {
    test("未配置エリアのポケモンをTierにドラッグ&ドロップした際、未配置エリアの同じポケモンにis-placed-in-tierクラスが付与されること", () => {
      // ピカチュウが配置された状態をシミュレート
      mockGetPokemonsByLocation.mockImplementation((location: string) => {
        if (location === TierId.UNASSIGNED) {
          return mockPokemon; // 未配置エリアには全て表示される
        }
        if (location === "attacker-S") {
          return [{
            ...mockPokemon[0],
            assignmentId: "assignment-1"
          }]; // ピカチュウがS tierに配置
        }
        return [];
      });

      mockGetPlacedPokemonIds.mockReturnValue(new Set(["1"])); // ピカチュウが配置済み

      renderTierList();

      // 配置後、未配置エリアのピカチュウにis-placed-in-tierクラスが付与されることを確認
      const unplacedArea = screen.getByTestId("unplaced-area");
      const pikachuInUnplaced = unplacedArea.querySelector('[alt="ピカチュウ"]');
      expect(pikachuInUnplaced).toHaveClass("is-placed-in-tier");
    });
  });

  describe("削除時の視覚的変化", () => {
    test("Tier上のポケモンを削除した際、未配置エリアの同じポケモンからis-placed-in-tierクラスが削除されること", () => {
      // ピカチュウが削除された状態をシミュレート
      mockGetPokemonsByLocation.mockImplementation((location: string) => {
        if (location === TierId.UNASSIGNED) {
          return mockPokemon; // 未配置エリアには残っている
        }
        return []; // 全てのTierから削除
      });

      mockGetPlacedPokemonIds.mockReturnValue(new Set()); // 配置済みポケモンなし

      renderTierList();

      // 削除後、未配置エリアのピカチュウからis-placed-in-tierクラスが削除されることを確認
      const unplacedArea = screen.getByTestId("unplaced-area");
      const pikachuInUnplaced = unplacedArea.querySelector('[alt="ピカチュウ"]');
      expect(pikachuInUnplaced).not.toHaveClass("is-placed-in-tier");
    });

    test("Tier上のポケモンを未配置エリアにドラッグ&ドロップした際、未配置エリアの同じポケモンからis-placed-in-tierクラスが削除されること", () => {
      // ピカチュウが未配置エリアに戻された状態をシミュレート
      mockGetPokemonsByLocation.mockImplementation((location: string) => {
        if (location === TierId.UNASSIGNED) {
          return mockPokemon; // 未配置エリアには残っている
        }
        return []; // 全てのTierから削除
      });

      mockGetPlacedPokemonIds.mockReturnValue(new Set()); // 配置済みポケモンなし

      renderTierList();

      // 移動後、未配置エリアのピカチュウからis-placed-in-tierクラスが削除されることを確認
      const unplacedArea = screen.getByTestId("unplaced-area");
      const pikachuInUnplaced = unplacedArea.querySelector('[alt="ピカチュウ"]');
      expect(pikachuInUnplaced).not.toHaveClass("is-placed-in-tier");
    });
  });

  describe("複数配置シナリオでの視覚的区別", () => {
    test("同じポケモンが複数のTierに配置されている場合でも、未配置エリアのポケモンにis-placed-in-tierクラスが付与されること", () => {
      // ピカチュウが複数のTierに配置されている状態
      mockGetPokemonsByLocation.mockImplementation((location: string) => {
        if (location === TierId.UNASSIGNED) {
          return mockPokemon;
        }
        if (location === "attacker-S") {
          return [{
            ...mockPokemon[0],
            assignmentId: "assignment-1"
          }]; // ピカチュウがS tierに配置
        }
        if (location === "attacker-A") {
          return [{
            ...mockPokemon[0],
            assignmentId: "assignment-2"
          }]; // 同じピカチュウがA tierにも配置
        }
        return [];
      });

      mockGetPlacedPokemonIds.mockReturnValue(new Set(["1"])); // ピカチュウが配置済み

      renderTierList();

      // 複数のTierに配置されていても、未配置エリアのピカチュウにはis-placed-in-tierクラスが1つだけ付与される
      const unplacedArea = screen.getByTestId("unplaced-area");
      const pikachuInUnplaced = unplacedArea.querySelector('[alt="ピカチュウ"]');
      expect(pikachuInUnplaced).toHaveClass("is-placed-in-tier");
    });

    test("同じポケモンの全ての配置が削除された場合のみ、未配置エリアのポケモンからis-placed-in-tierクラスが削除されること", () => {
      // 全てのTierから削除された状態
      mockGetPokemonsByLocation.mockImplementation((location: string) => {
        if (location === TierId.UNASSIGNED) {
          return mockPokemon;
        }
        return []; // 全てのTierから削除
      });

      mockGetPlacedPokemonIds.mockReturnValue(new Set()); // 配置済みポケモンなし

      renderTierList();

      // 全て削除された後、is-placed-in-tierクラスが削除されることを確認
      const unplacedArea = screen.getByTestId("unplaced-area");
      const fullyRemovedPikachuInUnplaced = unplacedArea.querySelector('[alt="ピカチュウ"]');
      expect(fullyRemovedPikachuInUnplaced).not.toHaveClass("is-placed-in-tier");
    });
  });
});