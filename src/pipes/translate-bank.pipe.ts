export const translateBankPipe = (bankIndex: number): string => {
  switch (bankIndex) {
    case 0:
      return 'Сбербанк'
    case 1:
      return 'Тинькофф'
    case 2:
      return 'Альфа'
    case 3:
      return 'Синара'
    case 4:
      return 'ВТБ'
    default:
      throw new Error(`Not exist bank with index = ${bankIndex}`)
  }
}
