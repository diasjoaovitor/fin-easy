export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 2
  }).format(value)
}

export const formatCurrencyMask = (value: number) => {
  if (!value) {
    return '0,00'
  }

  const string = value.toString().replace(/[^\d]/g, '')
  let number = parseInt(string)

  if (isNaN(number)) {
    return '0,00'
  }

  number = number / 100

  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(number)
}
