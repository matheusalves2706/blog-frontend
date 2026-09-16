import { createGlobalStyle } from 'styled-components';

/** Estilos globais: reset leve, tipografia base e acessibilidade. */
export const GlobalStyle = createGlobalStyle`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  html {
    -webkit-text-size-adjust: 100%;
    scroll-behavior: smooth;
  }

  body {
    margin: 0;
    min-height: 100vh;
    font-family: ${({ theme }) => theme.fonts.body};
    font-size: 16px;
    line-height: 1.6;
    color: ${({ theme }) => theme.colors.text};
    background-color: ${({ theme }) => theme.colors.background};
    -webkit-font-smoothing: antialiased;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    line-height: 1.25;
    color: ${({ theme }) => theme.colors.text};
  }

  a {
    color: ${({ theme }) => theme.colors.primary};
  }

  img {
    max-width: 100%;
    display: block;
  }

  button,
  input,
  textarea,
  select {
    font: inherit;
  }

  :focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }

  ::selection {
    background-color: ${({ theme }) => theme.colors.primary};
    color: #ffffff;
  }
`;
