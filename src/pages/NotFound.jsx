import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Button } from '../components/ui/Button';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

const Wrapper = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  padding: 64px 16px;
  text-align: center;
`;

const Codigo = styled.span`
  font-size: 3.4rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.primary};
`;

const Titulo = styled.h1`
  margin: 0;
  font-size: 1.5rem;
`;

const Texto = styled.p`
  margin: 0;
  max-width: 48ch;
  color: ${({ theme }) => theme.colors.textMuted};
`;

/** Página 404. */
export function NotFound() {
  useDocumentTitle('Página não encontrada');

  return (
    <Wrapper>
      <Codigo aria-hidden="true">404</Codigo>
      <Titulo>Página não encontrada</Titulo>
      <Texto>
        O endereço acessado não existe ou foi movido. Verifique o link e tente novamente.
      </Texto>
      <Button as={Link} to="/">
        Voltar para a página inicial
      </Button>
    </Wrapper>
  );
}
