# Texto de narração do vídeo de apresentação

**Como usar:** leia em voz alta apenas os parágrafos normais. Os trechos em *itálico entre parênteses* são indicações do que mostrar na tela e **não** devem ser lidos. Troque os `[placeholders]` pelos seus dados. Duração sugerida: ~6 minutos. Roteiro em [`ROTEIRO_VIDEO.md`](ROTEIRO_VIDEO.md).

---

## Abertura — ~30 segundos

*(na tela: a aplicação aberta na home, no navegador)*

Olá! Eu sou [seu nome], do grupo [nome do grupo], turma [turma].

Neste vídeo, eu apresento o front-end do Blog Acadêmico: a interface em React que a nossa equipe desenvolveu para a aplicação de blogging do Tech Challenge. Professores publicam e editam as postagens, e estudantes leem e comentam. Tudo consumindo a API que fizemos na fase anterior.

## Visão geral — ~30 segundos

*(no VS Code, com a árvore de arquivos aberta)*

O código está separado por pastas: `pages` tem uma página para cada tela; `components` tem os componentes reutilizáveis; `services` conversa com a API; `contexts` guarda a sessão do usuário; e `styles` tem o tema e os estilos globais.

Usamos React 19, Vite, React Router, styled-components e axios. A documentação completa está no README e na pasta `docs`.

## Demonstração — ~3 minutos

*(voltar para o navegador, em http://localhost:5173)*

Esta é a home. Cada card mostra o título, o autor e um resumo do post — os mais novos aparecem primeiro.

Vou usar a busca: *(digitar "git")*. Ela filtra na hora. E ela ignora acentos, então "programacao", sem acento, também encontra. *(digitar "programacao")*

Agora vou abrir um post... *(clicar no post)*. Aqui está o conteúdo completo e a seção de comentários. Vou escrever um comentário... *(digitar e enviar)* — ele aparece na hora.

Vamos para a parte protegida. Vou tentar entrar no painel de administração sem estar logado... *(acessar /admin)* — e o sistema me manda para o login. Entro com o usuário de teste... *(professor@blog.com / 123456)* — e, em vez de ir para a home, volto direto para o painel, que era onde eu queria entrar.

Este é o painel com todos os posts. Vou criar um novo: *(clicar em "Novo post")*. De propósito, coloco um título muito curto, "Oi"... *(digitar)* — e o formulário mostra o erro no próprio campo. Corrijo o título, escrevo o conteúdo... e publico. O post é criado e eu já sou levado para a página dele, com a mensagem de sucesso.

Vou editar esse post: o formulário já vem preenchido com os dados atuais. *(alterar o título e salvar)* — salvo com sucesso.

E agora excluir: *(clicar em excluir)* o navegador pede confirmação... confirmo, e o post sai da lista.

Para terminar, o celular: *(F12 e modo dispositivo, ~390px)* a home vira uma coluna e o menu vira um botão. *(abrir o menu)* E se alguém digitar um endereço errado... *(acessar /nao-existe)* aparece uma página 404 com um link para voltar à home.

## Pontos técnicos — ~1 minuto

*(abrir o código)*

Rapidamente, quatro pontos do código.

Primeiro, o login: a sessão fica salva no navegador, então recarregar a página não desloga. E as rotas de criar, editar e administrar são protegidas: sem login, o sistema redireciona para o login e depois devolve a pessoa para onde ela queria ir.

Segundo, a pasta `services`: é onde fica a comunicação com a API. Ela também traduz os erros para mensagens em português e entende respostas com nomes de campos diferentes, como `title` ou `titulo` — isso ajudou muito na integração com o back-end.

Terceiro, o formulário `PostForm` é o mesmo na criação e na edição, com validação e mensagens de erro acessíveis.

Quarto, o tema em `styles`: cores, tamanhos e media queries ficam em um só lugar, o que mantém todas as telas consistentes.

## Docker e CI/CD — ~30 segundos

*(mostrar o Dockerfile)*

Para publicar, o Dockerfile faz o build em duas etapas: uma com Node e outra servindo os arquivos com Nginx. E no GitHub Actions temos dois fluxos: um roda os testes e o build a cada push; o outro publica a imagem no GitHub Container Registry.

## Encerramento — ~20 segundos

Para fechar: entregamos a interface completa do blog — listagem, busca, comentários, criação, edição, administração e login — com responsividade e integração com a API. A maior dificuldade foi adaptar o front ao contrato da API, que resolvemos na camada de serviços. O relato completo está no documento de relato de experiências.

Obrigado por assistir!
