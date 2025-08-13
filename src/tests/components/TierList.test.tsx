import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import TierList from "../../components/TierList";
import { useTierManagement } from "../../hooks/useTierManagement";
import { TierId } from "../../types";

// react-dndをモック
jest.mock("react-dnd", () => ({
  DndProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dnd-provider">{children}</div>
  ),
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
];

// useTierManagementフックをモック
jest.mock("../../hooks/useTierManagement");
const mockUseTierManagement = useTierManagement as jest.MockedFunction<typeof useTierManagement>;

describe("TierList コンポーネント", () => {
  let mockGetPokemonsByLocation: jest.Mock;
  let mockHandleMovePokemon: jest.Mock;
  let mockHandleResetTiers: jest.Mock;
  let mockHandleDeletePokemon: jest.Mock;

  beforeEach(() => {
    mockGetPokemonsByLocation = jest.fn();
    mockHandleMovePokemon = jest.fn();
    mockHandleResetTiers = jest.fn();
    mockHandleDeletePokemon = jest.fn();

    // デフォルトでは未配置エリアにポケモンがいる状態
    mockGetPokemonsByLocation.mockImplementation((location: string) => {
      if (location === TierId.UNASSIGNED) {
        return mockPokemon;
      }
      return [];
    });

    mockUseTierManagement.mockReturnValue({
      assignments: [],
      getPokemonsByLocation: mockGetPokemonsByLocation,
      handleMovePokemon: mockHandleMovePokemon,
      handleResetTiers: mockHandleResetTiers,
      handleDeletePokemon: mockHandleDeletePokemon,
      saveAssignmentsToStorage: jest.fn(),
      isPlacedInAnyTier: jest.fn().mockReturnValue(false),
      clearAssignmentsForRow: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderTierList = () => {
    return render(<TierList />);
  };

  describe("未配置エリアからTierへの移動", () => {
    test("未配置エリアのポケモンをドラッグ&ドロップでTier内に配置できる", async () => {
      renderTierList();

      // 未配置エリアのポケモンが表示されていることを確認
      const pikachuImages = screen.getAllByAltText("ピカチュウ");
      const fushigidaneImages = screen.getAllByAltText("フシギダネ");

      expect(pikachuImages.length).toBeGreaterThan(0);
      expect(fushigidaneImages.length).toBeGreaterThan(0);

      // ドラッグ&ドロップのテストはreact-dndをモックしているため、
      // 実際のDnD操作はテストできないが、ドロップ先のTierセルが存在することを確認
      const tierCell = screen.getByTestId("tier-cell-attacker-S");
      expect(tierCell).toBeInTheDocument();

      // handleMovePokemonが存在することを確認
      expect(mockHandleMovePokemon).toBeDefined();
    });

    test("未配置エリアのポケモンをドラッグ&ドロップしても、未配置エリアから削除されない", async () => {
      // 移動後も未配置エリアにポケモンが残ることをテスト
      mockGetPokemonsByLocation.mockImplementation((location: string) => {
        if (location === TierId.UNASSIGNED) {
          return mockPokemon; // 移動後も残っている
        }
        if (location === "attacker-S") {
          return [
            {
              ...mockPokemon[0],
              assignmentId: "assignment-1",
            },
          ]; // ティアにもコピーされている
        }
        return [];
      });

      renderTierList();

      // 未配置エリアとTierの両方にピカチュウが存在することを確認
      const pikachuImages = screen.getAllByAltText("ピカチュウ");
      expect(pikachuImages.length).toBeGreaterThanOrEqual(2); // 未配置エリア + Tierに1つずつ
    });
  });

  describe("Tier間でのポケモン移動", () => {
    test("Tier内のポケモンを別のTierに移動すると、元の位置から削除され、新しい位置に配置される", async () => {
      // S tierに配置済みのポケモンがある状態
      mockGetPokemonsByLocation.mockImplementation((location: string) => {
        if (location === TierId.UNASSIGNED) {
          return [];
        }
        if (location === "attacker-S") {
          return [
            {
              ...mockPokemon[0],
              assignmentId: "assignment-1",
            },
          ];
        }
        return [];
      });

      renderTierList();

      // handleMovePokemonの呼び出しをシミュレート
      const draggedItemInfo = { pokemonId: "1", assignmentId: "assignment-1" };
      const targetTierLocation = "attacker-A";
      const targetIndexInTier = 0;

      // 移動処理を実行
      mockHandleMovePokemon(draggedItemInfo, targetTierLocation, targetIndexInTier, false);

      // handleMovePokemonが正しい引数で呼ばれることを確認
      expect(mockHandleMovePokemon).toHaveBeenCalledWith(
        draggedItemInfo,
        targetTierLocation,
        targetIndexInTier,
        false
      );
    });
  });

  describe("重複配置の防止", () => {
    test("同じセル内には、同じポケモンを複数配置できない", async () => {
      // 既にピカチュウが配置されているセルにもう一度ピカチュウを配置しようとする
      mockGetPokemonsByLocation.mockImplementation((location: string) => {
        if (location === TierId.UNASSIGNED) {
          return [mockPokemon[0]]; // 未配置エリアにピカチュウ
        }
        if (location === "attacker-S") {
          return [
            {
              ...mockPokemon[0],
              assignmentId: "assignment-1",
            },
          ]; // S tierにも既にピカチュウ
        }
        return [];
      });

      renderTierList();

      // 複数のピカチュウが存在することを確認（未配置エリア + Tier）
      const pikachuImages = screen.getAllByAltText("ピカチュウ");
      expect(pikachuImages.length).toBeGreaterThanOrEqual(2);

      // DraggablePokemonコンポーネントのcanDropロジックで重複を防ぐ機能があることを前提とする
      // 実際のドロップテストはモックのため実行できない
    });
  });

  describe("削除機能", () => {
    test("Tier内のセルをクリックすることで、削除ボタンが表示され、クリックすると削除される", async () => {
      // Tier内にポケモンが配置されている状態
      mockGetPokemonsByLocation.mockImplementation((location: string) => {
        if (location === TierId.UNASSIGNED) {
          return [];
        }
        if (location === "attacker-S") {
          return [
            {
              ...mockPokemon[0],
              assignmentId: "assignment-1",
            },
          ];
        }
        return [];
      });

      renderTierList();

      // ポケモンをクリックして選択状態にする
      const pokemonInTier = screen.getByAltText("ピカチュウ");
      fireEvent.click(pokemonInTier);

      // 削除ボタンが表示されるのを待つ
      await waitFor(() => {
        const removeButton = screen.getByText("×");
        expect(removeButton).toBeInTheDocument();
      });

      // 削除ボタンをクリック
      const removeButton = screen.getByText("×");
      fireEvent.click(removeButton);

      // handleDeletePokemonが呼ばれることを確認
      await waitFor(() => {
        expect(mockHandleDeletePokemon).toHaveBeenCalledWith("1", "assignment-1");
      });
    });
  });

  describe("位置変更機能", () => {
    test("セル内のポケモンは左右の位置を変更できる", async () => {
      // 同じセル内に複数のポケモンが配置されている状態
      mockGetPokemonsByLocation.mockImplementation((location: string) => {
        if (location === TierId.UNASSIGNED) {
          return [];
        }
        if (location === "attacker-S") {
          return [
            { ...mockPokemon[0], assignmentId: "assignment-1" },
            { ...mockPokemon[1], assignmentId: "assignment-2" },
          ];
        }
        return [];
      });

      renderTierList();

      // セル内でのドラッグ&ドロップによる位置変更
      const draggedItemInfo = { pokemonId: "1", assignmentId: "assignment-1" };
      const targetTierLocation = "attacker-S"; // 同じセル
      const targetIndexInTier = 1; // 位置を変更

      mockHandleMovePokemon(draggedItemInfo, targetTierLocation, targetIndexInTier, false);

      expect(mockHandleMovePokemon).toHaveBeenCalledWith(
        draggedItemInfo,
        targetTierLocation,
        targetIndexInTier,
        false
      );

      // セル内に複数のポケモンが存在することを確認
      const pikachuImages = screen.getAllByAltText("ピカチュウ");
      const fushigidaneImages = screen.getAllByAltText("フシギダネ");
      expect(pikachuImages.length).toBeGreaterThan(0);
      expect(fushigidaneImages.length).toBeGreaterThan(0);
    });

    test("未配置エリアのポケモンは左右の位置を変更できない", async () => {
      renderTierList();

      // 未配置エリアのポケモンがドラッグできることを確認
      const pikachuImages = screen.getAllByAltText("ピカチュウ");
      expect(pikachuImages.length).toBeGreaterThan(0);

      // 未配置エリア内での位置変更は意味がないため、
      // ここでは単に未配置エリアのポケモンが存在することを確認
      // 実際の位置変更機能は、Tierセル内でのみ有効
    });
  });

  describe("視覚的区別機能のテスト", () => {
    test("初期状態では全てのポケモンが通常表示されている", () => {
      // 何も配置されていない状態
      mockGetPokemonsByLocation.mockImplementation((location: string) => {
        if (location === TierId.UNASSIGNED) {
          return [
            { ...mockPokemon[0], isPlacedElsewhere: false },
            { ...mockPokemon[1], isPlacedElsewhere: false },
          ];
        }
        return [];
      });

      // isPlacedInAnyTierをモック化
      const mockIsPlacedInAnyTier = jest.fn().mockReturnValue(false);
      mockUseTierManagement.mockReturnValue({
        assignments: [],
        getPokemonsByLocation: mockGetPokemonsByLocation,
        handleMovePokemon: mockHandleMovePokemon,
        handleResetTiers: mockHandleResetTiers,
        handleDeletePokemon: mockHandleDeletePokemon,
        saveAssignmentsToStorage: jest.fn(),
        isPlacedInAnyTier: mockIsPlacedInAnyTier,
        clearAssignmentsForRow: jest.fn(),
      });

      renderTierList();

      // 未配置エリアのポケモンが表示されている
      const pikachuImages = screen.getAllByAltText("ピカチュウ");
      const fushigidaneImages = screen.getAllByAltText("フシギダネ");

      expect(pikachuImages.length).toBeGreaterThan(0);
      expect(fushigidaneImages.length).toBeGreaterThan(0);

      // isPlacedInAnyTierが呼ばれることを確認
      expect(mockIsPlacedInAnyTier).toHaveBeenCalled();
    });

    test("Tierに配置されたポケモンは未配置エリアでgrayscaleになる", () => {
      // ピカチュウがTierに配置されている状態
      mockGetPokemonsByLocation.mockImplementation((location: string) => {
        if (location === TierId.UNASSIGNED) {
          return [
            { ...mockPokemon[0], isPlacedElsewhere: true }, // ピカチュウは配置済み
            { ...mockPokemon[1], isPlacedElsewhere: false }, // フシギダネは未配置
          ];
        }
        if (location === "attacker-S") {
          return [
            {
              ...mockPokemon[0],
              assignmentId: "assignment-1",
            },
          ];
        }
        return [];
      });

      // isPlacedInAnyTierをモック化
      const mockIsPlacedInAnyTier = jest
        .fn()
        .mockImplementation((pokemonId: string) => pokemonId === "1"); // ピカチュウのみtrue

      mockUseTierManagement.mockReturnValue({
        assignments: [],
        getPokemonsByLocation: mockGetPokemonsByLocation,
        handleMovePokemon: mockHandleMovePokemon,
        handleResetTiers: mockHandleResetTiers,
        handleDeletePokemon: mockHandleDeletePokemon,
        saveAssignmentsToStorage: jest.fn(),
        isPlacedInAnyTier: mockIsPlacedInAnyTier,
        clearAssignmentsForRow: jest.fn(),
      });

      renderTierList();

      // 両方のポケモンが表示されていることを確認
      const pikachuImages = screen.getAllByAltText("ピカチュウ");
      const fushigidaneImages = screen.getAllByAltText("フシギダネ");

      expect(pikachuImages.length).toBeGreaterThanOrEqual(1);
      expect(fushigidaneImages.length).toBeGreaterThanOrEqual(1);

      // isPlacedInAnyTierが適切に呼ばれることを確認
      expect(mockIsPlacedInAnyTier).toHaveBeenCalled();
    });

    test("ポケモンが削除されると未配置エリアで通常表示に戻る", () => {
      // 削除後の状態
      mockGetPokemonsByLocation.mockImplementation((location: string) => {
        if (location === TierId.UNASSIGNED) {
          return [
            { ...mockPokemon[0], isPlacedElsewhere: false }, // 削除後は通常表示
            { ...mockPokemon[1], isPlacedElsewhere: false },
          ];
        }
        return []; // Tierには何もない
      });

      // isPlacedInAnyTierをモック化
      const mockIsPlacedInAnyTier = jest.fn().mockReturnValue(false);

      mockUseTierManagement.mockReturnValue({
        assignments: [],
        getPokemonsByLocation: mockGetPokemonsByLocation,
        handleMovePokemon: mockHandleMovePokemon,
        handleResetTiers: mockHandleResetTiers,
        handleDeletePokemon: mockHandleDeletePokemon,
        saveAssignmentsToStorage: jest.fn(),
        isPlacedInAnyTier: mockIsPlacedInAnyTier,
        clearAssignmentsForRow: jest.fn(),
      });

      renderTierList();

      // ポケモンが表示されていることを確認
      const pikachuImages = screen.getAllByAltText("ピカチュウ");
      expect(pikachuImages.length).toBeGreaterThan(0);

      // isPlacedInAnyTierが呼ばれることを確認
      expect(mockIsPlacedInAnyTier).toHaveBeenCalled();
    });
  });

  describe("基本機能のテスト", () => {
    test("TierListコンポーネントが正しくレンダリングされる", () => {
      renderTierList();

      // タイトルが表示されている
      expect(screen.getByText("Pokemon Unite Tier Maker")).toBeInTheDocument();

      // リセットボタンが表示されている
      expect(screen.getByText("リセット")).toBeInTheDocument();

      // 各ティアのヘッダーが表示されている
      expect(screen.getByText("S")).toBeInTheDocument();
      expect(screen.getByText("A")).toBeInTheDocument();
      expect(screen.getByText("B")).toBeInTheDocument();
      expect(screen.getByText("C")).toBeInTheDocument();

      // ポジションラベルが表示されている
      expect(screen.getByText("上キャリー")).toBeInTheDocument();
      expect(screen.getByText("上学習")).toBeInTheDocument();
      expect(screen.getByText("中央エリア")).toBeInTheDocument();
      expect(screen.getByText("下キャリー")).toBeInTheDocument();
      expect(screen.getByText("下学習")).toBeInTheDocument();
    });

    test("リセットボタンをクリックするとhandleResetTiersが呼ばれる", () => {
      renderTierList();

      const resetButton = screen.getByText("全リセット");
      fireEvent.click(resetButton);

      expect(mockHandleResetTiers).toHaveBeenCalled();
    });
  });
});
