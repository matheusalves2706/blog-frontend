import styled, { keyframes } from 'styled-components';

const girar = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

export const Spinner = styled.span`
  display: inline-block;
  width: ${({ $tamanho = 26 }) => $tamanho}px;
  height: ${({ $tamanho = 26 }) => $tamanho}px;
  border: 3px solid ${({ theme }) => theme.colors.primarySoft};
  border-top-color: ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  animation: ${girar} 0.8s linear infinite;
`;

const BlocoCarregando = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  padding: 48px 16px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

/** Indicador de carregamento acessível (role="status"). */
export function LoadingBlock({ mensagem = 'Carregando…' }) {
  return (
    <BlocoCarregando role="status" aria-live="polite">
      <Spinner aria-hidden="true" />
      <span>{mensagem}</span>
    </BlocoCarregando>
  );
}

const BlocoVazio = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 48px 20px;
  text-align: center;
  border: 1px dashed ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  background-color: ${({ theme }) => theme.colors.surface};
`;

const TituloVazio = styled.h3`
  margin: 0;
  font-size: 1.1rem;
`;

const DescricaoVazio = styled.p`
  margin: 0;
  max-width: 44ch;
  color: ${({ theme }) => theme.colors.textMuted};
`;

/** Estado vazio para listas sem resultados. */
export function EmptyState({ titulo, descricao, children }) {
  return (
    <BlocoVazio>
      <TituloVazio>{titulo}</TituloVazio>
      {descricao && <DescricaoVazio>{descricao}</DescricaoVazio>}
      {children}
    </BlocoVazio>
  );
}
