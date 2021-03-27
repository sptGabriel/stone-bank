export function hasKeys<K extends string>(
  data: any,
  keys: K[],
): data is Record<K, string> {
  if (typeof data === 'undefined' || Object.keys(data).length === 0) {
    return false
  }
  for (const key of keys) {
    if (typeof data[key] !== 'string') {
      return false
    }
  }
  return true
}
