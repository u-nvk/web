export const translateBankPipe = (bankIndex: number): string => {
  switch (bankIndex) {
    case 0:
      return 'Сбербанк'
    default:
      throw new Error(`Not exist bank with index = ${bankIndex}`)
  }
}
