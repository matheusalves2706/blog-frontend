import styled, { css } from 'styled-components';

const variantes = {
  primario: css`
    background-color: ${({ theme }) => theme.colors.primary};
    color: #ffffff;

    &:hover:not(:disabled) {
      background-color: ${({ theme }) => theme.colors.primaryDark};
    }
  `,
  secundario: css`
    background-color: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.primary};
    border-color: ${({ theme }) => theme.colors.border};

    &:hover:not(:disabled) {
      background-color: ${({ theme }) => theme.colors.primarySoft};
    }
  `,
  perigo: css`
    background-color: ${({ theme }) => theme.colors.danger};
    color: #ffffff;

    &:hover:not(:disabled) {
      background-color: ${({ theme }) => theme.colors.dangerDark};
    }
  `,
  fantasma: css`
    background-color: transparent;
    color: ${({ theme }) => theme.colors.textMuted};

    &:hover:not(:disabled) {
      background-color: ${({ theme }) => theme.colors.border};
      color: ${({ theme }) => theme.colors.text};
    }
  `,
};

/**
 * Botão base da aplicação.
 * Variantes: primario (padrão), secundario, perigo e fantasma.
 * Pode renderizar um link com `as={Link}`.
 */
export const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 11px 20px;
  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.radii.sm};
  font-weight: 600;
  font-size: 0.95rem;
  line-height: 1.2;
  text-decoration: none;
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease, box-shadow 0.15s ease,
    transform 0.05s ease;

  ${({ $variante = 'primario' }) => variantes[$variante] ?? variantes.primario}

  ${({ $compacto }) =>
    $compacto &&
    css`
      padding: 7px 13px;
      font-size: 0.85rem;
      border-radius: 8px;
    `}

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }

  &:active:not(:disabled) {
    transform: translateY(1px);
  }
`;
