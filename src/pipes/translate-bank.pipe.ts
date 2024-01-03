export const translateBankPipe = (bankIndex: number): string => {
  switch (bankIndex) {
    case 0:
      return 'Сбербанк'
    case 1:
      return 'Тинькофф'
    case 2:
      return 'Альфа'
    default:
      throw new Error(`Not exist bank with index = ${bankIndex}`)
  }
}
