import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { CommentsSection } from '../components/CommentsSection';
import { Alert } from '../components/ui/Alert';
import { Button } from '../components/ui/Button';
import { LoadingBlock } from '../components/ui/Feedback';
import { useAuth } from '../hooks/useAuth';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { mensagemDeErro } from '../services/api';
import { obterPost } from '../services/posts';
import { media } from '../styles/mixins';
import { formatarData } from '../utils/data';

const Voltar = styled(Link)`
  display: inline-block;
  margin-bottom: 18px;
  font-weight: 600;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const Artigo = styled.article`
  padding: 24px;
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};

  ${media.md`
    padding: 36px;
  `}
`;

const Titulo = styled.h1`
  margin: 0 0 8px;
  font-size: clamp(1.5rem, 4vw, 2.05rem);
`;

const MetaInfo = styled.p`
  margin: 0 0 24px;
  font-size: 0.88rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const Conteudo = styled.div`
  p {
    margin: 0 0 16px;

    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const AcoesArtigo = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 28px;
  padding-top: 20px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const AvisoTopo = styled.div`
  margin-bottom: 20px;
`;

const AcoesErro = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 12px;
`;

/** Página de leitura: exibe o post completo e a seção de comentários. */
export function PostDetail() {
  const { id } = useParams();
  const localizacao = useLocation();
  const { estaAutenticado } = useAuth();

  const [post, setPost] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [naoEncontrado, setNaoEncontrado] = useState(false);
  const [tentativa, setTentativa] = useState(0);

  const mensagem = localizacao.state?.mensagem ?? null;

  useDocumentTitle(post?.titulo ?? 'Post');

  useEffect(() => {
    let componenteAtivo = true;

    async function carregarPost() {
      try {
        setCarregando(true);
        setErro(null);
        setNaoEncontrado(false);
        const registro = await obterPost(id);
        if (componenteAtivo) setPost(registro);
      } catch (erroCapturado) {
        if (!componenteAtivo) return;

        if (erroCapturado?.response?.status === 404) {
          setNaoEncontrado(true);
        } else {
          setErro(mensagemDeErro(erroCapturado));
        }
      } finally {
        if (componenteAtivo) setCarregando(false);
      }
    }

    carregarPost();
    return () => {
      componenteAtivo = false;
    };
  }, [id, tentativa]);

  if (carregando) {
    return <LoadingBlock mensagem="Carregando post…" />;
  }

  if (naoEncontrado) {
    return (
      <section>
        <Voltar to="/">← Voltar para a lista</Voltar>
        <Alert tipo="aviso">Post não encontrado. Ele pode ter sido removido.</Alert>
      </section>
    );
  }

  if (erro) {
    return (
      <section>
        <Voltar to="/">← Voltar para a lista</Voltar>
        <Alert tipo="erro">{erro}</Alert>
        <AcoesErro>
          <Button
            type="button"
            $variante="secundario"
            $compacto
            onClick={() => setTentativa((tentativaAtual) => tentativaAtual + 1)}
          >
            Tentar novamente
          </Button>
        </AcoesErro>
      </section>
    );
  }

  if (!post) {
    return null;
  }

  const dataFormatada = formatarData(post.criadoEm);
  const paragrafos = post.conteudo
    .split(/\n+/)
    .map((paragrafo) => paragrafo.trim())
    .filter(Boolean);

  return (
    <section>
      {mensagem && (
        <AvisoTopo>
          <Alert tipo="sucesso">{mensagem}</Alert>
        </AvisoTopo>
      )}

      <Voltar to="/">← Voltar para a lista</Voltar>

      <Artigo>
        <Titulo>{post.titulo}</Titulo>
        <MetaInfo>
          Por <strong>{post.autor}</strong>
          {dataFormatada && ` · publicado em ${dataFormatada}`}
        </MetaInfo>

        <Conteudo>
          {paragrafos.length > 0 ? (
            paragrafos.map((paragrafo, indice) => <p key={indice}>{paragrafo}</p>)
          ) : (
            <p>{post.conteudo}</p>
          )}
        </Conteudo>

        {estaAutenticado && (
          <AcoesArtigo>
            <Button as={Link} to={`/posts/${post.id}/editar`} $variante="secundario" $compacto>
              Editar post
            </Button>
          </AcoesArtigo>
        )}
      </Artigo>

      <CommentsSection postId={post.id ?? id} />
    </section>
  );
}
