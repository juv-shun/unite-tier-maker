import { renderHook, act } from "@testing-library/react";
import { useTierManagement } from "../../hooks/useTierManagement";
import { TierId, PokemonAssignment } from "../../types";

// localStorageのモック
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

// コンソールログをモック
jest.spyOn(console, "log").mockImplementation(() => {});
jest.spyOn(console, "error").mockImplementation(() => {});

describe("useTierManagement - 配置状態判定ロジック", () => {
  beforeEach(() => {
    localStorageMock.clear();
    jest.clearAllMocks();
  });

  describe("isPlacedInAnyTier 配置状態判定", () => {
    test("Tierに配置されているポケモンはtrueを返す", () => {
      const { result } = renderHook(() => useTierManagement());

      // ポケモンを S Tier に配置
      act(() => {
        result.current.handleMovePokemon(
          { pokemonId: "pikachu" },
          "attacker-S",
          0,
          false
        );
      });

      // isPlacedInAnyTier関数を使ってpikachu が配置されているかチェック
      const isPlaced = result.current.isPlacedInAnyTier("pikachu");
      expect(isPlaced).toBe(true);
    });

    test("未配置のポケモンはfalseを返す", () => {
      const { result } = renderHook(() => useTierManagement());

      // 何も配置せずに確認
      const isPlaced = result.current.isPlacedInAnyTier("pikachu");
      expect(isPlaced).toBe(false);
    });

    test("複数Tierに配置されているポケモンはtrueを返す", () => {
      const { result } = renderHook(() => useTierManagement());

      // ポケモンを複数のTierに配置
      act(() => {
        result.current.handleMovePokemon(
          { pokemonId: "pikachu" },
          "attacker-S",
          0,
          false
        );
      });

      act(() => {
        result.current.handleMovePokemon(
          { pokemonId: "pikachu" },
          "attacker-A",
          0,
          false
        );
      });

      const isPlaced = result.current.isPlacedInAnyTier("pikachu");
      expect(isPlaced).toBe(true);
    });

    test("同じポケモンが未配置エリアとTierの両方にある場合はtrueを返す", () => {
      const { result } = renderHook(() => useTierManagement());

      // 初期状態では全てのポケモンが未配置エリアにある
      // ポケモンをTierに配置（コピー作成）
      act(() => {
        result.current.handleMovePokemon(
          { pokemonId: "pikachu" },
          "attacker-S",
          0,
          false
        );
      });

      // 未配置エリアにも残り、Tierにも配置されている状態
      const isPlaced = result.current.isPlacedInAnyTier("pikachu");
      expect(isPlaced).toBe(true);
    });

    test("削除されたポケモンは未配置エリアのみに戻りfalseを返す", () => {
      const { result } = renderHook(() => useTierManagement());

      // ポケモンをTierに配置
      act(() => {
        result.current.handleMovePokemon(
          { pokemonId: "pikachu" },
          "attacker-S",
          0,
          false
        );
      });

      // 配置されていることを確認
      expect(result.current.isPlacedInAnyTier("pikachu")).toBe(true);

      // Tierからポケモンを削除
      const tieredPokemon = result.current.getPokemonsByLocation("attacker-S");
      if (tieredPokemon.length > 0) {
        const pokemonWithAssignment = tieredPokemon[0] as any; // タイプ拡張のため
        if (pokemonWithAssignment.assignmentId) {
          act(() => {
            result.current.handleDeletePokemon("pikachu", pokemonWithAssignment.assignmentId);
          });
        }
      }

      // 削除後は未配置エリアのみに存在するためfalse
      expect(result.current.isPlacedInAnyTier("pikachu")).toBe(false);
    });
  });
});