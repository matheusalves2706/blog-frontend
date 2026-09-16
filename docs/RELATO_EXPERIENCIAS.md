# Relato de experiências e desafios — Blog Acadêmico (Front-end)

> **Como usar este documento:** este é um roteiro para a equipe preencher com a experiência real do grupo. Substituam os trechos em itálico pelos relatos de vocês e removam as orientações antes de entregar.

---

## 1. Identificação

| Item | Preenchimento |
| --- | --- |
| Curso / turma | _a preencher_ |
| Integrantes | _nome — responsabilidade principal no projeto_ |
| Repositório do front-end | _link_ |
| Repositório do back-end | _link_ |
| Link do vídeo de apresentação | _link_ |

## 2. Resumo do projeto

_O que foi construído: interface React para a aplicação de blogging do Tech Challenge, com listagem, busca, leitura, comentários, criação, edição, administração e autenticação de professores(as). Em 1 ou 2 parágrafos, descrevam o objetivo e o resultado final._

## 3. Divisão do trabalho

_Descrevam como as tarefas foram divididas (telas, componentes, integração, documentação, design, Docker/CI, gravação do vídeo etc.) e como a equipe se organizou (reuniões, ferramentas, prazos internos)._

## 4. Desafios técnicos enfrentados

Sugestões de pontos que costumam gerar desafios reais — escolham os que aconteceram com vocês e descrevam **o problema → a investigação → a solução**:

- _Integração com o back-end (nomes de campos, CORS, formato das respostas) e a criação de uma camada de normalização para absorver as diferenças._
- _Autenticação: armazenar e reutilizar o token, proteger rotas e devolver o usuário ao destino original após o login._
- _Evitar conflitos de navegação entre o redirecionamento pós-login e o guarda de rotas._
- _Responsividade da tabela administrativa e do menu de navegação em telas pequenas._
- _Feedback ao usuário: estados de carregamento, erro (com "tentar novamente") e sucesso._
- _Docker: build em duas etapas e a questão do `VITE_API_URL` ser embutido em tempo de build._
- _CI/CD: configurar os workflows do GitHub Actions sem quebrar o repositório._

## 5. O que funcionou bem

_Práticas e decisões que vocês consideram acertadas: componentes reutilizáveis, tema central de estilos, testes das funções de normalização/busca, checklist de acessibilidade, uso do mock para demonstrar sem o back-end etc._

## 6. O que faríamos diferente

_Sejam honestos: retrabalho evitável, tarefas que deveriam ter começado antes, dificuldades de comunicação, ferramentas que não valeram a pena._

## 7. Aprendizados individuais

Aprendizado de cada integrante (2 a 3 linhas por pessoa): técnicas novas, ferramentas, trabalho em equipe, apresentação de resultados.

## 8. Conclusão

_Resultado final em relação ao proposto no desafio, próximos passos vislumbrados e avaliação geral da experiência._
