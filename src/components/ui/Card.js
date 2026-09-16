import styled from 'styled-components';

/** Cartão base usado em listagens e formulários. */
export const Card = styled.article`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 22px;
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;
