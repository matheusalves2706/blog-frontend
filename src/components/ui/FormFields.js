import styled, { css } from 'styled-components';

/** Estilos compartilhados por todos os campos de formulário. */
const estilosCampo = css`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.sm};
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  transition: border-color 0.15s ease, box-shadow 0.15s ease;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
    opacity: 0.8;
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primarySoft};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.background};
    cursor: not-allowed;
  }

  &[aria-invalid='true'] {
    border-color: ${({ theme }) => theme.colors.danger};
  }
`;

export const Formulario = styled.form`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

export const CampoGrupo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const Label = styled.label`
  font-size: 0.92rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

export const Input = styled.input`
  ${estilosCampo}
`;

export const Textarea = styled.textarea`
  ${estilosCampo}
  min-height: 180px;
  resize: vertical;
`;

export const AjudaCampo = styled.span`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const ErroCampo = styled.span`
  font-size: 0.8rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.danger};
`;

export const RodapeCampo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`;
