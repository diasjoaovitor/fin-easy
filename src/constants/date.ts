import dayjs from 'dayjs'

export const months = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro'
]

export const currentDate = dayjs().format('YYYY-MM-DD')

export const currentYear = Number(dayjs().format('YYYY'))

export const currentMonth = Number(dayjs().format('MM'))
