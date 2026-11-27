import type { Ref } from 'react'
import './SelectionLens.css'

interface SelectionLensProps {
  lensRef: Ref<HTMLDivElement>
}

export function SelectionLens({ lensRef }: SelectionLensProps) {
  return <div className="pg-lens" ref={lensRef} aria-hidden="true" />
}
