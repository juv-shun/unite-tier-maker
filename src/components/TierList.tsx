import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Pokemon, pokemonList } from '../data/pokemon';
import TierRow from './TierRow';
import DraggablePokemon from './DraggablePokemon';
import { useTierManagement, TIERS as tierDefinitions, PokemonAssignment } from '../hooks/useTierManagement';

const TierList: React.FC = () => {
  const {
    TIERS,
    getPokemonsByLocation,
    handleMovePokemon,
    handleResetTiers,
  } = useTierManagement();

  const unassignedPokemon = getPokemonsByLocation('unassigned');

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="tier-list-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div className="tier-list-header" style={{ margin: '20px 0', textAlign: 'center' }}>
          <h1>ポケモンユナイト Tierリスト</h1>
        </div>
        
        <div className="tier-list">
          {TIERS.map((tier) => (
            <TierRow
              key={tier.id}
              tier={tier.id}
              color={tier.color}
              pokemon={getPokemonsByLocation(tier.id)}
              onMovePokemon={handleMovePokemon}
            />
          ))}
        </div>
        
        <div 
          className="unassigned-pokemon"
          style={{ 
            marginTop: '30px',
            padding: '15px', 
            backgroundColor: '#f5f5f5',
            borderRadius: '5px'
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {unassignedPokemon.map((pokemon, index) => (
              <DraggablePokemon 
                key={pokemon.id} 
                pokemon={pokemon} 
                tierLocation="unassigned"
                index={index} 
                onMove={handleMovePokemon}
              />
            ))}
          </div>
        </div>
        
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button 
            onClick={handleResetTiers}
            style={{
              padding: '10px 15px',
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            リセット
          </button>
        </div>
      </div>
    </DndProvider>
  );
};

export default TierList;
