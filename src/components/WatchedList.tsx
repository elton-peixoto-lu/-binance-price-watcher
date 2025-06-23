import React, { useState } from 'react';
import { useSymbolsContext } from '../context/SymbolsContext';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { ChartSymbolsStats } from './ChartSymbolsStats';
import { DepthChart } from './DepthChart';

interface WatchedListProps {
  onRowClick?: (symbol: string) => void;
  selectedChartSymbols?: string[];
}

const METRIC_LABELS: Record<string, string> = {
  lastPrice: 'Last Price',
  bidPrice: 'Bid',
  askPrice: 'Ask',
  priceChangePercent: 'Change %',
};

const METRIC_OPTIONS = [
  { value: 'lastPrice', label: 'Last Price' },
  { value: 'bidPrice', label: 'Bid' },
  { value: 'askPrice', label: 'Ask' },
  { value: 'priceChangePercent', label: 'Change %' },
];

const COLORS = ['#00a6b8', '#ff7f0e', '#2ecc40', '#e74c3c'];

export const WatchedList: React.FC<WatchedListProps> = ({ onRowClick, selectedChartSymbols = [] }) => {
  const { symbolLists, selectedListId, prices } = useSymbolsContext();
  const [chartCollapsed, setChartCollapsed] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState<'lastPrice' | 'bidPrice' | 'askPrice' | 'priceChangePercent'>('lastPrice');
  const [timeRange, setTimeRange] = useState(1); // em minutos
  const [depthSymbol, setDepthSymbol] = useState('BTCUSDT');

  const watchedSymbols = symbolLists.find(l => l.id === selectedListId)?.symbols || [];

  // Monta dados do gráfico com base na métrica selecionada e range de tempo
  const isPercent = selectedMetric === 'priceChangePercent';
  const points = timeRange === 1 ? 20 : timeRange === 5 ? 40 : timeRange === 15 ? 60 : 120;
  let chartData: any[] = [];
  if (selectedChartSymbols.length > 0) {
    for (let i = 0; i < points; i++) {
      const row: any = { time: `${i + 1}` };
      selectedChartSymbols.forEach((symbol) => {
        let value = prices[symbol]?.[selectedMetric];
        const numValue = value !== undefined && value !== null && value !== '-' ? Number(value) : null;
        let simulated = null;
        if (numValue !== null) {
          if (isPercent) {
            simulated = numValue + (Math.random() - 0.5) * 0.4; // variação de até ±0.2%
          } else {
            simulated = numValue * (1 + (Math.random() - 0.5) * 0.01);
          }
        }
        row[symbol] = simulated;
      });
      chartData.push(row);
    }
  }

  return (
    <div>
      <h2>Watched Symbols</h2>
      <table>
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Last Price</th>
            <th>Bid</th>
            <th>Ask</th>
            <th>Change %</th>
          </tr>
        </thead>
        <tbody>
          {watchedSymbols.map(symbol => (
            <tr key={symbol} style={{ cursor: 'pointer', background: selectedChartSymbols.includes(symbol) ? '#e6f7fa' : undefined }} onClick={() => onRowClick?.(symbol)}>
              <td>{symbol}</td>
              <td>{prices[symbol]?.lastPrice ?? '-'}</td>
              <td>{prices[symbol]?.bidPrice ?? '-'}</td>
              <td>{prices[symbol]?.askPrice ?? '-'}</td>
              <td>{prices[symbol]?.priceChangePercent ? (
                <span className="price-change">
                  {Number(prices[symbol]?.priceChangePercent).toFixed(2)}%
                </span>
              ) : '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedChartSymbols.length > 0 && (
        <div className="chart-container">
          <button
            style={{ float: 'right', marginBottom: 8, background: 'none', border: 'none', color: '#00a6b8', fontWeight: 600, cursor: 'pointer', fontSize: 16 }}
            onClick={() => setChartCollapsed(c => !c)}
          >
            {chartCollapsed ? 'Expandir Gráfico' : 'Colapsar Gráfico'}
          </button>
          <div style={{ fontWeight: 600, marginBottom: 8, clear: 'both' }}>
            {selectedChartSymbols.join(' vs ')} - {METRIC_LABELS[selectedMetric]} Chart
          </div>
          <div style={{ marginBottom: 8 }}>
            <label htmlFor="metric-select" style={{ fontWeight: 600, marginRight: 8 }}>Métrica:</label>
            <select
              id="metric-select"
              value={selectedMetric}
              onChange={e => setSelectedMetric(e.target.value as any)}
              style={{ padding: 4, borderRadius: 6, marginRight: 12 }}
            >
              {METRIC_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <label htmlFor="range-select" style={{ fontWeight: 600, marginRight: 8 }}>Range:</label>
            <select
              id="range-select"
              value={timeRange}
              onChange={e => setTimeRange(Number(e.target.value))}
              style={{ padding: 4, borderRadius: 6 }}
            >
              <option value={1}>1 min</option>
              <option value={5}>5 min</option>
              <option value={15}>15 min</option>
              <option value={60}>1 hora</option>
            </select>
          </div>
          <ChartSymbolsStats symbols={selectedChartSymbols} />
          {!chartCollapsed && (
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={chartData} margin={{ left: 0, right: 0, top: 8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis domain={['auto', 'auto']} width={60} tickFormatter={v => isPercent ? `${Number(v).toFixed(2)}%` : Number(v).toFixed(6)} allowDecimals={true} />
                <Tooltip formatter={v => Number(v).toFixed(6)} labelFormatter={l => `Time: ${l}`} />
                <Legend />
                {selectedChartSymbols.map((symbol, idx) => (
                  <Line key={symbol} type="monotone" dataKey={symbol} stroke={COLORS[idx]} strokeWidth={2} dot={true} name={`${symbol} (${METRIC_LABELS[selectedMetric]})`} />
                ))}
              </LineChart>
            </ResponsiveContainer>
          )}
          <div style={{ margin: '24px 0 8px 0' }}>
            <label style={{ fontWeight: 600, marginRight: 8 }}>Depth Chart para:</label>
            <select value={depthSymbol} onChange={e => setDepthSymbol(e.target.value)}>
              {selectedChartSymbols.map(symbol => (
                <option key={symbol} value={symbol}>{symbol}</option>
              ))}
            </select>
          </div>
          <DepthChart symbol={depthSymbol} />
        </div>
      )}
    </div>
  );
}; 
