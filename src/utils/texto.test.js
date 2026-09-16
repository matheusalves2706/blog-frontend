import { describe, expect, it } from 'vitest';
import { criarResumo, filtrarPosts, normalizarTexto } from './texto';

describe('normalizarTexto', () => {
  it('remove acentos e coloca em minúsculas', () => {
    expect(normalizarTexto('Programação ÁGIL')).toBe('programacao agil');
  });

  it('lida com valores nulos', () => {
    expect(normalizarTexto(null)).toBe('');
  });
});

describe('criarResumo', () => {
  it('mantém textos curtos intactos', () => {
    expect(criarResumo('Texto curto', 50)).toBe('Texto curto');
  });

  it('trunca textos longos adicionando reticências', () => {
    const textoLongo = 'palavra '.repeat(60);
    const resumo = criarResumo(textoLongo, 40);

    expect(resumo.length).toBeLessThanOrEqual(41);
    expect(resumo.endsWith('…')).toBe(true);
  });
});

describe('filtrarPosts', () => {
  const posts = [
    {
      titulo: 'Introdução ao React',
      autor: 'Ana Souza',
      conteudo: 'Hooks e componentes funcionais.',
    },
    {
      titulo: 'Git e GitHub',
      autor: 'Carlos Lima',
      conteudo: 'Versionamento de código na prática.',
    },
  ];

  it('retorna todos os posts quando a busca está vazia', () => {
    expect(filtrarPosts(posts, '')).toHaveLength(2);
  });

  it('encontra por título ignorando maiúsculas e acentos', () => {
    const resultado = filtrarPosts(posts, 'introducao');

    expect(resultado).toHaveLength(1);
    expect(resultado[0].titulo).toBe('Introdução ao React');
  });

  it('encontra por autor(a)', () => {
    expect(filtrarPosts(posts, 'carlos')).toHaveLength(1);
  });

  it('encontra por conteúdo', () => {
    expect(filtrarPosts(posts, 'versionamento')).toHaveLength(1);
  });

  it('retorna lista vazia quando nada corresponde', () => {
    expect(filtrarPosts(posts, 'python')).toHaveLength(0);
  });
});
