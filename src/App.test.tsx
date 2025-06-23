import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

describe('Integração: fluxo principal', () => {
  it('cria lista, adiciona símbolo e seleciona para o gráfico', async () => {
    render(<App />);
    // Cria nova lista
    fireEvent.change(screen.getByPlaceholderText(/Nova lista/i), { target: { value: 'Minha Lista' } });
    fireEvent.click(screen.getByText(/Criar/i));
    expect(screen.getAllByText('Minha Lista').length).toBeGreaterThan(0);
    // Busca e seleciona símbolo
    fireEvent.change(screen.getByPlaceholderText(/search/i), { target: { value: 'BTC' } });
    const row = await screen.findByText(/^BTCUSDT$/i);
    fireEvent.click(row);
    fireEvent.click(screen.getByText(/Add to List/i));
    // Seleciona para o gráfico
    fireEvent.click(row);
    // Verifica se aparece na tabela de stats do gráfico
    expect(await screen.findAllByText(/BTCUSDT/i)).toBeTruthy();
  });
});
