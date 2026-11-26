export function Skeleton({ height = '1rem' }: { height?: string }) {
  return <div aria-hidden="true" style={{ blockSize: height, inlineSize: '100%' }} />
}
