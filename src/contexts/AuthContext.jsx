import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { AUTH_EXPIRED_EVENT } from '../services/api';
import { fazerLogin, lerSessao, limparSessao, salvarSessao } from '../services/auth';

export const AuthContext = createContext(null);

/**
 * Provider de autenticação (Context API).
 * Mantém a sessão do professor logado e expõe as ações de entrar/sair.
 */
export function AuthProvider({ children }) {
  const [sessao, setSessao] = useState(() => lerSessao());

  const entrar = useCallback(async ({ email, password }) => {
    const novaSessao = await fazerLogin({ email, password });
    salvarSessao(novaSessao);
    setSessao(novaSessao);
    return novaSessao.usuario;
  }, []);

  const sair = useCallback(() => {
    limparSessao();
    setSessao(null);
  }, []);

  // Sessão expirada (401 em qualquer requisição): limpa o estado local.
  useEffect(() => {
    function aoExpirarSessao() {
      limparSessao();
      setSessao(null);
    }

    window.addEventListener(AUTH_EXPIRED_EVENT, aoExpirarSessao);
    return () => window.removeEventListener(AUTH_EXPIRED_EVENT, aoExpirarSessao);
  }, []);

  const valor = useMemo(
    () => ({
      usuario: sessao?.usuario ?? null,
      token: sessao?.token ?? null,
      estaAutenticado: Boolean(sessao?.token),
      entrar,
      sair,
    }),
    [sessao, entrar, sair],
  );

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}
