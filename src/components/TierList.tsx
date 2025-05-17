import React, { useMemo } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Pokemon, pokemonList } from '../data/pokemon';
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
  ResetButton
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

  // 各Tier用のポケモンリストをキャッシュ
  const tierPokemonMap = useMemo(() => 
    TIERS.reduce((acc, tier) => {
      acc[tier.id] = getPokemonsByLocation(tier.id);
      return acc;
    }, {} as Record<string, Pokemon[]>),
    [getPokemonsByLocation]
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <TierListContainer>
        <TierListHeader>
          <h1>ポケモンユナイト Tierリスト</h1>
        </TierListHeader>
        
        <TierListContent>
          {TIERS.map((tier) => (
            <TierRow
              key={tier.id}
              tier={tier.id}
              color={tier.color}
              pokemon={tierPokemonMap[tier.id]}
              onMovePokemon={handleMovePokemon}
            />
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
