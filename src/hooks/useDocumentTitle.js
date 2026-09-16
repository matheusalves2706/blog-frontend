import { useEffect } from 'react';

const SUFIXO = 'Blog Acadêmico';

/** Atualiza o título da aba do navegador de acordo com a página atual. */
export function useDocumentTitle(titulo) {
  useEffect(() => {
    document.title = titulo ? `${titulo} · ${SUFIXO}` : SUFIXO;
  }, [titulo]);
}
