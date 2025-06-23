import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SymbolSelector } from './SymbolSelector';
import { SymbolsProvider } from '../context/SymbolsContext';

const mockSymbols = [
  { symbol: 'BTCUSDT', baseAsset: 'BTC', quoteAsset: 'USDT', status: 'TRADING' },
  { symbol: 'ETHBTC', baseAsset: 'ETH', quoteAsset: 'BTC', status: 'TRADING' },
];

beforeAll(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({ symbols: mockSymbols }),
    })
  ) as jest.Mock;
});

afterAll(() => {
  (global.fetch as jest.Mock).mockRestore?.();
});

const renderWithProvider = (ui: React.ReactElement) => {
  return render(<SymbolsProvider>{ui}</SymbolsProvider>);
};

describe('SymbolSelector', () => {
  it('renderiza campo de busca e tabela', () => {
    renderWithProvider(<SymbolSelector />);
    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
    expect(screen.getByText(/symbol/i)).toBeInTheDocument();
  });

  it('permite buscar e selecionar símbolo', async () => {
    renderWithProvider(<SymbolSelector />);
    const input = screen.getByPlaceholderText(/search/i);
    fireEvent.change(input, { target: { value: 'BTC' } });
    // Aguarda renderização dos resultados
    expect(await screen.findByText(/BTC/i)).toBeInTheDocument();
    // Simula clique na linha
    const row = screen.getAllByRole('row')[1];
    fireEvent.click(row);
    // O checkbox deve estar marcado
    const checkbox = row.querySelector('input[type="checkbox"]') as HTMLInputElement | null;
    expect(checkbox?.checked).toBe(true);
  });
}); 
