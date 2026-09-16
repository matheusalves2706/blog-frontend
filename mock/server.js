// =============================================================
// Servidor de API simulado — Blog Acadêmico (Tech Challenge)
// =============================================================
// Servidor HTTP sem dependências externas que implementa o mesmo
// contrato REST consumido pelo front-end (veja a seção
// "Integração com a API" do README). Útil para desenvolvimento e
// demonstrações quando o back-end real não estiver disponível.
//
// Uso:            npm run mock        → http://localhost:3000
// Login de teste: professor@blog.com / 123456
// =============================================================

import { randomUUID } from 'node:crypto';
import http from 'node:http';

const PORT = Number(process.env.PORT) || 3000;

const usuarios = [
  {
    id: 1,
    name: 'Professora Ana Souza',
    email: 'professor@blog.com',
    password: '123456',
  },
];

let posts = [
  {
    id: 1,
    title: 'Bem-vindos(as) ao blog da disciplina!',
    author: 'Professora Ana Souza',
    content:
      'Este espaço foi criado para compartilhar conteúdos, avisos e reflexões sobre a disciplina.\n\nAqui você encontrará materiais de apoio, resumos das aulas e dicas de estudo publicadas pelo corpo docente. Sinta-se à vontade para ler, comentar e sugerir temas.\n\nBons estudos e bom proveito!',
    createdAt: '2026-08-18T10:00:00.000Z',
    updatedAt: null,
  },
  {
    id: 2,
    title: 'Como estudar programação de forma consistente',
    author: 'Professor Carlos Lima',
    content:
      'Aprender a programar é mais sobre constância do que sobre talento. Estudar 30 minutos todos os dias costuma render mais do que maratonar uma vez por semana.\n\nAlgumas estratégias que funcionam bem: praticar com projetos pequenos, explicar o código em voz alta, revisar erros antigos e participar de comunidades.\n\nEscolha uma estratégia e experimente por duas semanas. Ajuste o que não funcionar e mantenha o que der resultado.',
    createdAt: '2026-08-25T13:30:00.000Z',
    updatedAt: null,
  },
  {
    id: 3,
    title: 'Guia rápido de Git e GitHub para iniciantes',
    author: 'Professora Ana Souza',
    content:
      'Git é o sistema de controle de versão que registra a evolução do seu código. O GitHub é a plataforma onde repositórios Git são hospedados e compartilhados.\n\nO fluxo básico é: criar um repositório, fazer commits frequentes com mensagens claras, criar branches para cada funcionalidade e abrir pull requests para revisão.\n\nA prática diária é o que consolida o aprendizado. Comece versionando até os menores exercícios.',
    createdAt: '2026-09-01T09:15:00.000Z',
    updatedAt: null,
  },
  {
    id: 4,
    title: 'Projeto em grupo: boas práticas de colaboração',
    author: 'Coordenação do curso',
    content:
      'Trabalhar em equipe é uma das competências mais valorizadas no mercado. Em projetos em grupo, combine desde o início as responsabilidades, os prazos e os canais de comunicação.\n\nRecomendações: reuniões curtas e objetivas, tarefas bem definidas, revisão de código por pares e documentação contínua.\n\nRegistre as decisões importantes para que qualquer pessoa da equipe consiga dar continuidade ao trabalho.',
    createdAt: '2026-09-08T16:45:00.000Z',
    updatedAt: null,
  },
];

let comentarios = [
  {
    id: 1,
    postId: 1,
    author: 'Estudante João Pedro',
    content: 'Que iniciativa ótima! Vou acompanhar as publicações.',
    createdAt: '2026-08-19T11:20:00.000Z',
  },
  {
    id: 2,
    postId: 1,
    author: 'Estudante Mariana Alves',
    content: 'Adorei o espaço. Sugiro um post sobre dicas de organização de estudos!',
    createdAt: '2026-08-20T14:05:00.000Z',
  },
  {
    id: 3,
    postId: 2,
    author: 'Estudante Rafael Nunes',
    content: 'Comecei a estudar 30 minutos por dia após ler este post e está funcionando.',
    createdAt: '2026-08-26T18:40:00.000Z',
  },
];

const cabecalhosCors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

function responder(res, status, dados) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    ...cabecalhosCors,
  });
  res.end(JSON.stringify(dados));
}

function responderErro(res, status, mensagem) {
  responder(res, status, { message: mensagem });
}

function lerCorpo(req) {
  return new Promise((resolver, rejeitar) => {
    let dados = '';

    req.on('data', (pedaco) => {
      dados += pedaco;
      if (dados.length > 1_000_000) {
        rejeitar(new Error('Corpo da requisição muito grande.'));
        req.destroy();
      }
    });

    req.on('end', () => {
      if (!dados) {
        resolver({});
        return;
      }
      try {
        resolver(JSON.parse(dados));
      } catch {
        rejeitar(new Error('JSON inválido no corpo da requisição.'));
      }
    });

    req.on('error', rejeitar);
  });
}

function estaAutenticado(req) {
  const cabecalho = String(req.headers.authorization ?? '');
  return cabecalho.startsWith('Bearer mock-token-');
}

