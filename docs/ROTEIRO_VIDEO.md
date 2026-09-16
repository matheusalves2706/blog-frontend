# Roteiro do vídeo de apresentação

Guia para gravar a demonstração do front-end. Há duas versões prontas: este roteiro detalhado (sugestão de 10 a 12 minutos) e o texto de narração para leitura direta em [`NARRACAO_VIDEO.md`](NARRACAO_VIDEO.md) (≈ 6 minutos). Escolham conforme o limite de tempo da turma.

---

## Duração do vídeo

- O enunciado deste Tech Challenge **não define tempo mínimo** (pede apenas a demonstração do funcionamento com detalhes técnicos de implementação). Confirme no enunciado oficial/portal da FIAP ou com o(a) professor(a) se existe um **limite máximo ou faixa obrigatória** — valores entre 10 e 15 minutos são comuns.
- Se nada for especificado: use o texto narrado de **≈ 6 minutos** ([`NARRACAO_VIDEO.md`](NARRACAO_VIDEO.md)) ou este roteiro estendido de **10 a 12 minutos**, se quiser cobrir Docker/CI e responsividade com calma.
- **Versão curta (até ~5 min):** siga a narração e corte a página 404, o passo a passo de responsividade e a demo do Docker (apenas cite-os).
- Verifique também regras comuns: todos os integrantes precisam aparecer/falar? Formato/link de entrega obrigatório? Qual o prazo?

---

## Antes de gravar

- [ ] `npm install` executado e dependências atualizadas.
- [ ] API simulada pronta para uso: `npm run mock` (credenciais: `professor@blog.com` / `123456`).
- [ ] Aplicação rodando: `npm run dev` em http://localhost:5173.
- [ ] Aba do navegador limpa (sem login prévio) e zoom em ~125% para leitura confortável.
- [ ] Notificações do sistema silenciadas; OBS (ou similar) configurado em 1080p com áudio testado.
- [ ] Roteiro ensaiado uma vez, cronometrado.

## Estrutura sugerida

### 1. Abertura — 0:00 a 1:00

- Apresentação da equipe e do desafio: interface para uma aplicação de blogging consumindo a API REST do back-end da fase anterior.
- Objetivo do vídeo: mostrar o funcionamento e os detalhes técnicos de implementação.

### 2. Visão geral técnica — 1:00 a 3:00

- Mostrar a estrutura de pastas (`src/pages`, `src/components`, `src/services`, `src/contexts`).
- Citar a stack: **React 19 (hooks e componentes funcionais)**, **Vite**, **React Router**, **styled-components**, **Context API** e **axios**.
- Apontar o `README.md` e o `docs/ARQUITETURA.md` como documentação técnica.

### 3. Demonstração da aplicação — 3:00 a 6:30

Siga esta sequência de telas:

1. **Home** — lista de posts com título, autor(a) e resumo; ordem do mais recente para o mais antigo.
2. **Busca** — digite, por exemplo, `git` (mostre que a contagem de resultados muda e que a busca ignora acentos: tente `programacao`).
3. **Leitura** — abra o post, mostre o conteúdo completo e a seção de comentários; envie um comentário de exemplo.
4. **Login** — clique em **Entrar**; mostre o redirecionamento de rota protegida (acesse `/admin` sem login antes disso, se preferir). Entre com as credenciais de teste.
5. **Criação** — publique um post novo (mostre a validação: envie só `Oi` no título e observe a mensagem de erro).
6. **Edição** — edite o post recém-criado e salve; mostre a mensagem de sucesso.
7. **Administração** — mostre a tabela com todas as postagens, exclua o post de teste (confirmação nativa) e observe o feedback.
8. **Responsividade** — abra o modo dispositivo do navegador (F12) e mostre a home e a tabela administrativa em ~390px de largura; abra o menu hambúrguer.
9. **404** — acesse uma URL inexistente (ex.: `/nao-existe`) e mostre a página de erro.

### 4. Detalhes técnicos — 6:30 a 8:30

Escolha 3 ou 4 pontos para ir ao código:

- **Autenticação**: `AuthContext`, `ProtectedRoute` e o redirecionamento com destino original; interceptor do axios que anexa o `Bearer` e trata `401`.
- **Camada de API**: `services/posts.js` com normalização de payloads e `mensagemDeErro` traduzindo erros.
- **Formulário compartilhado**: `PostForm` usado nas páginas de criação e edição; validação e acessibilidade (`aria-invalid`, `aria-describedby`).
- **Estilização**: tema central (`styles/theme.js`) e media queries (`styles/mixins.js`); componente `Button` com variantes.

### 5. Docker e CI/CD — 8:30 a 9:30

- Mostre o `Dockerfile` multi-stage (Node → Nginx) e explique o `VITE_API_URL` em tempo de build.
- Rode `docker compose up --build` (ou mostre a imagem já construída) e abra http://localhost:8080.
- Mostre os workflows `.github/workflows/ci.yml` e `cd.yml`.

### 6. Encerramento — 9:30 a 10:00

- Resumo do que foi entregue; principais dificuldades (ex.: integração com contrato da API, responsividade da tabela) e aprendizados.
- Convite para leitura do relato de experiências (`docs/RELATO_EXPERIENCIAS.md`).

## Dicas de gravação

- Grave em partes (abertura, demo, técnico) e una na edição; evita refazer tudo por um erro.
- Faça zoom no navegador e no editor de código para que o texto fique legível.
- Prefira mostrar em vez de apenas dizer: cada afirmação do roteiro deve ter uma tela correspondente.
- Fale pausadamente e mantenha o vídeo dentro do limite de tempo definido pelo enunciado.
- Exporte em 1080p e publique no YouTube (não listado) ou Google Drive com acesso liberado para a banca.
