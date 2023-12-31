export const formatTimePipe = (iso: string, isShort: boolean): string => {
  if (isShort) {
    return new Date(iso).toLocaleTimeString('ru', { timeStyle: 'short', hour12: false })
  } else {
    return new Date(iso).toLocaleTimeString('ru', { timeStyle: 'full', hour12: false })
  }
}
