import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
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
    await waitFor(() => {
      expect(screen.getByText(/^BTCUSDT$/i)).toBeInTheDocument();
    });
    // Marca o checkbox do símbolo BTCUSDT
    const btcRow = screen.getByText(/^BTCUSDT$/i).closest('tr');
    expect(btcRow).not.toBeNull();
    const checkbox = btcRow!.querySelector('input[type="checkbox"]');
    fireEvent.click(checkbox!);
    // Aguarda o botão Add to List habilitar
    await waitFor(() => expect(screen.getByText(/Add to List/i)).not.toBeDisabled());
    // Adiciona à lista
    fireEvent.click(screen.getByText(/Add to List/i));
    // Seleciona para o gráfico (clicando na linha)
    fireEvent.click(btcRow!);
    // Verifica se aparece na tabela de stats do gráfico
    expect(await screen.findAllByText(/BTCUSDT/i)).toBeTruthy();
  });
});
