import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { PostForm } from '../components/PostForm';
import { Card } from '../components/ui/Card';
import { useAuth } from '../hooks/useAuth';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { criarPost } from '../services/posts';

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

/** Página de criação de postagens (área do professor). */
export function CreatePost() {
  useDocumentTitle('Novo post');
  const { usuario } = useAuth();
  const navegar = useNavigate();

  async function salvar(valores) {
    const criado = await criarPost(valores);

    // Alguns back-ends não devolvem o recurso criado; nesse caso
    // voltamos para a lista principal com a mensagem de sucesso.
    const destino = criado?.id != null ? `/posts/${criado.id}` : '/';
    navegar(destino, { replace: true, state: { mensagem: 'Post publicado com sucesso!' } });
  }

  return (
    <section>
      <Cabecalho>
        <Titulo>Novo post</Titulo>
        <Subtitulo>Compartilhe um conteúdo com os(as) estudantes da disciplina.</Subtitulo>
      </Cabecalho>

      <Card>
        <PostForm
          valoresIniciais={{ titulo: '', autor: usuario?.nome ?? '', conteudo: '' }}
          aoSalvar={salvar}
          rotuloEnviar="Publicar post"
          rotuloEnviando="Publicando…"
          destinoCancelar="/"
        />
      </Card>
    </section>
  );
}
