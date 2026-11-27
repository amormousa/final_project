export function mockDelay<T>(value: T, milliseconds = 140): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), milliseconds)
  })
}
