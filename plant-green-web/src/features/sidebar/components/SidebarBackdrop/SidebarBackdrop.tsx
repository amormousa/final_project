import type { MouseEventHandler } from 'react'
import './SidebarBackdrop.css'

interface SidebarBackdropProps {
  label: string
  onClick: MouseEventHandler<HTMLButtonElement>
}

export function SidebarBackdrop({ label, onClick }: SidebarBackdropProps) {
  return <button type="button" className="pg-backdrop" aria-label={label} onClick={onClick} />
}
