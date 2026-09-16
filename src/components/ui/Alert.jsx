import styled, { css } from 'styled-components';

const estilosPorTipo = {
  info: css`
    background-color: ${({ theme }) => theme.colors.infoSoft};
    border-color: ${({ theme }) => theme.colors.info};
    color: ${({ theme }) => theme.colors.info};
  `,
  sucesso: css`
    background-color: ${({ theme }) => theme.colors.successSoft};
    border-color: ${({ theme }) => theme.colors.success};
    color: ${({ theme }) => theme.colors.success};
  `,
  aviso: css`
    background-color: ${({ theme }) => theme.colors.warningSoft};
    border-color: ${({ theme }) => theme.colors.warning};
    color: ${({ theme }) => theme.colors.warning};
  `,
  erro: css`
    background-color: ${({ theme }) => theme.colors.dangerSoft};
    border-color: ${({ theme }) => theme.colors.dangerDark};
    color: ${({ theme }) => theme.colors.dangerDark};
  `,
};

const AlertBase = styled.div`
  padding: 12px 16px;
  border: 1px solid;
  border-radius: ${({ theme }) => theme.radii.sm};
  font-size: 0.92rem;
  line-height: 1.5;

  a {
    color: inherit;
    font-weight: 700;
  }

  ${({ $tipo = 'info' }) => estilosPorTipo[$tipo] ?? estilosPorTipo.info}
`;

/**
 * Mensagem de feedback para o usuário.
 * Tipos disponíveis: info (padrão), sucesso, aviso e erro.
 */
export function Alert({ tipo = 'info', children, ...resto }) {
  const papel = tipo === 'erro' ? 'alert' : 'status';

  return (
    <AlertBase $tipo={tipo} role={papel} {...resto}>
      {children}
    </AlertBase>
  );
}
