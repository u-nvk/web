export const formatDatePipe = (iso: string): string => {
  return new Date(iso).toLocaleDateString('ru')
}

export const formatDateMonthTextPipe = (iso: string): string => {
  return new Date(iso).toLocaleDateString('ru', { month: 'long', day: 'numeric' })
}
