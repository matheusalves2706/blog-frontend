import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { PostCard } from '../components/PostCard';
import { Alert } from '../components/ui/Alert';
import { Button } from '../components/ui/Button';
import { EmptyState, LoadingBlock } from '../components/ui/Feedback';
import { Input, Label } from '../components/ui/FormFields';
import { useAuth } from '../hooks/useAuth';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { mensagemDeErro } from '../services/api';
import { listarPosts } from '../services/posts';
import { media } from '../styles/mixins';
import { filtrarPosts } from '../utils/texto';

const CabecalhoPagina = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 24px;
`;

const Titulo = styled.h1`
  margin: 0;
  font-size: clamp(1.6rem, 4vw, 2.1rem);
`;

const Subtitulo = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const AvisoTopo = styled.div`
  margin-bottom: 20px;
`;

const CampoBusca = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-width: 460px;
  margin-bottom: 8px;
`;

const ContagemResultados = styled.p`
  margin: 8px 0 20px;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const Grade = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;

  ${media.sm`
    grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
  `}
`;

const AcoesErro = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 12px;
`;

/** Página principal: lista de posts com busca por palavra-chave. */
export function Home() {
  useDocumentTitle('Início');
  const localizacao = useLocation();
  const { estaAutenticado } = useAuth();

  const [posts, setPosts] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [busca, setBusca] = useState('');
  const [tentativa, setTentativa] = useState(0);

  const mensagem = localizacao.state?.mensagem ?? null;

  useEffect(() => {
    let componenteAtivo = true;

    async function carregarPosts() {
      try {
        setCarregando(true);
        setErro(null);
        const lista = await listarPosts();
        if (componenteAtivo) setPosts(lista);
      } catch (erroCapturado) {
        if (componenteAtivo) setErro(mensagemDeErro(erroCapturado));
      } finally {
        if (componenteAtivo) setCarregando(false);
      }
    }

    carregarPosts();
    return () => {
      componenteAtivo = false;
    };
  }, [tentativa]);

  const postsFiltrados = useMemo(() => filtrarPosts(posts, busca), [posts, busca]);
  const termoBusca = busca.trim();

  return (
    <section>
      <CabecalhoPagina>
        <Titulo>Últimos posts</Titulo>
        <Subtitulo>
          Acompanhe as publicações de professores(as) e estudantes da disciplina.
        </Subtitulo>
      </CabecalhoPagina>

      {mensagem && (
        <AvisoTopo>
          <Alert tipo="sucesso">{mensagem}</Alert>
        </AvisoTopo>
      )}

      <CampoBusca>
        <Label htmlFor="busca-posts">Buscar posts</Label>
        <Input
          id="busca-posts"
          type="search"
          value={busca}
          onChange={(evento) => setBusca(evento.target.value)}
          placeholder="Busque por palavra-chave, título ou autor(a)…"
          autoComplete="off"
        />
      </CampoBusca>

      {carregando && <LoadingBlock mensagem="Carregando posts…" />}

      {!carregando && erro && (
        <>
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
        </>
      )}

      {!carregando && !erro && posts.length === 0 && (
        <EmptyState
          titulo="Nenhum post publicado ainda"
          descricao="Assim que a primeira publicação for criada, ela aparecerá aqui."
        >
          {estaAutenticado && (
            <Button as={Link} to="/posts/novo" $compacto>
              Criar primeiro post
            </Button>
          )}
        </EmptyState>
      )}

      {!carregando && !erro && posts.length > 0 && (
        <>
          <ContagemResultados role="status">
            {termoBusca
              ? `${postsFiltrados.length} ${
                  postsFiltrados.length === 1 ? 'post encontrado' : 'posts encontrados'
                } para “${termoBusca}”`
              : `${posts.length} ${posts.length === 1 ? 'post publicado' : 'posts publicados'}`}
          </ContagemResultados>

          {postsFiltrados.length === 0 ? (
            <EmptyState
              titulo="Nenhum post encontrado"
              descricao={`Não encontramos resultados para “${termoBusca}”. Tente outra palavra-chave.`}
            >
              <Button
                type="button"
                $variante="secundario"
                $compacto
                onClick={() => setBusca('')}
              >
                Limpar busca
              </Button>
            </EmptyState>
          ) : (
            <Grade>
              {postsFiltrados.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </Grade>
          )}
        </>
      )}
    </section>
  );
}
