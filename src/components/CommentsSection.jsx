import { useEffect, useId, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../hooks/useAuth';
import { mensagemDeErro } from '../services/api';
import { criarComentario, listarComentarios } from '../services/posts';
import { formatarDataHora } from '../utils/data';
import { Alert } from './ui/Alert';
import { Button } from './ui/Button';
import { LoadingBlock } from './ui/Feedback';
import {
  CampoGrupo,
  ErroCampo,
  Formulario,
  Input,
  Label,
  Textarea,
} from './ui/FormFields';

const Secao = styled.section`
  margin-top: 40px;
`;

const TituloSecao = styled.h2`
  margin: 0 0 16px;
  font-size: 1.25rem;
`;

const Lista = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 0 0 24px;
  padding: 0;
  list-style: none;
`;

const Comentario = styled.li`
  padding: 14px 16px;
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
`;

const MetaComentario = styled.p`
  margin: 0 0 6px;
  font-size: 0.82rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const TextoComentario = styled.p`
  margin: 0;
  white-space: pre-line;
`;

const AvisoSemComentarios = styled.p`
  margin: 0 0 24px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const FormularioComentario = styled(Formulario)`
  max-width: 640px;

  ${Textarea} {
    min-height: 120px;
  }
`;

const LinhaAcoes = styled.div`
  display: flex;
  gap: 12px;
  align-self: flex-start;
`;

/**
 * Seção de comentários do post (recurso opcional do back-end).
 * Caso a API não implemente o endpoint, a seção informa o usuário
 * em vez de quebrar a página.
 */
export function CommentsSection({ postId }) {
  const { estaAutenticado, usuario } = useAuth();
  const idBase = useId();
  const idAutor = `${idBase}-autor`;
  const idConteudo = `${idBase}-conteudo`;

  const [comentarios, setComentarios] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [indisponivel, setIndisponivel] = useState(false);

  const [campos, setCampos] = useState(() => ({
    autor: usuario?.nome ?? '',
    conteudo: '',
  }));
  const [erros, setErros] = useState({});
  const [erroEnvio, setErroEnvio] = useState(null);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    let componenteAtivo = true;

    async function carregarComentarios() {
      try {
        setCarregando(true);
        setErro(null);
        const lista = await listarComentarios(postId);
        if (!componenteAtivo) return;
        setComentarios(lista);
        setIndisponivel(false);
      } catch (erroCapturado) {
        if (!componenteAtivo) return;

        // 404 indica que o back-end não implementa comentários (recurso opcional).
        if (erroCapturado?.response?.status === 404) {
          setIndisponivel(true);
        } else {
          setErro(mensagemDeErro(erroCapturado));
        }
      } finally {
        if (componenteAtivo) setCarregando(false);
      }
    }

    carregarComentarios();
    return () => {
      componenteAtivo = false;
    };
  }, [postId]);

  function alterarCampo(evento) {
    const { name, value } = evento.target;
    setCampos((atual) => ({ ...atual, [name]: value }));
    setErros((atual) => ({ ...atual, [name]: undefined }));
  }

  async function enviarComentario(evento) {
    evento.preventDefault();

    const errosEncontrados = {};
    if (!campos.autor.trim()) errosEncontrados.autor = 'Informe seu nome.';
    if (!campos.conteudo.trim()) errosEncontrados.conteudo = 'Escreva um comentário.';
    setErros(errosEncontrados);
    if (Object.keys(errosEncontrados).length > 0) return;

    try {
      setEnviando(true);
      setErroEnvio(null);
      const novoComentario = await criarComentario(postId, {
        autor: campos.autor.trim(),
        conteudo: campos.conteudo.trim(),
      });
      setComentarios((atuais) => [...atuais, novoComentario]);
      setCampos((atual) => ({ ...atual, conteudo: '' }));
    } catch (erroCapturado) {
      setErroEnvio(mensagemDeErro(erroCapturado));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <Secao aria-labelledby={`${idBase}-titulo-secao`}>
      <TituloSecao id={`${idBase}-titulo-secao`}>Comentários</TituloSecao>

      {carregando && <LoadingBlock mensagem="Carregando comentários…" />}

      {!carregando && indisponivel && (
        <Alert tipo="aviso">
          O recurso de comentários não está disponível neste back-end.
        </Alert>
      )}

      {!carregando && erro && <Alert tipo="erro">{erro}</Alert>}

      {!carregando && !indisponivel && !erro && (
        <>
          {comentarios.length === 0 ? (
            <AvisoSemComentarios>
              Nenhum comentário ainda. Seja a primeira pessoa a comentar!
            </AvisoSemComentarios>
          ) : (
            <Lista>
              {comentarios.map((comentario) => (
                <Comentario key={comentario.id ?? `${comentario.autor}-${comentario.criadoEm}`}>
                  <MetaComentario>
                    <strong>{comentario.autor}</strong>
                    {comentario.criadoEm && ` · ${formatarDataHora(comentario.criadoEm)}`}
                  </MetaComentario>
                  <TextoComentario>{comentario.conteudo}</TextoComentario>
                </Comentario>
              ))}
            </Lista>
          )}

          {estaAutenticado ? (
            <FormularioComentario onSubmit={enviarComentario} noValidate>
              {erroEnvio && <Alert tipo="erro">{erroEnvio}</Alert>}

              <CampoGrupo>
                <Label htmlFor={idAutor}>Seu nome</Label>
                <Input
                  id={idAutor}
                  name="autor"
                  type="text"
                  value={campos.autor}
                  onChange={alterarCampo}
                  maxLength={80}
                  aria-invalid={Boolean(erros.autor)}
                  aria-describedby={erros.autor ? `${idAutor}-erro` : undefined}
                  required
                />
                {erros.autor && (
                  <ErroCampo id={`${idAutor}-erro`} role="alert">
                    {erros.autor}
                  </ErroCampo>
                )}
              </CampoGrupo>

              <CampoGrupo>
                <Label htmlFor={idConteudo}>Comentário</Label>
                <Textarea
                  id={idConteudo}
                  name="conteudo"
                  value={campos.conteudo}
                  onChange={alterarCampo}
                  maxLength={2000}
                  placeholder="Compartilhe sua contribuição"
                  aria-invalid={Boolean(erros.conteudo)}
                  aria-describedby={erros.conteudo ? `${idConteudo}-erro` : undefined}
                  required
                />
                {erros.conteudo && (
                  <ErroCampo id={`${idConteudo}-erro`} role="alert">
                    {erros.conteudo}
                  </ErroCampo>
                )}
              </CampoGrupo>

              <LinhaAcoes>
                <Button type="submit" $compacto disabled={enviando}>
                  {enviando ? 'Enviando…' : 'Comentar'}
                </Button>
              </LinhaAcoes>
            </FormularioComentario>
          ) : (
            <Alert tipo="info">
              <Link to="/login">Entre</Link> para participar da discussão.
            </Alert>
          )}
        </>
      )}
    </Secao>
  );
}
