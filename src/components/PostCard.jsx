import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { formatarData } from '../utils/data';
import { criarResumo } from '../utils/texto';
import { Card } from './ui/Card';

const Cartao = styled(Card)`
  transition: box-shadow 0.2s ease, transform 0.2s ease;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.md};
    transform: translateY(-2px);
  }
`;

const MetaInfo = styled.p`
  margin: 0;
  font-size: 0.82rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const Titulo = styled.h2`
  margin: 0;
  font-size: 1.2rem;
`;

const LinkTitulo = styled(Link)`
  color: inherit;
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const Resumo = styled.p`
  margin: 0;
  font-size: 0.95rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const LerMais = styled(Link)`
  margin-top: auto;
  font-size: 0.92rem;
  font-weight: 600;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

/** Cartão de post exibido na listagem principal. */
export function PostCard({ post }) {
  const dataFormatada = formatarData(post.criadoEm);

  return (
    <Cartao>
      <MetaInfo>
        Por <strong>{post.autor}</strong>
        {dataFormatada && ` · ${dataFormatada}`}
      </MetaInfo>

      <Titulo>
        <LinkTitulo to={`/posts/${post.id}`}>{post.titulo}</LinkTitulo>
      </Titulo>

      <Resumo>{criarResumo(post.conteudo, 180)}</Resumo>

      <LerMais to={`/posts/${post.id}`}>Ler post completo →</LerMais>
    </Cartao>
  );
}
