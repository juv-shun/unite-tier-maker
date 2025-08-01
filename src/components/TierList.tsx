import React, { useMemo } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TIERS } from "../constants/tiers";
import { Pokemon, Position, POSITIONS } from "../data/pokemon";
import { useTierManagement } from "../hooks/useTierManagement";
import { usePositionLabels } from "../hooks/usePositionLabels";
import { useTierLabels } from "../hooks/useTierLabels";
import {
  ButtonContainer,
  EmptyHeaderCell,
  ResetButton,
  TierListContainer,
  TierListContent,
  TierListHeader,
  UnassignedContainer,
  UnassignedGrid,
} from "../styles/TierList.styles";
import { TierId } from "../types";
import DraggablePokemon from "./DraggablePokemon";
import TierRow from "./TierRow";
import EditableLabel from "./EditableLabel";

const TierList: React.FC = () => {
  const {
    getPokemonsByLocation,
    handleMovePokemon,
    handleResetTiers,
    handleDeletePokemon,
    isPlacedInAnyTier,
  } = useTierManagement();

  const {
    updatePositionLabel,
    getPositionLabel,
    resetToDefaults: resetPositionLabels,
  } = usePositionLabels();
  const { updateTierLabel, getTierLabel, resetToDefaults: resetTierLabels } = useTierLabels();

  // useMemoを使用してフィルタリングされたポケモンをキャッシュ
  const unassignedPokemon = useMemo(
    () => getPokemonsByLocation(TierId.UNASSIGNED),
    [getPokemonsByLocation]
  );

  // 各Tierで各ポジション用のポケモンリストをキャッシュ
  // ポケモンのポジションでフィルタリングしないようにして、どのポケモンもどのポジションにも配置可能にする
  const tierPositionPokemonMap = useMemo(() => {
    // Tierごとのマップを作成（行列を入れ替え）
    const tierMap: Record<string, Record<Position, Pokemon[]>> = {} as Record<
      string,
      Record<Position, Pokemon[]>
    >;

    // 各Tierを初期化
    TIERS.forEach((tier) => {
      tierMap[tier.id] = {} as Record<Position, Pokemon[]>;

      // 各Tier列に各ポジションのポケモンリストを作成
      POSITIONS.forEach((position) => {
        // ポジションでのフィルタリングを行わない
        // 代わりに、ポジションとTierの組み合わせに対して配置されたポケモンを取得
        const tierLocationKey = `${position.id}-${tier.id}`;
        tierMap[tier.id][position.id] = getPokemonsByLocation(tierLocationKey);
      });
    });

    return tierMap;
  }, [getPokemonsByLocation]);

  // 未配置ポケモンはポジションで分けずに共通で使用

  // ポジションごとの背景色を定義
  const positionColors = {
    [Position.TOP_CARRIER]: "#7b68ee", // 紫
    [Position.TOP_EXP]: "#FFDF7F", // 黄色っぽいオレンジ
    [Position.JUNGLER]: "#7FBFFF", // 青
    [Position.BOTTOM_CARRIER]: "#FF7F7F", // 赤
    [Position.BOTTOM_EXP]: "#7FFF7F", // 緑
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <TierListContainer>
        <TierListHeader>
          <h1>Pokemon Unite Tier Maker</h1>
        </TierListHeader>

        <TierListContent>
          {/* Tier名ヘッダー行 */}
          <div style={{ display: "flex", flex: 1 }}>
            <EmptyHeaderCell />
            {TIERS.map((tier) => (
              <EditableLabel
                key={tier.id}
                value={getTierLabel(tier.id)}
                backgroundColor={tier.color}
                onSave={(newName) => updateTierLabel(tier.id, newName)}
                variant="column"
              />
            ))}
          </div>

          {/* ポジションごとの行 */}
          {POSITIONS.map((position) => (
            <div key={position.id} style={{ display: "flex", marginBottom: 5 }}>
              {/* 行ラベル */}
              <EditableLabel
                value={getPositionLabel(position.id)}
                backgroundColor={positionColors[position.id]}
                onSave={(newName) => updatePositionLabel(position.id, newName)}
              />

              {/* 各Tierセル */}
              {TIERS.map((tier) => (
                <TierRow
                  key={`${position.id}-${tier.id}`}
                  tier={tier.id}
                  color={tier.color}
                  pokemon={tierPositionPokemonMap[tier.id][position.id]}
                  onMovePokemon={handleMovePokemon}
                  onDeletePokemon={handleDeletePokemon}
                  positionId={position.id}
                  hideLabel={true}
                />
              ))}
            </div>
          ))}
        </TierListContent>

        <UnassignedContainer>
          <UnassignedGrid>
            {unassignedPokemon.map((pokemon, index) => (
              <DraggablePokemon
                key={pokemon.id}
                pokemon={{
                  ...pokemon,
                  isPlacedElsewhere: isPlacedInAnyTier(pokemon.id),
                }}
                tierLocation={TierId.UNASSIGNED}
                index={index}
                onMove={(
                  draggedItemInfo,
                  targetTierLocation,
                  targetIndexInTier,
                  isDroppedOutside
                ) => {
                  handleMovePokemon(
                    draggedItemInfo,
                    targetTierLocation,
                    targetIndexInTier,
                    isDroppedOutside
                  );
                }}
              />
            ))}
          </UnassignedGrid>
        </UnassignedContainer>

        <ButtonContainer>
          <ResetButton onClick={handleResetTiers}>リセット</ResetButton>
          <ResetButton onClick={resetPositionLabels}>行ラベルリセット</ResetButton>
          <ResetButton onClick={resetTierLabels}>列ラベルリセット</ResetButton>
        </ButtonContainer>
      </TierListContainer>
    </DndProvider>
  );
};

export default TierList;
