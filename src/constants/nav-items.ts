type TNavItem = {
  title: string
  icon: string
  to: string
}

export const navItems: TNavItem[] = [
  {
    title: 'Carteira',
    icon: 'mdi-wallet',
    to: '/'
  },
  {
    title: 'Entradas',
    icon: 'mdi-arrow-up',
    to: '/incomes'
  },
  {
    title: 'Saídas',
    icon: 'mdi-arrow-down',
    to: '/expenses'
  }
]
