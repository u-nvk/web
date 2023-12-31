export const formatDatePipe = (iso: string): string => {
  return new Date(iso).toLocaleDateString('ru')
}
