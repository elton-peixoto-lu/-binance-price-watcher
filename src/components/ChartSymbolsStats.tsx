import React from 'react';
import { useSymbolsContext } from '../context/SymbolsContext';

const COLORS = ['#00a6b8', '#ff7f0e', '#2ecc40', '#e74c3c'];

interface ChartSymbolsStatsProps {
  symbols: string[];
}

export const ChartSymbolsStats: React.FC<ChartSymbolsStatsProps> = ({ symbols }) => {
  const { prices } = useSymbolsContext();

  return (
    <table style={{ marginBottom: 12, width: '100%', background: '#f7f7f7', borderRadius: 6 }}>
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
        {symbols.map((symbol, idx) => (
          <tr key={symbol} style={{ color: COLORS[idx] }}>
            <td style={{ fontWeight: 600 }}>{symbol}</td>
            <td>{prices[symbol]?.lastPrice ?? '-'}</td>
            <td>{prices[symbol]?.bidPrice ?? '-'}</td>
            <td>{prices[symbol]?.askPrice ?? '-'}</td>
            <td>
              {prices[symbol]?.priceChangePercent ? (
                <span className="price-change">
                  {Number(prices[symbol]?.priceChangePercent).toFixed(2)}%
                </span>
              ) : '-'}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}; 
