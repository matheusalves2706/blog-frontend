import styled, { ThemeProvider } from 'styled-components';
import { Footer } from './components/layout/Footer';
import { Navbar } from './components/layout/Navbar';
import { AuthProvider } from './contexts/AuthContext';
import { AppRoutes } from './routes/AppRoutes';
import { GlobalStyle } from './styles/globalStyle';
import { media } from './styles/mixins';
import { theme } from './styles/theme';

const Estrutura = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const Conteudo = styled.main`
  flex: 1;
  width: 100%;
  max-width: 1080px;
  margin: 0 auto;
  padding: 24px 16px 56px;

  ${media.md`
    padding: 32px 24px 72px;
  `}
`;

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <AuthProvider>
        <Estrutura>
          <Navbar />
          <Conteudo>
            <AppRoutes />
          </Conteudo>
          <Footer />
        </Estrutura>
      </AuthProvider>
    </ThemeProvider>
  );
}
