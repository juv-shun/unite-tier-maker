import { useState, useCallback, useMemo, useEffect } from "react";
import { Pokemon, pokemonList } from "../data/pokemon";
import { PokemonAssignment, TierId } from "../types";

// 型定義とTIERSは types と constants に移動しました

// 配置ID用のユニークIDを生成する関数
const generateAssignmentId = (): string => {
  return `assignment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const useTierManagement = () => {
  // ポケモンの元の順序を保持するマップを作成
  const pokemonOriginalOrderMap = useMemo(() => {
    const orderMap: Record<string, number> = {};
    pokemonList.forEach((pokemon, index) => {
      orderMap[pokemon.id] = index;
    });
    return orderMap;
  }, []);

  // localStorageから保存されたassignmentsを取得する関数
  const getSavedAssignments = useCallback((): PokemonAssignment[] | null => {
    try {
      const savedAssignments = localStorage.getItem("tierAssignments");
      console.log("localStorageから読み込まれた状態:", savedAssignments);
      if (savedAssignments) {
        const parsed = JSON.parse(savedAssignments);
        console.log("パース後の状態:", parsed);
        return parsed;
      }
    } catch (e) {
      console.error("localStorageからの状態復元に失敗しました:", e);
    }
    return null;
  }, []);

  // 初期状態を設定
  const initialAssignments = useMemo(() => {
    console.log("初期状態の設定を開始");
    let assignmentsToInitialize: PokemonAssignment[] = [];
    const savedAssignments = getSavedAssignments();

    if (savedAssignments && savedAssignments.length > 0) {
      console.log("保存された状態を使用します");
      assignmentsToInitialize = [...savedAssignments];
    } else {
      console.log("新しい初期状態を作成します（保存データなし）");
      // 保存された状態がない場合は初期状態を作成
      assignmentsToInitialize = pokemonList.map((pokemon, index) => ({
        id: generateAssignmentId(),
        pokemonId: pokemon.id,
        location: TierId.UNASSIGNED,
        position: index,
        isFromUnassignedArea: true,
      }));
    }

    // pokemonListに存在するが、assignmentsToInitializeに存在しないポケモンを未配置として追加
    const existingPokemonIds = new Set(assignmentsToInitialize.map((a) => a.pokemonId));
    pokemonList.forEach((pokemon, index) => {
      if (!existingPokemonIds.has(pokemon.id)) {
        console.log(`新しいポケモン ${pokemon.name} を未配置に追加します`);
        assignmentsToInitialize.push({
          id: generateAssignmentId(),
          pokemonId: pokemon.id,
          location: TierId.UNASSIGNED,
          position: pokemonOriginalOrderMap[pokemon.id] ?? index, // 元の順序を維持、なければ末尾
          isFromUnassignedArea: true,
        });
      }
    });

    // 未配置エリアのポケモンの順序を pokemonList の順序に合わせる
    // (TierId.UNASSIGNED のポケモンのみを対象とし、pokemonOriginalOrderMap を使ってソート)
    const unassignedToSort = assignmentsToInitialize.filter(
      (a) => a.location === TierId.UNASSIGNED
    );
    const otherAssignments = assignmentsToInitialize.filter(
      (a) => a.location !== TierId.UNASSIGNED
    );

    unassignedToSort.sort(
      (a, b) =>
        (pokemonOriginalOrderMap[a.pokemonId] ?? Infinity) -
        (pokemonOriginalOrderMap[b.pokemonId] ?? Infinity)
    );

    // ソートされた未配置ポケモンを他のポケモンと結合
    return [...otherAssignments, ...unassignedToSort];
  }, [getSavedAssignments, pokemonOriginalOrderMap]);

  // assignmentIdを追加して、同じポケモンが複数の場所に配置できるようにする
  const [assignments, setAssignments] = useState<PokemonAssignment[]>(initialAssignments);

  const getPokemonById = useCallback((id: string): Pokemon | undefined => {
    return pokemonList.find((pokemon) => pokemon.id === id);
  }, []);

  const getPokemonsByLocation = useCallback(
    (location: string): Pokemon[] => {
      // 未配置エリアの場合は元のポケモン順序を使用し、それ以外は位置でソート
      const filtered = assignments
        .filter((assignment) => assignment.location === location)
        .sort((a, b) => {
          if (location === TierId.UNASSIGNED) {
            // 未配置エリアでは元のポケモン順序（pokemonList内の順序）を使用
            return pokemonOriginalOrderMap[a.pokemonId] - pokemonOriginalOrderMap[b.pokemonId];
          }
          return a.position - b.position;
        });

      // 未配置エリアは同じポケモンが複数表示されないように重複排除
      const seen = new Set<string>();

      const result: (Pokemon & { assignmentId: string; isFromUnassignedArea: boolean })[] = [];

      filtered.forEach((assignment) => {
        if (location === TierId.UNASSIGNED) {
          if (seen.has(assignment.pokemonId)) {
            return; // skip duplicates
          }
          seen.add(assignment.pokemonId);
        }

        const pokemon = getPokemonById(assignment.pokemonId);
        if (!pokemon) return;

        result.push({
          ...pokemon,
          assignmentId: assignment.id,
          isFromUnassignedArea: assignment.isFromUnassignedArea,
        });
      });

      return result;
    },
    [assignments, getPokemonById, pokemonOriginalOrderMap]
  );

  // 指定されたTierに特定のポケモンIDが存在するかチェックする関数
  const isPokemonInTier = useCallback(
    (assignments: PokemonAssignment[], pokemonId: string, tierLocation: string): boolean => {
      return assignments.some((a) => a.pokemonId === pokemonId && a.location === tierLocation);
    },
    []
  );

  // ドラッグアンドドロップの引数をポケモンIDからアサインメントIDに変更し、外部へのドロップフラグを追加
  // localStorageに状態を保存する関数
  const saveAssignmentsToStorage = useCallback((assignments: PokemonAssignment[]) => {
    try {
      const assignmentsStr = JSON.stringify(assignments);
      console.log("localStorageに保存する状態:", assignmentsStr);
      localStorage.setItem("tierAssignments", assignmentsStr);
      // 保存されたことを確認
      console.log("保存後のlocalStorage:", localStorage.getItem("tierAssignments"));
    } catch (e) {
      console.error("localStorageへの保存に失敗しました:", e);
    }
  }, []);

  // 状態が変更されたらlocalStorageに保存
  useEffect(() => {
    console.log("状態が変更されました、localStorageに保存します");
    saveAssignmentsToStorage(assignments);
  }, [assignments, saveAssignmentsToStorage]);

  // 初回マウント時に一度localStorageに保存して確認
  useEffect(() => {
    console.log("コンポーネントがマウントされました");
    const savedData = localStorage.getItem("tierAssignments");
    console.log("現在のlocalStorage状態:", savedData);
    if (!savedData) {
      console.log("初期状態をlocalStorageに保存します");
      saveAssignmentsToStorage(assignments);
    }
  }, [assignments, saveAssignmentsToStorage]); // 依存配列に必要な値を追加

  const handleMovePokemon = useCallback(
    (
      draggedItemInfo: { pokemonId: string; assignmentId?: string },
      targetTierLocation: string,
      targetIndexInTier: number | undefined,
      isDroppedOutside: boolean = false
    ) => {
      setAssignments((prevAssignments) => {
        let assignmentsCopy = prevAssignments.map((a) => ({ ...a }));

        // エリア外にドロップされた場合の処理
        if (isDroppedOutside && draggedItemInfo.assignmentId) {
          // ドロップされたアサインメントIDを持つアサインメントを削除
          return assignmentsCopy.filter((a) => a.id !== draggedItemInfo.assignmentId);
        }

        // ドラッグされた要素を探す
        const draggedPokemonAssignment = draggedItemInfo.assignmentId
          ? assignmentsCopy.find((a) => a.id === draggedItemInfo.assignmentId)
          : assignmentsCopy.find(
              (a) => a.pokemonId === draggedItemInfo.pokemonId && a.location === TierId.UNASSIGNED
            );

        if (!draggedPokemonAssignment) return prevAssignments;

        // 未配置エリア以外では、同じポケモンを同じエリアに複数配置できないようにする
        // ただし、同じエリア内での移動（位置の変更）は許可する
        if (
          targetTierLocation !== TierId.UNASSIGNED &&
          draggedPokemonAssignment.location !== targetTierLocation
        ) {
          // 移動先のエリアに同じポケモンが存在するかチェック
          const hasDuplicate = isPokemonInTier(
            assignmentsCopy,
            draggedPokemonAssignment.pokemonId,
            targetTierLocation
          );
          if (hasDuplicate) {
            // 重複があるので移動を許可しない
            return prevAssignments;
          }
        }

        // 未配置エリアからのドラッグの場合は新しいアサインメントを作成
        if (
          draggedPokemonAssignment.location === TierId.UNASSIGNED &&
          !draggedItemInfo.assignmentId
        ) {
          // 新しいアサインメントを作成
          const newAssignment: PokemonAssignment = {
            id: generateAssignmentId(),
            pokemonId: draggedPokemonAssignment.pokemonId,
            location: targetTierLocation,
            position: 0, // 位置は後で再計算
            isFromUnassignedArea: false, // Tierに配置されるので、未配置エリアからではなくなる
          };

          // 各ロケーションごとの配置情報を得るために既存のアサインメントをフィルタリング
          const locationGroupedAssignments: Record<string, PokemonAssignment[]> = {};

          // すべてのロケーションキーを含むSetを作成
          const locationKeysSet = new Set<string>();
          locationKeysSet.add(targetTierLocation);

          // 現在のアサインメントから使用中のロケーションキーを追加
          assignmentsCopy.forEach((a) => {
            locationKeysSet.add(a.location);
          });

          // 各ロケーションごとにアサインメントをグループ化
          Array.from(locationKeysSet).forEach((locationKey) => {
            locationGroupedAssignments[locationKey] = assignmentsCopy
              .filter((a) => a.location === locationKey)
              .sort((a, b) => a.position - b.position);
          });

          // 新しいアサインメントを対象のロケーションに追加
          if (targetIndexInTier !== undefined) {
            locationGroupedAssignments[targetTierLocation].splice(
              targetIndexInTier,
              0,
              newAssignment
            );
          } else {
            locationGroupedAssignments[targetTierLocation].push(newAssignment);
          }

          // 位置情報を更新して最終的なアサインメントリストを作成
          const finalAssignments: PokemonAssignment[] = [];
          Object.entries(locationGroupedAssignments).forEach(([locationKey, assignments]) => {
            assignments.forEach((assignment, index) => {
              assignment.position = index;
              finalAssignments.push(assignment);
            });
          });

          return finalAssignments;
        } else {
          // Tier内でのドラッグ&ドロップの場合、アサインメントの場所を更新
          draggedPokemonAssignment.location = targetTierLocation;

          // 各ロケーションごとの配置情報を得るために既存のアサインメントをフィルタリング（ドラッグしているアイテムを除く）
          const filteredAssignments = assignmentsCopy.filter(
            (a) => a.id !== draggedPokemonAssignment.id
          );
          const locationGroupedAssignments: Record<string, PokemonAssignment[]> = {};

          // すべてのロケーションキーを含むSetを作成
          const locationKeysSet = new Set<string>();
          locationKeysSet.add(targetTierLocation);

          // 現在のアサインメントから使用中のロケーションキーを追加
          filteredAssignments.forEach((a) => {
            locationKeysSet.add(a.location);
          });

          // 各ロケーションごとにアサインメントをグループ化
          Array.from(locationKeysSet).forEach((locationKey) => {
            locationGroupedAssignments[locationKey] = filteredAssignments
              .filter((a) => a.location === locationKey)
              .sort((a, b) => a.position - b.position);
          });

          // ドラッグしているアイテムを適切な位置に挿入
          if (targetIndexInTier !== undefined) {
            locationGroupedAssignments[targetTierLocation].splice(
              targetIndexInTier,
              0,
              draggedPokemonAssignment
            );
          } else {
            locationGroupedAssignments[targetTierLocation].push(draggedPokemonAssignment);
          }

          // 位置情報を更新して最終的なアサインメントリストを作成
          const finalAssignments: PokemonAssignment[] = [];
          Object.entries(locationGroupedAssignments).forEach(([locationKey, assignments]) => {
            assignments.forEach((assignment, index) => {
              assignment.position = index;
              finalAssignments.push(assignment);
            });
          });

          return finalAssignments;
        }
      });
    },
    [isPokemonInTier]
  );

  // すべてのポケモンを未配置状態にリセット
  const handleResetTiers = useCallback(() => {
    const resetAssignments = pokemonList.map((pokemon, index) => ({
      id: generateAssignmentId(),
      pokemonId: pokemon.id,
      location: TierId.UNASSIGNED,
      position: index,
      isFromUnassignedArea: true,
    }));
    setAssignments(resetAssignments);
    // リセット時にlocalStorageもクリア
    localStorage.removeItem("tierAssignments");
    console.log("Tierリセット: localStorageをクリアしました");
  }, []);

  // ポケモンを削除する関数
  const handleDeletePokemon = useCallback((pokemonId: string, assignmentId: string) => {
    setAssignments((prevAssignments) => {
      // 指定されたアサインメントIDのポケモンを削除
      return prevAssignments.filter((a) => a.id !== assignmentId);
    });
  }, []);

  // 指定されたポケモンIDが未配置エリア以外のいずれかのTierに配置されているかチェックする関数
  const isPlacedInAnyTier = useCallback(
    (pokemonId: string): boolean => {
      return assignments.some(
        (assignment) =>
          assignment.pokemonId === pokemonId && assignment.location !== TierId.UNASSIGNED
      );
    },
    [assignments]
  );

  return {
    assignments, // フェーズ2以降で内部状態にするか検討
    getPokemonsByLocation,
    handleMovePokemon,
    handleResetTiers,
    handleDeletePokemon,
    saveAssignmentsToStorage, // 外部から直接localStorageに保存できるようにエクスポート
    isPlacedInAnyTier, // 新機能: 配置状態判定関数
  };
};
