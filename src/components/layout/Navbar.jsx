import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../hooks/useAuth';
import { media } from '../../styles/mixins';
import { Button } from '../ui/Button';

const Cabecalho = styled.header`
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const Barra = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  max-width: 1080px;
  margin: 0 auto;
  padding: 12px 16px;

  ${media.md`
    padding: 14px 24px;
  `}
`;

const Marca = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 1.08rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  text-decoration: none;
  white-space: nowrap;
`;

const MarcaIcone = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: linear-gradient(135deg, #6366f1, #4338ca);
  color: #ffffff;
  font-size: 1rem;
`;

const BotaoMenu = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 10px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.sm};
  background-color: transparent;
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;

  ${media.md`
    display: none;
  `}
`;

const Menu = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  display: ${({ $aberto }) => ($aberto ? 'flex' : 'none')};
  flex-direction: column;
  align-items: stretch;
  gap: 10px;
  padding: 16px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.md};

  ${media.md`
    position: static;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 20px;
    padding: 0;
    background: transparent;
    border: none;
    box-shadow: none;
  `}
`;

const LinkMenu = styled(NavLink)`
  padding: 8px 12px;
  border-radius: ${({ theme }) => theme.radii.sm};
  color: ${({ theme }) => theme.colors.textMuted};
  font-weight: 600;
  text-decoration: none;

  &:hover {
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
  }

  &.active {
    background-color: ${({ theme }) => theme.colors.primarySoft};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const AreaUsuario = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  ${media.md`
    margin-left: auto;
    justify-content: flex-end;
  `}
`;

const NomeUsuario = styled.span`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export function Navbar() {
  const { estaAutenticado, usuario, sair } = useAuth();
  const [menuAberto, setMenuAberto] = useState(false);
  const localizacao = useLocation();
  const navegar = useNavigate();

  // Fecha o menu mobile a cada navegação.
  useEffect(() => {
    setMenuAberto(false);
  }, [localizacao.pathname]);

  const primeiroNome = usuario?.nome ? String(usuario.nome).split(' ')[0] : '';

  function aoSair() {
    sair();
    navegar('/');
  }

  return (
    <Cabecalho>
      <Barra>
        <Marca to="/">
          <MarcaIcone aria-hidden="true">📝</MarcaIcone>
          Blog Acadêmico
        </Marca>

        <BotaoMenu
          type="button"
          aria-expanded={menuAberto}
          aria-controls="menu-principal"
          aria-label={menuAberto ? 'Fechar menu' : 'Abrir menu'}
          onClick={() => setMenuAberto((aberto) => !aberto)}
        >
          {menuAberto ? '✕' : '☰'}
        </BotaoMenu>

        <Menu id="menu-principal" $aberto={menuAberto}>
          <LinkMenu to="/" end>
            Início
          </LinkMenu>

          {estaAutenticado && (
            <>
              <LinkMenu to="/posts/novo">Novo post</LinkMenu>
              <LinkMenu to="/admin">Administração</LinkMenu>
            </>
          )}

          <AreaUsuario>
            {estaAutenticado ? (
              <>
                <NomeUsuario>Olá, {primeiroNome || 'professor(a)'}</NomeUsuario>
                <Button type="button" $variante="fantasma" $compacto onClick={aoSair}>
                  Sair
                </Button>
              </>
            ) : (
              <Button as={Link} to="/login" $compacto>
                Entrar
              </Button>
            )}
          </AreaUsuario>
        </Menu>
      </Barra>
    </Cabecalho>
  );
}
