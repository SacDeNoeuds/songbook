export const preventDefault =
  <E extends Event>(fn: (event: E) => unknown) =>
  (event: E) => {
    event.preventDefault()
    return fn(event)
  }
