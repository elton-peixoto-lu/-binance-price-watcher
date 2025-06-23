import React from 'react';
import { render, screen } from '@testing-library/react';
import { WatchedList } from './WatchedList';
import { SymbolsProvider } from '../context/SymbolsContext';

const renderWithProvider = (ui: React.ReactElement) => {
  return render(<SymbolsProvider>{ui}</SymbolsProvider>);
};

describe('WatchedList', () => {
  it('renderiza tabela de símbolos', () => {
    renderWithProvider(<WatchedList />);
    expect(screen.getByText(/Symbol/i)).toBeInTheDocument();
    expect(screen.getByText(/Last Price/i)).toBeInTheDocument();
    expect(screen.getByText(/Bid/i)).toBeInTheDocument();
    expect(screen.getByText(/Ask/i)).toBeInTheDocument();
    expect(screen.getByText(/Change %/i)).toBeInTheDocument();
  });
}); 
