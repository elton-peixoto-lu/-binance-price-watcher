import React, { useEffect, useRef, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, Area, AreaChart } from 'recharts';

interface DepthChartProps {
  symbol: string; // Ex: 'BTCUSDT'
}

type DepthEntry = [string, string]; // [price, quantity]

type DepthData = {
  bids: DepthEntry[];
  asks: DepthEntry[];
};

function accumulate(entries: DepthEntry[], reverse = false) {
  // Ordena bids decrescente, asks crescente
  const sorted = [...entries].sort((a, b) => (reverse ? Number(b[0]) - Number(a[0]) : Number(a[0]) - Number(b[0])));
  let acc = 0;
  return sorted.map(([price, qty]) => {
    acc += Number(qty);
    return { price: Number(price), qty: Number(qty), acc };
  });
}

export const DepthChart: React.FC<DepthChartProps> = ({ symbol }) => {
  const [depth, setDepth] = useState<DepthData>({ bids: [], asks: [] });
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!symbol) return;
    const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@depth`);
    wsRef.current = ws;
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.b && data.a) {
        setDepth({ bids: data.b.slice(0, 50), asks: data.a.slice(0, 50) });
      }
    };
    return () => {
      ws.close();
    };
  }, [symbol]);

  const bids = accumulate(depth.bids, true);
  const asks = accumulate(depth.asks, false);
  const chartData = [
    ...bids.map(b => ({ price: b.price, bid: b.acc })),
    ...asks.map(a => ({ price: a.price, ask: a.acc })),
  ].sort((a, b) => a.price - b.price);

  return (
    <div style={{ background: '#181a20', borderRadius: 10, padding: 16, marginTop: 24 }}>
      <h3 style={{ color: '#fff', marginBottom: 12 }}>Depth Chart - {symbol}</h3>
      <ResponsiveContainer width="100%" height={320}>
        <AreaChart data={chartData} margin={{ left: 0, right: 0, top: 8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#222" />
          <XAxis dataKey="price" stroke="#fff" tickFormatter={v => Number(v).toFixed(2)} />
          <YAxis stroke="#fff" tickFormatter={v => Number(v).toFixed(2)} />
          <Tooltip formatter={v => Number(v).toFixed(6)} labelFormatter={l => `Price: ${l}`} contentStyle={{ background: '#222', border: 'none' }} />
          <Legend />
          <Area type="stepAfter" dataKey="bid" stroke="#00b86b" fill="#00b86b" fillOpacity={0.2} name="Bids" />
          <Area type="stepAfter" dataKey="ask" stroke="#e74c3c" fill="#e74c3c" fillOpacity={0.2} name="Asks" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}; 
