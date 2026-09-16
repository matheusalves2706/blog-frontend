import { css } from 'styled-components';

/** Breakpoints de responsividade (mobile first). */
export const breakpoints = {
  sm: 480,
  md: 768,
  lg: 1024,
};

/**
 * Helpers de media query para uso dentro dos componentes estilizados.
 *
 * @example
 * const Colunas = styled.div`
 *   grid-template-columns: 1fr;
 *   ${media.md`grid-template-columns: repeat(2, 1fr);`}
 * `;
 */
export const media = {
  sm: (...args) => css`@media (min-width: ${breakpoints.sm}px) { ${css(...args)} }`,
  md: (...args) => css`@media (min-width: ${breakpoints.md}px) { ${css(...args)} }`,
  lg: (...args) => css`@media (min-width: ${breakpoints.lg}px) { ${css(...args)} }`,
};
