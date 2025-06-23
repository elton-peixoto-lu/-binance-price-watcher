import React, { useEffect, useRef } from 'react';
import { useSymbolsContext } from '../context/SymbolsContext';

const BASE_URL = 'wss://data-stream.binance.com/stream?streams=';

export const WebSocketManager: React.FC = () => {
  const { symbolLists, selectedListId, setPrices } = useSymbolsContext();
  const wsRef = useRef<WebSocket | null>(null);

  const watchedSymbols = symbolLists.find(l => l.id === selectedListId)?.symbols || [];

  useEffect(() => {
    if (watchedSymbols.length === 0) {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      return;
    }

    const streams = watchedSymbols.map((s: string) => s.toLowerCase() + '@ticker').join('/');
    const ws = new WebSocket(`${BASE_URL}${streams}`);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const ticker = data.data;
      setPrices(prev => ({
        ...prev,
        [ticker.s]: {
          symbol: ticker.s,
          lastPrice: ticker.c,
          bidPrice: ticker.b,
          askPrice: ticker.a,
          priceChangePercent: ticker.P,
        }
      }));
    };

    return () => {
      ws.close();
    };
  }, [watchedSymbols, setPrices]);

  return null;
}; 
