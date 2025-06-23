import React, { useEffect, useState } from 'react';
import { useSymbolsContext, SymbolList } from '../context/SymbolsContext';
import { ExchangeInfoResponse } from '../types/binance';
import './SymbolSelector.css';
import { v4 as uuidv4 } from 'uuid';

interface SymbolSelectorProps {
  onSymbolClick?: (symbol: string) => void;
  selectedChartSymbols?: string[];
}

const fetchSymbols = async () => {
  const res = await fetch('https://api.binance.com/api/v3/exchangeInfo');
  const data: ExchangeInfoResponse = await res.json();
  // Filtra apenas símbolos de status TRADING
  return data.symbols.filter((s) => s.status === 'TRADING');
};

export const SymbolSelector: React.FC<SymbolSelectorProps> = ({ onSymbolClick, selectedChartSymbols = [] }) => {
  const {
    availableSymbols,
    setAvailableSymbols,
    symbolLists,
    setSymbolLists,
    selectedListId,
    setSelectedListId,
    selectedSymbols,
    setSelectedSymbols,
  } = useSymbolsContext();
  const [search, setSearch] = useState('');
  const [newListName, setNewListName] = useState('');
  const [renamingListId, setRenamingListId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');

  useEffect(() => {
    if (availableSymbols.length === 0) {
      fetchSymbols().then(setAvailableSymbols);
    }
  }, [availableSymbols.length, setAvailableSymbols]);

  const filteredSymbols = availableSymbols.filter((s) =>
    s.symbol.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (symbol: string) => {
    setSelectedSymbols((prev: string[]) =>
      prev.includes(symbol)
        ? prev.filter((s: string) => s !== symbol)
        : [...prev, symbol]
    );
    onSymbolClick?.(symbol);
  };

  const handleAddToList = () => {
    setSymbolLists((prev) =>
      prev.map((list) =>
        list.id === selectedListId
          ? { ...list, symbols: Array.from(new Set([...list.symbols, ...selectedSymbols])) }
          : list
      )
    );
    setSelectedSymbols([]);
  };

  const handleListChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedListId(e.target.value);
    setSelectedSymbols([]);
  };

  const handleCreateList = () => {
    if (newListName.trim()) {
      const id = uuidv4();
      setSymbolLists((prev) => [...prev, { id, name: newListName.trim(), symbols: [], chartSelection: [] }]);
      setSelectedListId(id);
      setNewListName('');
      setSelectedSymbols([]);
    }
  };

  const handleRenameList = (id: string) => {
    setSymbolLists((prev) => prev.map(list => list.id === id ? { ...list, name: renameValue } : list));
    setRenamingListId(null);
    setRenameValue('');
  };

  return (
    <div className="symbol-selector">
      <div style={{ marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
        <select value={selectedListId} onChange={handleListChange} style={{ flex: 1, padding: 6, borderRadius: 6 }}>
          {symbolLists.map(list => (
            <option key={list.id} value={list.id}>{list.name}</option>
          ))}
        </select>
        <button style={{ padding: '6px 10px', borderRadius: 6, background: '#00a6b8', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer' }} onClick={() => setRenamingListId(selectedListId)}>✏️</button>
      </div>
      {renamingListId && (
        <div style={{ marginBottom: 10, display: 'flex', gap: 6 }}>
          <input value={renameValue} onChange={e => setRenameValue(e.target.value)} placeholder="New name" style={{ flex: 1, padding: 6, borderRadius: 6 }} />
          <button style={{ padding: '6px 10px', borderRadius: 6, background: '#00a6b8', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer' }} onClick={() => handleRenameList(renamingListId)}>Salvar</button>
          <button style={{ padding: '6px 10px', borderRadius: 6, background: '#eee', color: '#333', border: 'none', fontWeight: 600, cursor: 'pointer' }} onClick={() => setRenamingListId(null)}>Cancelar</button>
        </div>
      )}
      <div style={{ marginBottom: 10, display: 'flex', gap: 6 }}>
        <input value={newListName} onChange={e => setNewListName(e.target.value)} placeholder="Nova lista" style={{ flex: 1, padding: 6, borderRadius: 6 }} />
        <button style={{ padding: '6px 10px', borderRadius: 6, background: '#00a6b8', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer' }} onClick={handleCreateList}>Criar</button>
      </div>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <button
        className="add-to-list-btn"
        onClick={handleAddToList}
        disabled={selectedSymbols.length === 0}
        style={{ marginBottom: 10 }}
      >
        Add to List
      </button>
      <div className="symbol-list">
        <table>
          <thead>
            <tr>
              <th></th>
              <th>Symbol</th>
            </tr>
          </thead>
          <tbody>
            {filteredSymbols.map((s) => (
              <tr
                key={s.symbol}
                className={selectedSymbols.includes(s.symbol) ? 'selected' : ''}
                style={{ cursor: 'pointer', background: selectedChartSymbols.includes(s.symbol) ? '#e6f7fa' : undefined }}
                onClick={() => handleSelect(s.symbol)}
              >
                <td>
                  <input
                    type="checkbox"
                    checked={selectedSymbols.includes(s.symbol)}
                    onChange={() => handleSelect(s.symbol)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </td>
                <td>{s.symbol}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}; 
