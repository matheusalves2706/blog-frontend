# Blog Acadêmico — Front-end (Tech Challenge)

Interface gráfica em **React** para a aplicação de blogging desenvolvida durante o Tech Challenge. A aplicação permite que **professores(as)** publiquem e gerenciem postagens e que **estudantes** leiam e comentem os conteúdos, consumindo os endpoints REST do back-end.

> **Entregáveis relacionados**
>
> - Back-end (fase anterior): API REST em Node.js — _link do repositório a preencher_
> - Vídeo de apresentação: _link a preencher_ (roteiro em [`docs/ROTEIRO_VIDEO.md`](docs/ROTEIRO_VIDEO.md))
> - Documento de arquitetura: [`docs/ARQUITETURA.md`](docs/ARQUITETURA.md)
> - Relato de experiências: [`docs/RELATO_EXPERIENCIAS.md`](docs/RELATO_EXPERIENCIAS.md)

---

## Sumário

- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Como rodar o projeto](#como-rodar-o-projeto)
- [API simulada (mock)](#api-simulada-mock)
- [Scripts disponíveis](#scripts-disponíveis)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [Integração com a API](#integração-com-a-api)
- [Autenticação e autorização](#autenticação-e-autorização)
- [Rotas da aplicação](#rotas-da-aplicação)
- [Responsividade e acessibilidade](#responsividade-e-acessibilidade)
- [Testes](#testes)
- [Docker](#docker)
- [CI/CD](#cicd)
- [Estrutura de pastas](#estrutura-de-pastas)
- [Decisões técnicas](#decisões-técnicas)
- [Melhorias futuras](#melhorias-futuras)

---

## Funcionalidades

| Requisito do desafio | Onde está implementado |
| --- | --- |
| Lista de todos os posts com título, autor(a) e resumo | Página inicial (`src/pages/Home.jsx` + `src/components/PostCard.jsx`) |
| Busca por palavras-chave | Campo de busca na home, filtrando por título, autor(a) e conteúdo (ignora acentos e maiúsculas) |
| Leitura do post completo | `src/pages/PostDetail.jsx` |
| Comentários nos posts (opcional) | `src/components/CommentsSection.jsx` (degrada com aviso caso o back-end não implemente o endpoint) |
| Criação de postagens (título, conteúdo, autor(a)) | `src/pages/CreatePost.jsx` + formulário compartilhado `src/components/PostForm.jsx` |
| Edição de postagens com carga dos dados atuais | `src/pages/EditPost.jsx` |
| Página administrativa com editar/excluir | `src/pages/Admin.jsx` (confirmação antes de excluir e feedback de sucesso/erro) |
| Login para professores(as) | `src/pages/Login.jsx` + `src/contexts/AuthContext.jsx` |
| Apenas autenticados acessam criação/edição/administração | `src/components/ProtectedRoute.jsx` aplicado no mapa de rotas |

Recursos adicionais implementados:

- Feedback visual de carregamento, erro (com opção de tentar novamente) e estados vazios.
- Mensagens de sucesso após publicar, editar e excluir (navegação com feedback).
- Sessão persistida no navegador: recarregar a página mantém o login.
- Expiração de sessão tratada globalmente: qualquer resposta `401` limpa a sessão e redireciona para o login.
- Página 404 para endereços inexistentes.

## Tecnologias

| Categoria | Tecnologia |
| --- | --- |
| Biblioteca | [React 19](https://react.dev/) (hooks e componentes funcionais) |
| Build/dev server | [Vite 8](https://vite.dev/) |
| Roteamento | [React Router 7](https://reactrouter.com/) |
| Estilização | [styled-components 6](https://styled-components.com/) (tema central + media queries) |
| Estado global | [Context API](https://react.dev/reference/react/createContext) (sessão do usuário) |
| HTTP | [axios](https://axios-http.com/) (instância única + interceptors) |
| Testes | [Vitest](https://vitest.dev/) |
| Empacotamento | Docker (build multi-stage) + Nginx |
| CI/CD | GitHub Actions |

## Como rodar o projeto

### Pré-requisitos

- **Node.js 18 ou superior** (desenvolvido e testado com Node 24) e npm;
- Back-end da aplicação em execução **ou** a API simulada deste repositório (veja a seção seguinte);
- Opcional: Docker + Docker Compose para executar a versão de produção empacotada.

### Passo a passo

```bash
# 1. Clone o repositório
git clone <url-do-repositorio> blog-frontend
cd blog-frontend

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
#    (copie o exemplo e ajuste a URL do seu back-end, se necessário)
cp .env.example .env

# 4. Suba a API simulada (em um terminal separado), caso não tenha o back-end real
npm run mock

# 5. Inicie o servidor de desenvolvimento
npm run dev
```

A aplicação estará disponível em **http://localhost:5173**.

> **Credenciais de teste do mock:** `professor@blog.com` / `123456`

## API simulada (mock)

O diretório [`mock/`](mock/server.js) contém um servidor HTTP **sem dependências externas** que implementa o mesmo contrato REST consumido pelo front-end, com posts, comentários e login de exemplo. Ele é útil para:

- desenvolver o front-end sem depender do back-end em execução;
- demonstrar a aplicação (ex.: gravação do vídeo) de forma previsível.

```bash
npm run mock   # sobe a API simulada em http://localhost:3000
```

A URL padrão do `.env` (`VITE_API_URL=http://localhost:3000`) já aponta para o mock. Basta trocar a variável para apontar ao back-end real.

## Scripts disponíveis

| Script | Descrição |
| --- | --- |
| `npm run dev` | Inicia o servidor de desenvolvimento do Vite (porta 5173). |
| `npm run build` | Gera o bundle de produção em `dist/`. |
| `npm run preview` | Serve localmente o bundle de produção (porta 4173). |
| `npm test` | Executa a suíte de testes com Vitest. |
| `npm run mock` | Sobe a API simulada (porta 3000). |

## Variáveis de ambiente

As variáveis são lidas pelo Vite em **tempo de build** (dica: use o arquivo `.env` para desenvolvimento e o `--build-arg` do Docker para produção).

| Variável | Padrão | Descrição |
| --- | --- | --- |
| `VITE_API_URL` | `http://localhost:3000` | URL base da API REST. Pode incluir prefixo (ex.: `https://api.exemplo.com/v1`). |

> ⚠️ Como o valor é embutido no bundle durante o build, alterar `VITE_API_URL` exige **recompilar** a aplicação (relevante também para a imagem Docker).

### Dica: evitando CORS com proxy do Vite

Caso o back-end não permita a origem do front-end em desenvolvimento, é possível usar o proxy do Vite. Em `vite.config.js`:

```js
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
    },
  },
},
```

E definir `VITE_API_URL=/api` no `.env`.

## Integração com a API

Toda a comunicação passa por [`src/services/`](src/services):

- `api.js` — instância única do axios (URL base via `VITE_API_URL`), interceptor que anexa o token `Bearer` e tratamento global de `401`;
- `auth.js` — login e persistência da sessão;
- `posts.js` — CRUD de posts e comentários, com **normalização dos payloads**.

### Contrato REST esperado

| Método | Rota | Autenticação | Corpo (JSON) | Resposta esperada |
| --- | --- | --- | --- | --- |
| `POST` | `/auth/login` | Não | `{ "email": "...", "password": "..." }` | `{ "token": "...", "user": { "id", "name", "email" } }` |
| `GET` | `/posts` | Não | — | `[ { "id", "title", "author", "content", "createdAt", "updatedAt" } ]` |
| `GET` | `/posts/:id` | Não | — | `{ "id", "title", "author", "content", ... }` |
| `POST` | `/posts` | Sim (Bearer) | `{ "title", "author", "content" }` | Post criado (ou mensagem de sucesso) |
| `PUT` | `/posts/:id` | Sim (Bearer) | `{ "title", "author", "content" }` | Post atualizado |
| `DELETE` | `/posts/:id` | Sim (Bearer) | — | Confirmação de exclusão |
| `GET` | `/posts/:id/comments` | Não | — | `[ { "id", "author", "content", "createdAt" } ]` (opcional) |
| `POST` | `/posts/:id/comments` | Sim (Bearer) | `{ "author", "content" }` | Comentário criado (opcional) |

### Variações de contrato aceitas

Para facilitar a integração com back-ends distintos, a camada de serviços normaliza variações comuns de nomes de campos:

| Campo esperado | Variações aceitas | Modelo interno |
| --- | --- | --- |
| `title` | `titulo` | `titulo` |
| `author` | `autor` | `autor` |
| `content` | `conteudo`, `text` (comentários) | `conteudo` |
| `createdAt` | `criadoEm`, `data` | `criadoEm` |
| `user` | `usuario` | `usuario` |
| `name` | `nome` | `nome` |
| `token` | `accessToken` | `token` |

Respostas embrulhadas (ex.: `{ "posts": [...] }` ou `{ "data": [...] }`) também são tratadas. Se o seu back-end usar outros nomes, o ajuste é feito em um único lugar: `src/services/posts.js` e `src/services/auth.js`.

## Autenticação e autorização

1. O(a) professor(a) envia e-mail e senha na página `/login`.
2. A API devolve um `token` (JWT) e os dados do usuário.
3. A sessão é persistida no `localStorage` e o token é anexado automaticamente em todas as requisições autenticadas (`Authorization: Bearer <token>`).
4. Rotas de **criação**, **edição** e **administração** são envolvidas pelo componente `ProtectedRoute`: sem sessão, o usuário é redirecionado ao login **guardando o destino original** e retorna a ele após autenticar.
5. Ao sair, a sessão é limpa. Se a API responder `401` em qualquer requisição, a sessão é encerrada automaticamente.

> Observação de segurança: este projeto de estudo mantém o token no `localStorage` por simplicidade. Em cenários sensíveis, avalie cookies `HttpOnly` com o token gerenciado pelo back-end.

## Rotas da aplicação

| Rota | Página | Acesso |
| --- | --- | --- |
| `/` | Lista de posts com busca | Público |
| `/posts/:id` | Leitura do post + comentários | Público (comentar exige login) |
| `/login` | Login de professores(as) | Público |
| `/posts/novo` | Criação de post | Professor(a) autenticado(a) |
| `/posts/:id/editar` | Edição de post | Professor(a) autenticado(a) |
| `/admin` | Administração (listar/editar/excluir) | Professor(a) autenticado(a) |
| `*` | Página 404 | Público |

## Responsividade e acessibilidade

**Responsividade (mobile first):**

- grids de cards que se reorganizam automaticamente (`auto-fill` + `minmax`);
- navbar com menu colapsável em telas pequenas;
- tabela administrativa que oculta colunas no mobile e permite rolagem horizontal;
- breakpoints centralizados em `src/styles/mixins.js` (480px, 768px, 1024px).

**Acessibilidade:**

- HTML semântico (`header`, `main`, `nav`, `article`, `footer`, `section`);
- todos os campos com `label` associado e mensagens de erro ligadas por `aria-describedby`;
- indicação de erro com `aria-invalid` e papel `alert`;
- rodapés de carregamento com `role="status"`;
- menu mobile com `aria-expanded`/`aria-controls`;
- foco visível padronizado e navegação por teclado em todos os controles;
- títulos de página dinâmicos (hook `useDocumentTitle`).

## Testes

```bash
npm test
```

Cobertura atual (Vitest):

- `src/utils/texto.test.js` — normalização de texto (acentos/caixa), resumo de conteúdo e filtro de busca;
- `src/services/posts.test.js` — normalização dos payloads do back-end (contrato em inglês, variações em português e valores padrão).

## Docker

A imagem usa **build multi-stage**: compila com Node.js e serve os arquivos estáticos com Nginx (configurado com fallback de SPA em [`nginx.conf`](nginx.conf), para que rotas como `/posts/1` funcionem ao recarregar a página).

```bash
# Build (a URL da API é embutida em tempo de build)
docker build --build-arg VITE_API_URL=https://api.exemplo.com -t blog-frontend .

# Execução
docker run --rm -p 8080:80 blog-frontend

# Ou via Docker Compose (usa VITE_API_URL do ambiente, padrão http://localhost:3000)
docker compose up --build
```

A aplicação ficará disponível em **http://localhost:8080**.

## CI/CD

Pipelines em [`.github/workflows/`](.github/workflows):

- **`ci.yml`** — a cada push/PR: instala dependências (`npm ci`), executa os testes, gera o build de produção e valida o build da imagem Docker;
- **`cd.yml`** — em pushes para `main`/`master` e tags `v*`: constrói e publica a imagem no GitHub Container Registry (`ghcr.io/<org>/<repo>`).

## Estrutura de pastas

```
blog-frontend/
├── .github/workflows/     # Pipelines de CI e CD
├── docs/                  # Documentação técnica complementar
├── mock/                  # API simulada (Node.js, sem dependências)
├── public/                # Arquivos estáticos servidos na raiz
├── src/
│   ├── components/        # Componentes reutilizáveis
│   │   ├── layout/        # Navbar e Footer
│   │   └── ui/            # Botões, campos de formulário, alertas, feedback
│   ├── contexts/          # Context API (sessão do usuário)
│   ├── hooks/             # Hooks customizados (useAuth, useDocumentTitle)
│   ├── pages/             # Uma página por rota
│   ├── routes/            # Mapa de rotas da aplicação
│   ├── services/          # Integração com a API REST (axios + normalização)
│   ├── styles/            # Tema, estilos globais e media queries
│   ├── utils/             # Funções de texto e data
│   ├── App.jsx            # Composição da aplicação
│   └── main.jsx           # Ponto de entrada (ReactDOM + BrowserRouter)
├── Dockerfile             # Build multi-stage (Node + Nginx)
├── nginx.conf             # Configuração do Nginx (fallback de SPA)
├── docker-compose.yml     # Orquestração local do contêiner
└── vite.config.js         # Configuração do Vite
```

## Decisões técnicas

| Decisão | Justificativa |
| --- | --- |
| **Vite** como ferramenta de build | Servidor de desenvolvimento instantâneo e build otimizado; é o padrão atual para projetos React. |
| **styled-components** | Atende ao requisito de estilização; permite tema central, escopo por componente e media queries reutilizáveis. |
| **Context API** (em vez de Redux) | O único estado verdadeiramente global é a sessão do usuário; Context resolve com menos complexidade. O restante do estado é local às páginas. |
| **axios com interceptors** | Centraliza URL base, token e tratamento de `401`, evitando repetição em cada chamada. |
| **Camada de serviços com normalização** | Isola o front-end de variações do contrato do back-end (facilita trocar de API sem tocar nas páginas). |
| **Busca no cliente** | Funciona com qualquer back-end (que pode não implementar `?search=`), com resposta imediata; pode evoluir para busca no servidor quando houver paginação. |
| **Vitest** | Mesma configuração do Vite, execução rápida e integração simples com o CI. |
| **Docker multi-stage com Nginx** | Imagem final enxuta (sem Node) e com fallback de SPA configurado para o React Router. |

## Melhorias futuras

- Paginação/rolagem infinita na lista (com busca no servidor).
- Papéis de usuário (professor(a) × estudante) com permissões distintas.
- Testes de componentes e fluxos com Testing Library.
- Editor de conteúdo rich text (Markdown) com pré-visualização.
- Imagem de capa e categorias/tags nos posts.
- TanStack Query para cache de requisições.
- Tema escuro e internacionalização (i18n).

---

**Equipe:** _integrantes a preencher_
**Curso:** _curso/turma a preencher_
