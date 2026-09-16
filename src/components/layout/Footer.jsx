import styled from 'styled-components';
import { media } from '../../styles/mixins';

const Rodape = styled.footer`
  padding: 20px 16px;
  text-align: center;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.textMuted};
  background-color: ${({ theme }) => theme.colors.surface};
  border-top: 1px solid ${({ theme }) => theme.colors.border};

  ${media.md`
    padding: 22px 24px;
  `}
`;

const Texto = styled.p`
  margin: 0;
`;

export function Footer() {
  const ano = new Date().getFullYear();

  return (
    <Rodape>
      <Texto>
        Blog Acadêmico · Tech Challenge {ano} — interface em React para a aplicação de
        blogging.
      </Texto>
    </Rodape>
  );
}
