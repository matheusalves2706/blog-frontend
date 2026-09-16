import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { PostForm } from '../components/PostForm';
import { Alert } from '../components/ui/Alert';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { LoadingBlock } from '../components/ui/Feedback';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { mensagemDeErro } from '../services/api';
import { atualizarPost, obterPost } from '../services/posts';

const Cabecalho = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 24px;
`;

const Titulo = styled.h1`
  margin: 0;
  font-size: clamp(1.5rem, 4vw, 2rem);
`;

const Subtitulo = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const AcoesErro = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 12px;
  flex-wrap: wrap;
`;

/** Página de edição de postagens existentes. */
export function EditPost() {
  useDocumentTitle('Editar post');
  const { id } = useParams();
  const navegar = useNavigate();

  const [post, setPost] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [naoEncontrado, setNaoEncontrado] = useState(false);
  const [tentativa, setTentativa] = useState(0);

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

  async function salvar(valores) {
    await atualizarPost(id, valores);
    navegar(`/posts/${id}`, {
      replace: true,
      state: { mensagem: 'Post atualizado com sucesso!' },
    });
  }

  if (carregando) {
    return <LoadingBlock mensagem="Carregando post…" />;
  }

  if (naoEncontrado) {
    return (
      <section>
        <Alert tipo="aviso">Post não encontrado. Ele pode ter sido removido.</Alert>
        <AcoesErro>
          <Button as={Link} to="/admin" $variante="secundario" $compacto>
            Voltar para a administração
          </Button>
        </AcoesErro>
      </section>
    );
  }

  if (erro) {
    return (
      <section>
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

  return (
    <section>
      <Cabecalho>
        <Titulo>Editar post</Titulo>
        <Subtitulo>Ajuste o conteúdo e salve as alterações.</Subtitulo>
      </Cabecalho>

      <Card>
        <PostForm
          valoresIniciais={post}
          aoSalvar={salvar}
          rotuloEnviar="Salvar alterações"
          rotuloEnviando="Salvando…"
          destinoCancelar={`/posts/${id}`}
        />
      </Card>
    </section>
  );
}
