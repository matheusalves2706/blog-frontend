import { api } from './api';

/** Extrai o recurso útil de respostas que eventualmente venham embrulhadas. */
function extrairRecurso(data) {
  if (!data || typeof data !== 'object') return null;
  return data.post ?? data.data ?? data;
}

/** Extrai uma lista de respostas que eventualmente venham embrulhadas. */
function extrairLista(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.posts)) return data.posts;
  if (Array.isArray(data?.comments)) return data.comments;
  if (Array.isArray(data?.comentarios)) return data.comentarios;
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

/** Converte o formato do back-end (contrato REST) no modelo do front-end. */
export function normalizarPost(dados) {
  return {
    id: dados.id ?? dados._id ?? null,
    titulo: dados.title ?? dados.titulo ?? '(sem título)',
    autor: dados.author ?? dados.autor ?? 'Autor(a) desconhecido(a)',
    conteudo: dados.content ?? dados.conteudo ?? '',
    criadoEm: dados.createdAt ?? dados.criadoEm ?? dados.data ?? null,
    atualizadoEm: dados.updatedAt ?? dados.atualizadoEm ?? null,
  };
}

export function normalizarComentario(dados) {
  return {
    id: dados.id ?? dados._id ?? null,
    autor: dados.author ?? dados.autor ?? 'Anônimo(a)',
    conteudo: dados.content ?? dados.conteudo ?? dados.text ?? '',
    criadoEm: dados.createdAt ?? dados.criadoEm ?? dados.data ?? null,
  };
}

/** Monta o corpo enviado ao back-end a partir do modelo do front-end. */
function corpoDoPost({ titulo, autor, conteudo }) {
  return {
    title: titulo,
    author: autor,
    content: conteudo,
  };
}

// ------------------------------ Posts ------------------------------

export async function listarPosts() {
  const { data } = await api.get('/posts');
  return extrairLista(data).map(normalizarPost);
}

export async function obterPost(id) {
  const { data } = await api.get(`/posts/${id}`);
  const recurso = extrairRecurso(data);
  if (!recurso) {
    throw new Error('Post não encontrado.');
  }
  return normalizarPost(recurso);
}

export async function criarPost(dados) {
  const { data } = await api.post('/posts', corpoDoPost(dados));
  const recurso = extrairRecurso(data);

  // Alguns back-ends respondem apenas com mensagem de sucesso;
  // nesse caso o post é considerado criado, porém sem id imediato.
  const temId = recurso && (recurso.id ?? recurso._id);
  return temId ? normalizarPost(recurso) : null;
}

export async function atualizarPost(id, dados) {
  const { data } = await api.put(`/posts/${id}`, corpoDoPost(dados));
  const recurso = extrairRecurso(data);
  return recurso ? normalizarPost(recurso) : null;
}

export async function excluirPost(id) {
  await api.delete(`/posts/${id}`);
}

// --------------------------- Comentários ---------------------------

export async function listarComentarios(postId) {
  const { data } = await api.get(`/posts/${postId}/comments`);
  return extrairLista(data).map(normalizarComentario);
}

export async function criarComentario(postId, { autor, conteudo }) {
  const { data } = await api.post(`/posts/${postId}/comments`, {
    author: autor,
    content: conteudo,
  });

  const recurso = extrairRecurso(data);
  if (!recurso) {
    return { id: null, autor, conteudo, criadoEm: new Date().toISOString() };
  }
  return normalizarComentario(recurso);
}
