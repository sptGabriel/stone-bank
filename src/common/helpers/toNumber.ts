export function toNumber(value: number | string) {
  if (!(typeof value === 'number' || typeof value === 'string')) {
    throw new Error(`Invalid number`)
  }
  const toNumber = +value
  if (typeof toNumber !== 'number') throw new Error(`Invalid number`)
  return toNumber
}
