export const formatRoutePipe = (route: string): string => {
  switch (route) {
    case 'NVK':
      return 'Новокольцово'
    case 'MUB':
      return 'ГУК'
    case 'D11':
      return 'Общежитие №11'
    case 'G8M':
      return 'Гринвич со стороны 8 марта'
    default:
      return route
  }
}
