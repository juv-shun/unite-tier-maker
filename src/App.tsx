import React from 'react';
import './App.css';
import TierList from './components/TierList';
import { PokemonProvider } from './contexts/PokemonContext';

function App() {
  return (
    <div className="App">
      <PokemonProvider>
        <TierList />
      </PokemonProvider>
    </div>
  );
}

export default App;
