export async function whenOnline<R>(cb: () => R): Promise<Awaited<R>> {
  if (navigator.onLine) return cb() as Promise<Awaited<R>>
  return new Promise<Awaited<R>>((resolve, reject) => {
    window.addEventListener(
      'online',
      async () => {
        try {
          resolve(await cb())
        } catch (error) {
          reject(error)
        }
      },
      { once: true },
    )
  })
}
