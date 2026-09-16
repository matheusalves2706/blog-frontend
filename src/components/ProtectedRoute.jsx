import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/**
 * Guarda de rota: garante que apenas usuários autenticados acessem
 * as páginas de criação, edição e administração.
 * Usuários sem sessão são redirecionados para o login, guardando o
 * destino original para voltar após a autenticação.
 */
export function ProtectedRoute({ children }) {
  const { estaAutenticado } = useAuth();
  const localizacao = useLocation();

  if (!estaAutenticado) {
    return <Navigate to="/login" replace state={{ destino: localizacao.pathname }} />;
  }

  return children;
}
