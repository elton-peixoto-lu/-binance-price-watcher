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
    expect(screen.getByRole('columnheader', { name: /Symbol/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /Last Price/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /Bid/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /Ask/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /Change %/i })).toBeInTheDocument();
  });
}); 
