import React, { useMemo } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Pokemon, pokemonList, Position, POSITIONS } from '../data/pokemon';
import TierRow from './TierRow';
import DraggablePokemon from './DraggablePokemon';
import { useTierManagement } from '../hooks/useTierManagement';
import { TIERS } from '../constants/tiers';
import { PokemonAssignment, TierId } from '../types';
import {
  TierListContainer,
  TierListHeader,
  TierListContent,
  UnassignedContainer,
  UnassignedGrid,
  ButtonContainer,
  ResetButton,
  PositionColumn,
  PositionHeader,
  TierLabelsColumn,
  TierLabelOnly,
  EmptyTierLabel
} from '../styles/TierList.styles';

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

  // 各ポジションで各Tier用のポケモンリストをキャッシュ
  // ポケモンのポジションでフィルタリングしないようにして、どのポケモンもどのポジションにも配置可能にする
  const positionTierPokemonMap = useMemo(() => {
    // ポジションごとのマップを作成
    const posMap: Record<Position, Record<string, Pokemon[]>> = {} as Record<Position, Record<string, Pokemon[]>>;
    
    // 各ポジションを初期化
    POSITIONS.forEach(position => {
      posMap[position.id] = {};
      
      // 各ポジション列に各Tierのポケモンリストを作成
      TIERS.forEach(tier => {
        // ポジションでのフィルタリングを行わない
        // 代わりに、ポジションとTierの組み合わせに対して配置されたポケモンを取得
        const tierLocationKey = `${position.id}-${tier.id}`;
        posMap[position.id][tier.id] = getPokemonsByLocation(tierLocationKey);
      });
    });
    
    return posMap;
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
          {/* Tierラベルを左側に1列だけ表示 */}
          <TierLabelsColumn>
            <EmptyTierLabel />
            {TIERS.map(tier => (
              <TierLabelOnly key={tier.id} backgroundColor={tier.color}>
                {tier.id}
              </TierLabelOnly>
            ))}
          </TierLabelsColumn>
          
          {/* 各ポジションの列 */}
          {POSITIONS.map(position => (
            <PositionColumn key={position.id}>
              <PositionHeader backgroundColor={positionColors[position.id]}>
                {position.name}
              </PositionHeader>
              
              {TIERS.map(tier => (
                <TierRow
                  key={`${position.id}-${tier.id}`}
                  tier={tier.id}
                  color={tier.color}
                  pokemon={positionTierPokemonMap[position.id][tier.id]}
                  onMovePokemon={handleMovePokemon}
                  positionId={position.id}
                  hideLabel={true} /* ラベルを非表示にする */
                />
              ))}
            </PositionColumn>
          ))}
        </TierListContent>
        
        <UnassignedContainer>
          <h3>ポケモン一覧</h3>
          <UnassignedGrid>
            {unassignedPokemon.map((pokemon, index) => (
              <DraggablePokemon 
                key={pokemon.id} 
                pokemon={pokemon} 
                tierLocation={TierId.UNASSIGNED}
                index={index} 
                onMove={handleMovePokemon}
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
