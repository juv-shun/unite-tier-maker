import { useState, useCallback, useMemo } from 'react';
import { Pokemon, pokemonList } from '../data/pokemon';
import { PokemonAssignment, TierId } from '../types';


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

  // assignmentIdを追加して、同じポケモンが複数の場所に配置できるようにする
  const [assignments, setAssignments] = useState<PokemonAssignment[]>(
    pokemonList.map((pokemon, index) => ({
      id: generateAssignmentId(),
      pokemonId: pokemon.id,
      location: TierId.UNASSIGNED, // 初期状態ではunassigned
      position: index,
      isFromUnassignedArea: true // 未配置エリアから来たポケモンかどうかのフラグ
    }))
  );

  const getPokemonById = useCallback((id: string): Pokemon | undefined => {
    return pokemonList.find(pokemon => pokemon.id === id);
  }, []);

  const getPokemonsByLocation = useCallback((location: string): Pokemon[] => {
    // 未配置エリアの場合は元のポケモン順序を使用し、それ以外は位置でソート
    const filtered = assignments
      .filter(assignment => assignment.location === location)
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

    filtered.forEach(assignment => {
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
  }, [assignments, getPokemonById, pokemonOriginalOrderMap]);

  // 指定されたTierに特定のポケモンIDが存在するかチェックする関数
  const isPokemonInTier = useCallback((assignments: PokemonAssignment[], pokemonId: string, tierLocation: string): boolean => {
    return assignments.some(a => a.pokemonId === pokemonId && a.location === tierLocation);
  }, []);

  // ドラッグアンドドロップの引数をポケモンIDからアサインメントIDに変更し、外部へのドロップフラグを追加
  const handleMovePokemon = useCallback((draggedItemInfo: { pokemonId: string; assignmentId?: string }, targetTierLocation: string, targetIndexInTier: number | undefined, isDroppedOutside: boolean = false) => {
    setAssignments(prevAssignments => {
      let assignmentsCopy = prevAssignments.map(a => ({ ...a }));
      
      // エリア外にドロップされた場合の処理
      if (isDroppedOutside && draggedItemInfo.assignmentId) {
        // ドロップされたアサインメントIDを持つアサインメントを削除
        return assignmentsCopy.filter(a => a.id !== draggedItemInfo.assignmentId);
      }
      
      // ドラッグされた要素を探す
      const draggedPokemonAssignment = draggedItemInfo.assignmentId ?
        assignmentsCopy.find(a => a.id === draggedItemInfo.assignmentId) :
        assignmentsCopy.find(a => a.pokemonId === draggedItemInfo.pokemonId && a.location === TierId.UNASSIGNED);
        
      if (!draggedPokemonAssignment) return prevAssignments;
      
      // 未配置エリア以外では、同じポケモンを同じエリアに複数配置できないようにする
      // ただし、同じエリア内での移動（位置の変更）は許可する
      if (targetTierLocation !== TierId.UNASSIGNED && draggedPokemonAssignment.location !== targetTierLocation) {
        // 移動先のエリアに同じポケモンが存在するかチェック
        const hasDuplicate = isPokemonInTier(assignmentsCopy, draggedPokemonAssignment.pokemonId, targetTierLocation);
        if (hasDuplicate) {
          // 重複があるので移動を許可しない
          return prevAssignments;
        }
      }
      
      // 未配置エリアからのドラッグの場合は新しいアサインメントを作成
      if (draggedPokemonAssignment.location === TierId.UNASSIGNED && !draggedItemInfo.assignmentId) {
        // 新しいアサインメントを作成
        const newAssignment: PokemonAssignment = {
          id: generateAssignmentId(),
          pokemonId: draggedPokemonAssignment.pokemonId,
          location: targetTierLocation,
          position: 0, // 位置は後で再計算
          isFromUnassignedArea: false // Tierに配置されるので、未配置エリアからではなくなる
        };
        
        // 各ロケーションごとの配置情報を得るために既存のアサインメントをフィルタリング
        const locationGroupedAssignments: Record<string, PokemonAssignment[]> = {};
        
        // すべてのロケーションキーを含むSetを作成
        const locationKeysSet = new Set<string>();
        locationKeysSet.add(targetTierLocation);
        
        // 現在のアサインメントから使用中のロケーションキーを追加
        assignmentsCopy.forEach(a => {
          locationKeysSet.add(a.location);
        });
        
        // 各ロケーションごとにアサインメントをグループ化
        Array.from(locationKeysSet).forEach(locationKey => {
          locationGroupedAssignments[locationKey] = assignmentsCopy
            .filter(a => a.location === locationKey)
            .sort((a, b) => a.position - b.position);
        });
        
        // 新しいアサインメントを対象のロケーションに追加
        if (targetIndexInTier !== undefined) {
          locationGroupedAssignments[targetTierLocation].splice(targetIndexInTier, 0, newAssignment);
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
        const filteredAssignments = assignmentsCopy.filter(a => a.id !== draggedPokemonAssignment.id);
        const locationGroupedAssignments: Record<string, PokemonAssignment[]> = {};
        
        // すべてのロケーションキーを含むSetを作成
        const locationKeysSet = new Set<string>();
        locationKeysSet.add(targetTierLocation);
        
        // 現在のアサインメントから使用中のロケーションキーを追加
        filteredAssignments.forEach(a => {
          locationKeysSet.add(a.location);
        });
        
        // 各ロケーションごとにアサインメントをグループ化
        Array.from(locationKeysSet).forEach(locationKey => {
          locationGroupedAssignments[locationKey] = filteredAssignments
            .filter(a => a.location === locationKey)
            .sort((a, b) => a.position - b.position);
        });
        
        // ドラッグしているアイテムを適切な位置に挿入
        if (targetIndexInTier !== undefined) {
          locationGroupedAssignments[targetTierLocation].splice(targetIndexInTier, 0, draggedPokemonAssignment);
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
  }, [isPokemonInTier]);

  // すべてのポケモンを未配置状態にリセット
  const handleResetTiers = useCallback(() => {
    setAssignments(
      pokemonList.map((pokemon, index) => ({
        id: generateAssignmentId(),
        pokemonId: pokemon.id,
        location: TierId.UNASSIGNED,
        position: index,
        isFromUnassignedArea: true
      }))
    );
  }, []);

  // ポケモンを削除する関数
  const handleDeletePokemon = useCallback((pokemonId: string, assignmentId: string) => {
    setAssignments(prevAssignments => {
      // 指定されたアサインメントIDのポケモンを削除
      return prevAssignments.filter(a => a.id !== assignmentId);
    });
  }, []);

  return {
    assignments, // フェーズ2以降で内部状態にするか検討
    getPokemonsByLocation,
    handleMovePokemon,
    handleResetTiers,
    handleDeletePokemon,
  };
};
