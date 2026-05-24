export function assetUrl(path: string): string {
  const timestamp = __BUILD_TIMESTAMP__
  return `${path}?v=${timestamp}`
}
