import { useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { Alert } from '../components/ui/Alert';
import { Button } from '../components/ui/Button';
import { CampoGrupo, Formulario, Input, Label } from '../components/ui/FormFields';
import { useAuth } from '../hooks/useAuth';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { mensagemDeErro } from '../services/api';

const Wrapper = styled.section`
  max-width: 440px;
  margin: 24px auto 0;
`;

const Cartao = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 28px;
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const BlocoTitulo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Titulo = styled.h1`
  margin: 0;
  font-size: 1.5rem;
`;

const Subtitulo = styled.p`
  margin: 0;
  font-size: 0.95rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const NotaRodape = styled.p`
  margin: 0;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.textMuted};
  text-align: center;
`;

/** Página de login (área restrita a professores/as). */
export function Login() {
  useDocumentTitle('Entrar');
  const { estaAutenticado, entrar } = useAuth();
  const localizacao = useLocation();

  const [credenciais, setCredenciais] = useState({ email: '', password: '' });
  const [erro, setErro] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [loginConcluido, setLoginConcluido] = useState(false);

  const destino = localizacao.state?.destino ?? '/';

  // Usuário já autenticado (ou recém-logado) segue para o destino original.
  // O redirecionamento é declarativo para não competir com a navegação pós-login.
  if (estaAutenticado) {
    return (
      <Navigate
        to={destino}
        replace
        state={loginConcluido ? { mensagem: 'Login realizado com sucesso!' } : undefined}
      />
    );
  }

  function alterarCampo(evento) {
    const { name, value } = evento.target;
    setCredenciais((atual) => ({ ...atual, [name]: value }));
  }

  async function enviar(evento) {
    evento.preventDefault();

    if (!credenciais.email.trim() || !credenciais.password) {
      setErro('Informe e-mail e senha para entrar.');
      return;
    }

    try {
      setEnviando(true);
      setErro(null);

      // Marcado antes do await: quando a sessão ativar, o <Navigate> acima
      // já redireciona levando a mensagem de sucesso no state.
      setLoginConcluido(true);
      await entrar({ email: credenciais.email.trim(), password: credenciais.password });
    } catch (erroCapturado) {
      setLoginConcluido(false);
      setErro(mensagemDeErro(erroCapturado));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <Wrapper>
      <Cartao>
        <BlocoTitulo>
          <Titulo>Entrar</Titulo>
          <Subtitulo>
            Área restrita a professores(as) para publicar e gerenciar posts.
          </Subtitulo>
        </BlocoTitulo>

        {erro && <Alert tipo="erro">{erro}</Alert>}

        <Formulario onSubmit={enviar} noValidate>
          <CampoGrupo>
            <Label htmlFor="login-email">E-mail</Label>
            <Input
              id="login-email"
              name="email"
              type="email"
              value={credenciais.email}
              onChange={alterarCampo}
              autoComplete="email"
              placeholder="professor@exemplo.com"
              required
            />
          </CampoGrupo>

          <CampoGrupo>
            <Label htmlFor="login-password">Senha</Label>
            <Input
              id="login-password"
              name="password"
              type="password"
              value={credenciais.password}
              onChange={alterarCampo}
              autoComplete="current-password"
              placeholder="Sua senha"
              required
            />
          </CampoGrupo>

          <Button type="submit" disabled={enviando}>
            {enviando ? 'Entrando…' : 'Entrar'}
          </Button>
        </Formulario>

        <NotaRodape>
          A leitura dos posts é livre para todos(as); o login é exclusivo para
          professores(as).{' '}
          <Link to="/">Voltar para o início</Link>
        </NotaRodape>
      </Cartao>
    </Wrapper>
  );
}
