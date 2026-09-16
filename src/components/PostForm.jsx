import { useId, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { mensagemDeErro } from '../services/api';
import { Alert } from './ui/Alert';
import { Button } from './ui/Button';
import {
  AjudaCampo,
  CampoGrupo,
  ErroCampo,
  Formulario,
  Input,
  Label,
  RodapeCampo,
  Textarea,
} from './ui/FormFields';

const MAX_TITULO = 120;
const MAX_AUTOR = 80;
const MAX_CONTEUDO = 8000;

const Acoes = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;

function validarCampos(valores) {
  const erros = {};
  const titulo = valores.titulo.trim();
  const autor = valores.autor.trim();
  const conteudo = valores.conteudo.trim();

  if (!titulo) {
    erros.titulo = 'Informe o título do post.';
  } else if (titulo.length < 5) {
    erros.titulo = 'O título deve ter pelo menos 5 caracteres.';
  }

  if (!autor) {
    erros.autor = 'Informe o nome do(a) autor(a).';
  }

  if (!conteudo) {
    erros.conteudo = 'Escreva o conteúdo do post.';
  } else if (conteudo.length < 20) {
    erros.conteudo = 'O conteúdo deve ter pelo menos 20 caracteres.';
  }

  return erros;
}

/**
 * Formulário compartilhado entre criação e edição de posts.
 * As páginas cuidam apenas da chamada à API e da navegação pós-salvamento.
 */
export function PostForm({
  valoresIniciais,
  aoSalvar,
  rotuloEnviar = 'Publicar post',
  rotuloEnviando = 'Enviando…',
  destinoCancelar = '/',
}) {
  const idBase = useId();
  const idTitulo = `${idBase}-titulo`;
  const idAutor = `${idBase}-autor`;
  const idConteudo = `${idBase}-conteudo`;

  const [valores, setValores] = useState(() => ({
    titulo: valoresIniciais?.titulo ?? '',
    autor: valoresIniciais?.autor ?? '',
    conteudo: valoresIniciais?.conteudo ?? '',
  }));
  const [erros, setErros] = useState({});
  const [erroGeral, setErroGeral] = useState(null);
  const [enviando, setEnviando] = useState(false);

  function alterarCampo(evento) {
    const { name, value } = evento.target;
    setValores((atual) => ({ ...atual, [name]: value }));
    setErros((atual) => ({ ...atual, [name]: undefined }));
  }

  async function enviar(evento) {
    evento.preventDefault();

    const errosEncontrados = validarCampos(valores);
    setErros(errosEncontrados);
    if (Object.keys(errosEncontrados).length > 0) {
      return;
    }

    const valoresLimpos = {
      titulo: valores.titulo.trim(),
      autor: valores.autor.trim(),
      conteudo: valores.conteudo.trim(),
    };

    try {
      setEnviando(true);
      setErroGeral(null);
      await aoSalvar(valoresLimpos);
    } catch (erro) {
      setErroGeral(mensagemDeErro(erro));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <Formulario onSubmit={enviar} noValidate>
      {erroGeral && <Alert tipo="erro">{erroGeral}</Alert>}

      <CampoGrupo>
        <Label htmlFor={idTitulo}>Título</Label>
        <Input
          id={idTitulo}
          name="titulo"
          type="text"
          value={valores.titulo}
          onChange={alterarCampo}
          maxLength={MAX_TITULO}
          placeholder="Um título claro e objetivo"
          aria-invalid={Boolean(erros.titulo)}
          aria-describedby={erros.titulo ? `${idTitulo}-erro` : undefined}
          required
        />
        {erros.titulo && (
          <ErroCampo id={`${idTitulo}-erro`} role="alert">
            {erros.titulo}
          </ErroCampo>
        )}
      </CampoGrupo>

      <CampoGrupo>
        <Label htmlFor={idAutor}>Autor(a)</Label>
        <Input
          id={idAutor}
          name="autor"
          type="text"
          value={valores.autor}
          onChange={alterarCampo}
          maxLength={MAX_AUTOR}
          placeholder="Nome de quem assina o post"
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
        <Label htmlFor={idConteudo}>Conteúdo</Label>
        <Textarea
          id={idConteudo}
          name="conteudo"
          value={valores.conteudo}
          onChange={alterarCampo}
          maxLength={MAX_CONTEUDO}
          placeholder={'Escreva o conteúdo do post…\n\nDica: separe parágrafos com uma linha em branco.'}
          aria-invalid={Boolean(erros.conteudo)}
          aria-describedby={erros.conteudo ? `${idConteudo}-erro` : undefined}
          required
        />
        <RodapeCampo>
          <AjudaCampo>
            {valores.conteudo.length.toLocaleString('pt-BR')} de{' '}
            {MAX_CONTEUDO.toLocaleString('pt-BR')} caracteres
          </AjudaCampo>
          {erros.conteudo && (
            <ErroCampo id={`${idConteudo}-erro`} role="alert">
              {erros.conteudo}
            </ErroCampo>
          )}
        </RodapeCampo>
      </CampoGrupo>

      <Acoes>
        <Button type="submit" disabled={enviando}>
          {enviando ? rotuloEnviando : rotuloEnviar}
        </Button>
        <Button as={Link} to={destinoCancelar} $variante="secundario">
          Cancelar
        </Button>
      </Acoes>
    </Formulario>
  );
}
