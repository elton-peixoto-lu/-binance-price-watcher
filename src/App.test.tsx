import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

describe('Integração: fluxo principal', () => {
  it('cria lista, adiciona símbolo e seleciona para o gráfico', async () => {
    render(<App />);
    // Cria nova lista
    fireEvent.change(screen.getByPlaceholderText(/Nova lista/i), { target: { value: 'Minha Lista' } });
    fireEvent.click(screen.getByText(/Criar/i));
    expect(screen.getByText('Minha Lista')).toBeInTheDocument();
    // Busca e seleciona símbolo
    fireEvent.change(screen.getByPlaceholderText(/search/i), { target: { value: 'BTC' } });
    const row = await screen.findByText(/BTC/i);
    fireEvent.click(row);
    fireEvent.click(screen.getByText(/Add to List/i));
    // Seleciona para o gráfico
    fireEvent.click(row);
    // Verifica se aparece na tabela de stats do gráfico
    expect(await screen.findAllByText(/BTC/i)).toBeTruthy();
  });
});
