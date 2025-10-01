import React, { useMemo } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TIERS } from "../constants/tiers";
import { Pokemon } from "../types";
import { useTierManagement } from "../hooks/useTierManagement";
import { useRowManager } from "../hooks/useRowManager";
import { useTierLabels } from "../hooks/useTierLabels";
import { usePokemon } from "../contexts/PokemonContext";
import {
  ButtonContainer,
  EmptyHeaderCell,
  ResetButton,
  TierListContainer,
  TierListContent,
  TierListHeader,
  UnassignedContainer,
  UnassignedGrid,
  AddRowIconButton,
  RowLabelWrapper,
} from "../styles/TierList.styles";
import { TierId } from "../types";
import DraggablePokemon from "./DraggablePokemon";
import TierRow from "./TierRow";
import EditableLabel from "./EditableLabel";
import RowSettingsModal from "./RowSettingsModal";
import { SettingsButton } from "../styles/rowSettings.styles";
import DraggableRow from "./DraggableRow";

const TierList: React.FC = () => {
  const { loadingState } = usePokemon();
  const {
    getPokemonsByLocation,
    handleMovePokemon,
    handleResetTiers,
    handleDeletePokemon,
    isPlacedInAnyTier,
    clearAssignmentsForRow,
  } = useTierManagement();

  const {
    rows,
    addRow,
    removeRow,
    updateRowLabel,
    updateRowColor,
    resetRows,
    getRowLabel,
    reorderRows,
    MIN_ROWS,
    MAX_ROWS,
  } = useRowManager();
  const { updateTierLabel, getTierLabel, resetToDefaults: resetTierLabels } = useTierLabels();

  const handleResetAll = () => {
    handleResetTiers();
    resetRows();
    resetTierLabels();
  };

  // useMemoを使用してフィルタリングされたポケモンをキャッシュ
  const unassignedPokemon = useMemo(
    () => getPokemonsByLocation(TierId.UNASSIGNED),
    [getPokemonsByLocation]
  );

  // 各Tierで各行用のポケモンリストをキャッシュ
  // どのポジションでも配置可能にする仕様のためフィルタリングはしない
  const tierPositionPokemonMap = useMemo(() => {
    // Tierごとのマップを作成（行列を入れ替え）。キーは任意の行ID。
    const tierMap: Record<string, Record<string, Pokemon[]>> = {} as Record<
      string,
      Record<string, Pokemon[]>
    >;

    // 各Tierを初期化
    TIERS.forEach((tier) => {
      tierMap[tier.id] = {} as Record<string, Pokemon[]>;

      // 各Tier列に各ポジションのポケモンリストを作成
      rows.forEach((position, idx) => {
        // ポジションでのフィルタリングを行わない
        // 代わりに、ポジションとTierの組み合わせに対して配置されたポケモンを取得
        const tierLocationKey = `${position.id}-${tier.id}`;
        tierMap[tier.id][position.id] = getPokemonsByLocation(tierLocationKey);
      });
    });

    return tierMap;
  }, [getPokemonsByLocation, rows]);

  // 行設定モーダルの開閉状態
  const [settingsRowId, setSettingsRowId] = React.useState<string | null>(null);
  const settingsRow = useMemo(
    () => rows.find((r) => r.id === settingsRowId) || null,
    [rows, settingsRowId]
  );

  // ローディング状態の表示
  if (loadingState.isLoading) {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "200px" }}
      >
        <p>ポケモンデータをロード中...</p>
      </div>
    );
  }

  // エラー状態の表示
  if (loadingState.error) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "200px",
        }}
      >
        <p>エラーが発生しました: {loadingState.error}</p>
        <button onClick={() => window.location.reload()}>リロード</button>
      </div>
    );
  }

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
          {rows.map((position, index) => (
            <DraggableRow
              key={position.id}
              rowId={position.id}
              index={index}
              onReorderRow={reorderRows}
            >
              {/* 行ラベル＋削除ボタン */}
              <RowLabelWrapper>
                <EditableLabel
                  value={getRowLabel(position.id)}
                  backgroundColor={position.color}
                  onSave={(newName) => updateRowLabel(position.id, newName)}
                />
                <SettingsButton
                  onClick={() => setSettingsRowId(position.id)}
                  title="行の設定"
                  aria-label="行の設定"
                >
                  ⚙
                </SettingsButton>
              </RowLabelWrapper>

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
            </DraggableRow>
          ))}

          {/* 行追加ボタン（最下部・最後の行ラベルの直下にアイコン表示） */}
          {rows.length < MAX_ROWS && (
            <div style={{ display: "flex", alignItems: "center", marginTop: 6 }}>
              <div style={{ width: 130, display: "flex", justifyContent: "center" }}>
                <AddRowIconButton onClick={addRow} title="行を追加" aria-label="行を追加">
                  ＋
                </AddRowIconButton>
              </div>
            </div>
          )}
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
          <ResetButton onClick={handleResetAll}>全リセット</ResetButton>
        </ButtonContainer>

        {/* 行設定モーダル */}
        <RowSettingsModal
          open={Boolean(settingsRow)}
          row={settingsRow}
          minRows={MIN_ROWS}
          totalRows={rows.length}
          onClose={() => setSettingsRowId(null)}
          onSave={(newName, newColor) => {
            if (!settingsRow) return;
            updateRowLabel(settingsRow.id, newName);
            updateRowColor(settingsRow.id, newColor);
          }}
          onDelete={() => {
            if (!settingsRow) return;
            if (rows.length <= MIN_ROWS) return;
            removeRow(settingsRow.id);
            clearAssignmentsForRow(settingsRow.id);
            setSettingsRowId(null);
          }}
        />
      </TierListContainer>
    </DndProvider>
  );
};

export default TierList;
