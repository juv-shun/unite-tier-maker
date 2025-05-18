import React, { useMemo } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TIERS } from '../constants/tiers';
import { Pokemon, Position, POSITIONS } from '../data/pokemon';
import { useTierManagement } from '../hooks/useTierManagement';
import {
  ButtonContainer,
  EmptyHeaderCell,
  CategoryColumn,
  ColumnHeader,
  ResetButton,
  LabelCell,
  LabelsColumn,
  TierListContainer,
  TierListContent,
  TierListHeader,
  UnassignedContainer,
  UnassignedGrid
} from '../styles/TierList.styles';
import { TierId } from '../types';
import DraggablePokemon from './DraggablePokemon';
import TierRow from './TierRow';

const TierList: React.FC = () => {
  const {
    getPokemonsByLocation,
    handleMovePokemon,
    handleResetTiers,
  } = useTierManagement();

  // useMemoを使用してフィルタリングされたポケモンをキャッシュ
  const unassignedPokemon = useMemo(() =>
    getPokemonsByLocation(TierId.UNASSIGNED),
    [getPokemonsByLocation]
  );

  // 各Tierで各ポジション用のポケモンリストをキャッシュ
  // ポケモンのポジションでフィルタリングしないようにして、どのポケモンもどのポジションにも配置可能にする
  const tierPositionPokemonMap = useMemo(() => {
    // Tierごとのマップを作成（行列を入れ替え）
    const tierMap: Record<string, Record<Position, Pokemon[]>> = {} as Record<string, Record<Position, Pokemon[]>>;

    // 各Tierを初期化
    TIERS.forEach(tier => {
      tierMap[tier.id] = {} as Record<Position, Pokemon[]>;

      // 各Tier列に各ポジションのポケモンリストを作成
      POSITIONS.forEach(position => {
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
    [Position.ATTACKER]: '#FF7F7F', // 赤
    [Position.SPEEDSTER]: '#FFBF7F', // オレンジ
    [Position.ALL_ROUNDER]: '#FFDF7F', // 黄色っぽいオレンジ
    [Position.DEFENDER]: '#7FFF7F', // 緑
    [Position.SUPPORTER]: '#7FBFFF', // 青
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <TierListContainer>
        <TierListHeader>
          <h1>ポケモンユナイト Tierリスト</h1>
        </TierListHeader>

        <TierListContent>
          {/* ポジションラベルを左側に1列だけ表示 */}
          <LabelsColumn>
            <EmptyHeaderCell />
            {POSITIONS.map(position => (
              <LabelCell key={position.id} backgroundColor={positionColors[position.id]}>
                {position.name}
              </LabelCell>
            ))}
          </LabelsColumn>

          {/* 各Tierの列 */}
          {TIERS.map(tier => (
            <CategoryColumn key={tier.id}>
              <ColumnHeader backgroundColor={tier.color}>
                {tier.id}
              </ColumnHeader>

              {POSITIONS.map(position => (
                <TierRow
                  key={`${position.id}-${tier.id}`}
                  tier={tier.id}
                  color={tier.color}
                  pokemon={tierPositionPokemonMap[tier.id][position.id]}
                  onMovePokemon={handleMovePokemon}
                  positionId={position.id}
                  hideLabel={true} /* ラベルを非表示にする */
                />
              ))}
            </CategoryColumn>
          ))}
        </TierListContent>

        <UnassignedContainer>
          <UnassignedGrid>
            {unassignedPokemon.map((pokemon, index) => (
              <DraggablePokemon
                key={pokemon.id}
                pokemon={pokemon}
                tierLocation={TierId.UNASSIGNED}
                index={index}
                onMove={(draggedItemInfo, targetTierLocation, targetIndexInTier, isDroppedOutside) => {
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
          <ResetButton onClick={handleResetTiers}>
            リセット
          </ResetButton>
        </ButtonContainer>
      </TierListContainer>
    </DndProvider>
  );
};

export default TierList;
