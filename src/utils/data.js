function paraData(valor) {
  if (!valor) return null;
  const data = new Date(valor);
  return Number.isNaN(data.getTime()) ? null : data;
}

/** Formata uma data ISO no padrão brasileiro (ex.: 10 de agosto de 2026). */
export function formatarData(valor) {
  const data = paraData(valor);
  if (!data) return '';

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(data);
}

/** Formata uma data ISO com data e hora (ex.: 10 de agosto de 2026, 14:30). */
export function formatarDataHora(valor) {
  const data = paraData(valor);
  if (!data) return '';

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(data);
}
