
declare global {
  interface Window {
    ym?: (counterId: number, goal: string, target: string) => void
  }
}

export {};
