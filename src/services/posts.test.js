import { describe, expect, it } from 'vitest';
import { normalizarComentario, normalizarPost } from './posts';

describe('normalizarPost', () => {
  it('converte o contrato em inglês para o modelo do front-end', () => {
    const post = normalizarPost({
      id: 10,
      title: 'Meu post',
      author: 'Ana',
      content: 'Conteúdo do post',
      createdAt: '2026-09-01T10:00:00.000Z',
      updatedAt: null,
    });

    expect(post).toEqual({
      id: 10,
      titulo: 'Meu post',
      autor: 'Ana',
      conteudo: 'Conteúdo do post',
      criadoEm: '2026-09-01T10:00:00.000Z',
      atualizadoEm: null,
    });
  });

  it('aceita variações em português e aplica valores padrão', () => {
    const post = normalizarPost({ _id: 'abc', titulo: 'Só título' });

    expect(post.id).toBe('abc');
    expect(post.titulo).toBe('Só título');
    expect(post.autor).toBe('Autor(a) desconhecido(a)');
    expect(post.conteudo).toBe('');
  });
});

describe('normalizarComentario', () => {
  it('normaliza campos comuns de comentário', () => {
    const comentario = normalizarComentario({
      id: 1,
      author: 'João',
      content: 'Muito bom!',
      createdAt: '2026-09-02T12:00:00.000Z',
    });

    expect(comentario.id).toBe(1);
    expect(comentario.autor).toBe('João');
    expect(comentario.conteudo).toBe('Muito bom!');
  });

  it('usa o texto alternativo quando o campo padrão não existe', () => {
    const comentario = normalizarComentario({ text: 'Comentário alternativo' });

    expect(comentario.conteudo).toBe('Comentário alternativo');
  });
});
