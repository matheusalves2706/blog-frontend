/** Remove acentos, normaliza espaços e deixa o texto em minúsculas para comparações. */
export function normalizarTexto(texto) {
  return String(texto ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

/** Cria um resumo do conteúdo respeitando o limite de caracteres. */
export function criarResumo(texto, tamanho = 160) {
  const limpo = String(texto ?? '').replace(/\s+/g, ' ').trim();
  if (limpo.length <= tamanho) return limpo;

  const recorte = limpo.slice(0, tamanho);
  const ultimoEspaco = recorte.lastIndexOf(' ');
  const base = ultimoEspaco > 0 ? recorte.slice(0, ultimoEspaco) : recorte;
  return `${base}…`;
}

/** Concatena os campos pesquisáveis de um post para a busca. */
export function combinarTextoBusca(post) {
  return normalizarTexto(`${post.titulo} ${post.autor} ${post.conteudo}`);
}

/** Filtra posts por palavra-chave (título, autor ou conteúdo), ignorando acentos. */
export function filtrarPosts(posts, termo) {
  const termoNormalizado = normalizarTexto(termo);
  if (!termoNormalizado) return posts;

  return posts.filter((post) => combinarTextoBusca(post).includes(termoNormalizado));
}
