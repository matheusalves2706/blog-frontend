import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { Alert } from '../components/ui/Alert';
import { Button } from '../components/ui/Button';
import { EmptyState, LoadingBlock } from '../components/ui/Feedback';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { mensagemDeErro } from '../services/api';
import { excluirPost, listarPosts } from '../services/posts';
import { media } from '../styles/mixins';
import { formatarData } from '../utils/data';

const Cabecalho = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;

  ${media.md`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  `}
`;

const BlocoTitulo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Titulo = styled.h1`
  margin: 0;
  font-size: clamp(1.5rem, 4vw, 2rem);
`;

const Subtitulo = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const MensagensTopo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
`;

const TabelaWrapper = styled.div`
  overflow-x: auto;
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const Tabela = styled.table`
  width: 100%;
  min-width: 520px;
  border-collapse: collapse;

  th,
  td {
    padding: 14px 16px;
    text-align: left;
  }

  tbody tr + tr td {
    border-top: 1px solid ${({ theme }) => theme.colors.border};
  }
`;

const Th = styled.th`
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: ${({ theme }) => theme.colors.textMuted};
  background-color: ${({ theme }) => theme.colors.background};
`;

const Td = styled.td`
  font-size: 0.95rem;
`;

const ThAutor = styled(Th)`
  display: none;

  ${media.sm`
    display: table-cell;
  `}
`;

const TdAutor = styled(Td)`
  display: none;

  ${media.sm`
    display: table-cell;
  `}
`;

const ThData = styled(Th)`
  display: none;

  ${media.md`
    display: table-cell;
  `}
`;

const TdData = styled(Td)`
  display: none;

  ${media.md`
    display: table-cell;
  `}
`;

const ThAcoes = styled(Th)`
  text-align: right;
`;

const LinkTitulo = styled(Link)`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: underline;
  }
`;

const AcoesLinha = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  flex-wrap: wrap;
`;

const AcoesErro = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 12px;
`;

/** Página administrativa: lista todos os posts com ações de editar e excluir. */
export function Admin() {
  useDocumentTitle('Administração');
  const localizacao = useLocation();

  const mensagemNavegacao = localizacao.state?.mensagem ?? null;

  const [posts, setPosts] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [erroAcao, setErroAcao] = useState(null);
  const [mensagem, setMensagem] = useState(null);
  const [tentativa, setTentativa] = useState(0);
  const [excluindoId, setExcluindoId] = useState(null);

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

  async function confirmarExclusao(post) {
    const confirmado = window.confirm(
      `Excluir o post "${post.titulo}"? Esta ação não pode ser desfeita.`,
    );
    if (!confirmado) return;

    try {
      setExcluindoId(post.id);
      setErroAcao(null);
      setMensagem(null);
      await excluirPost(post.id);
      setPosts((atuais) => atuais.filter((item) => item.id !== post.id));
      setMensagem('Post excluído com sucesso.');
    } catch (erroCapturado) {
      setErroAcao(mensagemDeErro(erroCapturado));
    } finally {
      setExcluindoId(null);
    }
  }

  return (
    <section>
      <Cabecalho>
        <BlocoTitulo>
          <Titulo>Administração de posts</Titulo>
          <Subtitulo>Gerencie todas as publicações: edite ou exclua posts existentes.</Subtitulo>
        </BlocoTitulo>
        <Button as={Link} to="/posts/novo">
          Novo post
        </Button>
      </Cabecalho>

      {(mensagem || mensagemNavegacao || erroAcao) && (
        <MensagensTopo>
          {mensagemNavegacao && <Alert tipo="sucesso">{mensagemNavegacao}</Alert>}
          {mensagem && <Alert tipo="sucesso">{mensagem}</Alert>}
          {erroAcao && <Alert tipo="erro">{erroAcao}</Alert>}
        </MensagensTopo>
      )}

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
          titulo="Nenhum post cadastrado"
          descricao="Crie a primeira publicação para vê-la listada aqui."
        >
          <Button as={Link} to="/posts/novo" $compacto>
            Novo post
          </Button>
        </EmptyState>
      )}

      {!carregando && !erro && posts.length > 0 && (
        <TabelaWrapper>
          <Tabela>
            <thead>
              <tr>
                <Th>Título</Th>
                <ThAutor>Autor(a)</ThAutor>
                <ThData>Data</ThData>
                <ThAcoes>Ações</ThAcoes>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id}>
                  <Td>
                    <LinkTitulo to={`/posts/${post.id}`}>{post.titulo}</LinkTitulo>
                  </Td>
                  <TdAutor>{post.autor}</TdAutor>
                  <TdData>{formatarData(post.criadoEm)}</TdData>
                  <Td>
                    <AcoesLinha>
                      <Button as={Link} to={`/posts/${post.id}/editar`} $variante="secundario" $compacto>
                        Editar
                      </Button>
                      <Button
                        type="button"
                        $variante="perigo"
                        $compacto
                        disabled={excluindoId === post.id}
                        onClick={() => confirmarExclusao(post)}
                      >
                        {excluindoId === post.id ? 'Excluindo…' : 'Excluir'}
                      </Button>
                    </AcoesLinha>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Tabela>
        </TabelaWrapper>
      )}
    </section>
  );
}
