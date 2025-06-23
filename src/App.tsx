import React, { useState } from 'react';
import { SymbolsProvider, useSymbolsContext } from './context/SymbolsContext';
import { SymbolSelector } from './components/SymbolSelector';
import { WatchedList } from './components/WatchedList';
import { WebSocketManager } from './components/WebSocketManager';
import './App.css';

const ListSidebar: React.FC = () => {
  const { symbolLists, selectedListId, setSelectedListId, removeList } = useSymbolsContext();
  return (
    <div style={{ minWidth: 180, background: '#fff', borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', padding: 12, marginRight: 16, height: 'fit-content' }}>
      <div style={{ fontWeight: 700, marginBottom: 10 }}>Minhas Listas</div>
      {symbolLists.map(list => (
        <div key={list.id} style={{ display: 'flex', alignItems: 'center', marginBottom: 6 }}>
          <button style={{ background: list.id === selectedListId ? '#00a6b8' : '#eee', color: list.id === selectedListId ? '#fff' : '#333', border: 'none', borderRadius: 6, padding: '4px 8px', flex: 1, cursor: 'pointer', fontWeight: 600 }} onClick={() => setSelectedListId(list.id)}>{list.name}</button>
          <button style={{ marginLeft: 6, background: '#fff', color: '#d00', border: '1px solid #eee', borderRadius: 6, cursor: 'pointer', fontWeight: 700 }} onClick={() => removeList(list.id)}>🗑️</button>
        </div>
      ))}
    </div>
  );
};

function AppContent() {
  const { symbolLists, selectedListId, setSymbolLists, updateChartSelection } = useSymbolsContext();
  const activeList = symbolLists.find(l => l.id === selectedListId);
  const selectedChartSymbols = activeList?.chartSelection || [];

  // Função para selecionar/deselecionar até 4 símbolos para o gráfico
  const handleChartSymbolToggle = (symbol: string) => {
    if (!activeList) return;
    // Se o símbolo não está na lista ativa, adiciona
    if (!activeList.symbols.includes(symbol)) {
      setSymbolLists(prev =>
        prev.map(list =>
          list.id === activeList.id
            ? { ...list, symbols: [...list.symbols, symbol] }
            : list
        )
      );
    }
    // Atualiza seleção do gráfico (até 4)
    let newSelection = activeList.chartSelection.includes(symbol)
      ? activeList.chartSelection.filter(s => s !== symbol)
      : activeList.chartSelection.length < 4
        ? [...activeList.chartSelection, symbol]
        : [
            ...activeList.chartSelection.slice(1),
            symbol
          ];
    updateChartSelection(activeList.id, newSelection);
  };

  return (
    <div className="App">
      <div className="app-title">Binance Price Watcher</div>
      <div style={{ display: 'flex', flexDirection: 'row', width: '100%', maxWidth: 1400, justifyContent: 'center' }}>
        <ListSidebar />
        <div className="panels">
          <div className={`symbol-selector`}>
            <SymbolSelector onSymbolClick={handleChartSymbolToggle} selectedChartSymbols={selectedChartSymbols} />
          </div>image.png
          <div className="watched-list">
            <WatchedList onRowClick={handleChartSymbolToggle} selectedChartSymbols={selectedChartSymbols} />
          </div>
        </div>
      </div>
      <WebSocketManager />
    </div>
  );
}

function App() {
  return (
    <SymbolsProvider>
      <AppContent />
    </SymbolsProvider>
  );
}

export default App;
