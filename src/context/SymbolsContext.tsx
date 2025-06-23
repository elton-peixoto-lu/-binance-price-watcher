import React, { createContext, useContext, useState, ReactNode } from 'react';

export type SymbolInfo = {
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
};

export type PriceData = {
  symbol: string;
  lastPrice: string;
  bidPrice: string;
  askPrice: string;
  priceChangePercent: string;
};

export type SymbolList = {
  id: string;
  name: string;
  symbols: string[];
  chartSelection: string[]; // até 4 símbolos
};

type SymbolsContextType = {
  availableSymbols: SymbolInfo[];
  setAvailableSymbols: (symbols: SymbolInfo[]) => void;
  symbolLists: SymbolList[];
  setSymbolLists: React.Dispatch<React.SetStateAction<SymbolList[]>>;
  selectedListId: string;
  setSelectedListId: React.Dispatch<React.SetStateAction<string>>;
  selectedSymbols: string[];
  setSelectedSymbols: React.Dispatch<React.SetStateAction<string[]>>;
  prices: Record<string, PriceData>;
  setPrices: React.Dispatch<React.SetStateAction<Record<string, PriceData>>>;
  updateChartSelection: (listId: string, selection: string[]) => void;
  removeList: (listId: string) => void;
};

const SymbolsContext = createContext<SymbolsContextType | undefined>(undefined);

export const SymbolsProvider = ({ children }: { children: ReactNode }) => {
  const [availableSymbols, setAvailableSymbols] = useState<SymbolInfo[]>([]);
  const [symbolLists, setSymbolLists] = useState<SymbolList[]>([
    { id: 'default', name: 'List A', symbols: [], chartSelection: [] },
  ]);
  const [selectedListId, setSelectedListId] = useState('default');
  const [selectedSymbols, setSelectedSymbols] = useState<string[]>([]);
  const [prices, setPrices] = useState<Record<string, PriceData>>({});

  const updateChartSelection = (listId: string, selection: string[]) => {
    setSymbolLists(prev => prev.map(list =>
      list.id === listId ? { ...list, chartSelection: selection.slice(0, 4) } : list
    ));
  };

  const removeList = (listId: string) => {
    setSymbolLists(prev => prev.filter(list => list.id !== listId));
    if (selectedListId === listId) {
      setSelectedListId(symbolLists[0]?.id || 'default');
    }
  };

  return (
    <SymbolsContext.Provider
      value={{
        availableSymbols,
        setAvailableSymbols,
        symbolLists,
        setSymbolLists,
        selectedListId,
        setSelectedListId,
        selectedSymbols,
        setSelectedSymbols,
        prices,
        setPrices,
        updateChartSelection,
        removeList,
      }}
    >
      {children}
    </SymbolsContext.Provider>
  );
};

export const useSymbolsContext = () => {
  const context = useContext(SymbolsContext);
  if (!context) {
    throw new Error('useSymbolsContext must be used within a SymbolsProvider');
  }
  return context;
}; 
