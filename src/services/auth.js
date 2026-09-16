import { api, TOKEN_STORAGE_KEY, USER_STORAGE_KEY } from './api';

/**
 * Normaliza o usuário devolvido pelo back-end.
 * Aceita variações comuns de contrato (user/usuario, name/nome).
 */
function normalizarUsuario(usuario, emailInformado) {
  if (!usuario || typeof usuario !== 'object') {
    return { id: null, nome: emailInformado, email: emailInformado };
  }

  const email = usuario.email ?? emailInformado;

  return {
    id: usuario.id ?? usuario._id ?? null,
    nome: usuario.name ?? usuario.nome ?? email,
    email,
  };
}

/**
 * Realiza o login e devolve a sessão pronta para uso.
 * Aceita variações comuns de contrato (token/accessToken e user/usuario).
 */
export async function fazerLogin({ email, password }) {
  const { data } = await api.post('/auth/login', { email, password });

  const token = data?.token ?? data?.accessToken;
  if (!token) {
    throw new Error('O servidor não retornou um token de autenticação.');
  }

  const usuario = normalizarUsuario(data?.user ?? data?.usuario, email);
  return { token, usuario };
}

export function salvarSessao({ token, usuario }) {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(usuario));
}

export function lerSessao() {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  if (!token) return null;

  const usuarioJson = localStorage.getItem(USER_STORAGE_KEY);
  let usuario = null;
  try {
    usuario = usuarioJson ? JSON.parse(usuarioJson) : null;
  } catch {
    usuario = null;
  }

  return { token, usuario };
}

export function limparSessao() {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(USER_STORAGE_KEY);
}