function proximoId(lista) {
  return lista.length ? Math.max(...lista.map((item) => item.id)) + 1 : 1;
}

const servidor = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const caminho = url.pathname.replace(/\/+$/, '') || '/';
  const partes = caminho.split('/').filter(Boolean);

  if (req.method === 'OPTIONS') {
    res.writeHead(204, cabecalhosCors);
    return res.end();
  }

  try {
    // Informações básicas da API simulada.
    if (req.method === 'GET' && caminho === '/') {
      return responder(res, 200, {
        api: 'Blog Acadêmico — mock',
        endpoints: [
          'POST /auth/login',
          'GET /posts',
          'GET /posts/:id',
          'POST /posts',
          'PUT /posts/:id',
          'DELETE /posts/:id',
          'GET /posts/:id/comments',
          'POST /posts/:id/comments',
        ],
      });
    }

    // POST /auth/login
    if (req.method === 'POST' && caminho === '/auth/login') {
      const corpo = await lerCorpo(req);
      const email = String(corpo.email ?? '').toLowerCase();
      const senha = String(corpo.password ?? '');

      const usuario = usuarios.find((item) => item.email === email && item.password === senha);
      if (!usuario) {
        return responderErro(res, 401, 'E-mail ou senha inválidos.');
      }

      const { password, ...usuarioPublico } = usuario;
      return responder(res, 200, { token: `mock-token-${randomUUID()}`, user: usuarioPublico });
    }

    if (partes[0] === 'posts') {
      // GET /posts
      if (req.method === 'GET' && partes.length === 1) {
        const ordenados = [...posts].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );
        return responder(res, 200, ordenados);
      }

      // POST /posts
      if (req.method === 'POST' && partes.length === 1) {
        if (!estaAutenticado(req)) {
          return responderErro(res, 401, 'Autenticação necessária.');
        }

        const corpo = await lerCorpo(req);
        const novoPost = {
          id: proximoId(posts),
          title: String(corpo.title ?? '').trim(),
          author: String(corpo.author ?? '').trim(),
          content: String(corpo.content ?? '').trim(),
          createdAt: new Date().toISOString(),
          updatedAt: null,
        };

        if (!novoPost.title || !novoPost.author || !novoPost.content) {
          return responderErro(res, 400, 'Título, autor(a) e conteúdo são obrigatórios.');
        }

        posts.push(novoPost);
        return responder(res, 201, novoPost);
      }

      const idPost = Number(partes[1]);
      const post = posts.find((item) => item.id === idPost);

      if (!post) {
        return responderErro(res, 404, 'Post não encontrado.');
      }

      // GET /posts/:id
      if (req.method === 'GET' && partes.length === 2) {
        return responder(res, 200, post);
      }

      // PUT /posts/:id
      if (req.method === 'PUT' && partes.length === 2) {
        if (!estaAutenticado(req)) {
          return responderErro(res, 401, 'Autenticação necessária.');
        }

        const corpo = await lerCorpo(req);
        post.title = String(corpo.title ?? post.title).trim();
        post.author = String(corpo.author ?? post.author).trim();
        post.content = String(corpo.content ?? post.content).trim();
        post.updatedAt = new Date().toISOString();

        return responder(res, 200, post);
      }

      // DELETE /posts/:id
      if (req.method === 'DELETE' && partes.length === 2) {
        if (!estaAutenticado(req)) {
          return responderErro(res, 401, 'Autenticação necessária.');
        }

        posts = posts.filter((item) => item.id !== idPost);
        comentarios = comentarios.filter((item) => item.postId !== idPost);

        return responder(res, 200, { message: 'Post excluído com sucesso.' });
      }

      // Rotas de comentários: /posts/:id/comments
      if (partes.length === 3 && partes[2] === 'comments') {
        if (req.method === 'GET') {
          const doPost = comentarios
            .filter((item) => item.postId === idPost)
            .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
          return responder(res, 200, doPost);
        }

        if (req.method === 'POST') {
          if (!estaAutenticado(req)) {
            return responderErro(res, 401, 'Autenticação necessária.');
          }

          const corpo = await lerCorpo(req);
          const conteudo = String(corpo.content ?? '').trim();
          if (!conteudo) {
            return responderErro(res, 400, 'O comentário não pode ficar vazio.');
          }

          const novoComentario = {
            id: proximoId(comentarios),
            postId: idPost,
            author: String(corpo.author ?? '').trim() || 'Anônimo(a)',
            content: conteudo,
            createdAt: new Date().toISOString(),
          };

          comentarios.push(novoComentario);
          return responder(res, 201, novoComentario);
        }
      }
    }

    return responderErro(res, 404, `Rota não encontrada: ${req.method} ${caminho}`);
  } catch (erro) {
    return responderErro(res, 500, `Erro interno no servidor mock: ${erro.message}`);
  }
});

servidor.listen(PORT, () => {
  console.log('');
  console.log('=====================================================');
  console.log('  API simulada do Blog Acadêmico em execução');
  console.log(`  URL base: http://localhost:${PORT}`);
  console.log('  Login de teste: professor@blog.com / 123456');
  console.log('  (a URL base deve ser configurada no .env do front)');
  console.log('=====================================================');
  console.log('');
});
