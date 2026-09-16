import axios from 'axios';

/** Chaves usadas para persistir a sessão no localStorage. */
export const TOKEN_STORAGE_KEY = 'blog.token';
export const USER_STORAGE_KEY = 'blog.user';

/** Evento disparado quando a API responde 401 (sessão expirada ou inválida). */
export const AUTH_EXPIRED_EVENT = 'auth:expired';

/**
 * Instância central do axios.
 * Toda a comunicação com o back-end passa por aqui.
 * A URL base é configurada no .env através de VITE_API_URL.
 */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Anexa o token Bearer em todas as requisições autenticadas.
api.interceptors.request.use((configuracao) => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  if (token) {
    configuracao.headers.Authorization = `Bearer ${token}`;
  }
  return configuracao;
});

// Qualquer resposta 401 (exceto a própria tentativa de login) indica sessão
// expirada: o AuthContext é notificado para limpar o estado e redirecionar.
api.interceptors.response.use(
  (resposta) => resposta,
  (erro) => {
    const status = erro.response?.status;
    const ehRequisicaoDeLogin = erro.config?.url?.includes('/auth/login');

    if (status === 401 && !ehRequisicaoDeLogin) {
      window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT));
    }

    return Promise.reject(erro);
  },
);

/** Converte erros de API em mensagens amigáveis (pt-BR) para a interface. */
export function mensagemDeErro(erro) {
  const dados = erro?.response?.data;

  // Mensagens enviadas pelo back-end têm prioridade.
  if (typeof dados === 'string' && dados.trim() && dados.length <= 160) {
    return dados;
  }
  if (dados?.message) {
    return dados.message;
  }
  if (dados?.mensagem) {
    return dados.mensagem;
  }
  if (dados?.erro) {
    return dados.erro;
  }

  // Erros lançados pelo próprio front-end (ex.: resposta de login sem token).
  if (!erro?.response && erro?.message && erro.message !== 'Network Error') {
    return erro.message;
  }

  if (!erro?.response) {
    return 'Não foi possível conectar ao servidor. Verifique se o back-end está em execução e se a VITE_API_URL está correta.';
  }

  const status = erro.response.status;
  if (status === 400) return 'Dados inválidos. Revise os campos e tente novamente.';
  if (status === 401) return 'E-mail ou senha inválidos.';
  if (status === 403) return 'Você não tem permissão para executar esta ação.';
  if (status === 404) return 'Recurso não encontrado.';
  if (status >= 500) return 'Erro interno no servidor. Tente novamente em instantes.';

  return 'Ocorreu um erro inesperado. Tente novamente.';
}
