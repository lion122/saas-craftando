/**
 * Formata um valor numérico para o formato de moeda brasileira (R$)
 * @param value Valor a ser formatado
 * @returns String formatada no padrão de moeda brasileira
 */
export const formatPrice = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

/**
 * Formata uma data para o formato brasileiro (DD/MM/YYYY)
 * @param date Data a ser formatada
 * @returns String formatada no padrão de data brasileiro
 */
export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('pt-BR').format(dateObj);
};

/**
 * Formata um CPF/CNPJ adicionando pontuação
 * @param value CPF ou CNPJ sem formatação
 * @returns CPF ou CNPJ formatado
 */
export function formatDocument(value: string): string {
  // Remove caracteres não numéricos
  const numbers = value.replace(/\D/g, '');
  
  // Verifica se é CPF ou CNPJ pelo tamanho
  if (numbers.length === 11) {
    // Formato CPF: 000.000.000-00
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  } else if (numbers.length === 14) {
    // Formato CNPJ: 00.000.000/0000-00
    return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }
  
  // Se não for CPF nem CNPJ, retorna o valor original
  return value;
}

/**
 * Formata um número de telefone para o formato brasileiro
 * @param phone Número de telefone a ser formatado
 * @returns String formatada no padrão de telefone brasileiro
 */
export const formatPhone = (phone: string): string => {
  // Remove todos os caracteres não numéricos
  const cleaned = phone.replace(/\D/g, '');
  
  // Verifica se é um número de celular (com 9 dígitos) ou fixo (com 8 dígitos)
  if (cleaned.length === 11) {
    return `(${cleaned.substring(0, 2)}) ${cleaned.substring(2, 7)}-${cleaned.substring(7, 11)}`;
  } else if (cleaned.length === 10) {
    return `(${cleaned.substring(0, 2)}) ${cleaned.substring(2, 6)}-${cleaned.substring(6, 10)}`;
  }
  
  // Se não for um formato reconhecido, retorna o número original
  return phone;
};

/**
 * Formata um CEP para o formato brasileiro (00000-000)
 * @param cep CEP a ser formatado
 * @returns String formatada no padrão de CEP brasileiro
 */
export const formatCEP = (cep: string): string => {
  // Remove todos os caracteres não numéricos
  const cleaned = cep.replace(/\D/g, '');
  
  if (cleaned.length === 8) {
    return `${cleaned.substring(0, 5)}-${cleaned.substring(5, 8)}`;
  }
  
  // Se não for um formato reconhecido, retorna o CEP original
  return cep;
};

/**
 * Formata um CPF para o formato brasileiro (000.000.000-00)
 * @param cpf CPF a ser formatado
 * @returns String formatada no padrão de CPF brasileiro
 */
export const formatCPF = (cpf: string): string => {
  // Remove todos os caracteres não numéricos
  const cleaned = cpf.replace(/\D/g, '');
  
  if (cleaned.length === 11) {
    return `${cleaned.substring(0, 3)}.${cleaned.substring(3, 6)}.${cleaned.substring(6, 9)}-${cleaned.substring(9, 11)}`;
  }
  
  // Se não for um formato reconhecido, retorna o CPF original
  return cpf;
};

/**
 * Formata um CNPJ para o formato brasileiro (00.000.000/0000-00)
 * @param cnpj CNPJ a ser formatado
 * @returns String formatada no padrão de CNPJ brasileiro
 */
export const formatCNPJ = (cnpj: string): string => {
  // Remove todos os caracteres não numéricos
  const cleaned = cnpj.replace(/\D/g, '');
  
  if (cleaned.length === 14) {
    return `${cleaned.substring(0, 2)}.${cleaned.substring(2, 5)}.${cleaned.substring(5, 8)}/${cleaned.substring(8, 12)}-${cleaned.substring(12, 14)}`;
  }
  
  // Se não for um formato reconhecido, retorna o CNPJ original
  return cnpj;
}; 