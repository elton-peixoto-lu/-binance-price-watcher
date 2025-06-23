import React from 'react';
import { render, screen } from '@testing-library/react';
import { ChartSymbolsStats } from './ChartSymbolsStats';
import { SymbolsProvider } from '../context/SymbolsContext';

const renderWithProvider = (ui: React.ReactElement) => {
  return render(<SymbolsProvider>{ui}</SymbolsProvider>);
};

describe('ChartSymbolsStats', () => {
  it('renderiza tabela de stats dos símbolos', () => {
    renderWithProvider(<ChartSymbolsStats symbols={['ETHBTC', 'LTCBTC']} />);
    expect(screen.getByText(/Symbol/i)).toBeInTheDocument();
    expect(screen.getByText(/Last Price/i)).toBeInTheDocument();
    expect(screen.getByText(/Bid/i)).toBeInTheDocument();
    expect(screen.getByText(/Ask/i)).toBeInTheDocument();
    expect(screen.getByText(/Change %/i)).toBeInTheDocument();
  });
}); 
