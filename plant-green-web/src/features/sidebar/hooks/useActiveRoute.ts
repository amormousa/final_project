import { useLayoutEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { NAV } from '../data/navigation'

const SQUISH = [
  { transform: 'scale(1,1)' },
  { transform: 'scale(1.025,1.32)', offset: 0.35 },
  { transform: 'scale(1,1)' },
]

interface ActiveRouteOptions {
  collapsed: boolean
  open: Record<string, boolean>
  query: string
  rtl: boolean
  dark: boolean
}

export function useActiveRoute({ collapsed, open, query, rtl, dark }: ActiveRouteOptions) {
  const location = useLocation()
  const activePath = location.pathname.replace(/^\/app\/?/, '').replace(/\/$/, '')
  const navInRef = useRef<HTMLDivElement>(null)
  const lensRef = useRef<HTMLDivElement>(null)
  const refs = useRef<Record<string, HTMLButtonElement>>({})
  const lastLensTarget = useRef<HTMLButtonElement | null>(null)
  const moveAt = useRef(0)

  const register = (id: string) => (element: HTMLButtonElement | null) => {
    if (element) refs.current[id] = element
    else delete refs.current[id]
  }

  useLayoutEffect(() => {
    const findTarget = () => {
      const screen = NAV.flatMap((section) => section.items).flatMap((item) =>
        item.children ?? (item.path ? [{ id: item.id, path: item.path, label: item.label }] : []),
      ).find((entry) => entry.path === activePath)
      if (!screen) return null
      const direct = refs.current[screen.id]
      const group = NAV.flatMap((section) => section.items)
        .find((item) => item.children?.some((child) => child.path === activePath))
      if (collapsed || (direct && direct.closest('.pg-sub-wrap[data-open="false"]'))) {
        return group ? refs.current[group.id] ?? direct ?? null : direct ?? null
      }
      return direct ?? (group ? refs.current[group.id] ?? null : null)
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const nav = navInRef.current
    const place = () => {
      const lens = lensRef.current
      const host = navInRef.current
      if (!lens || !host) return
      const target = findTarget()
      if (!target) {
        lens.style.opacity = '0'
        lastLensTarget.current = null
        return
      }
      const hostRect = host.getBoundingClientRect()
      const targetRect = target.getBoundingClientRect()
      const iconRect = collapsed
        ? target.querySelector<HTMLElement>('.pg-ico')?.getBoundingClientRect()
        : undefined
      const changed = lastLensTarget.current !== target
      const first = lastLensTarget.current === null
      const now = performance.now()
      if (changed) {
        moveAt.current = now
        if (!first && !reduceMotion) lens.animate(SQUISH, { duration: 480, easing: 'ease-out' })
      }
      const sliding = !first && (changed || now - moveAt.current < 520)
      lens.dataset.follow = sliding ? 'false' : 'true'
      lens.style.opacity = '1'
      lens.style.width = `${iconRect ? targetRect.height : targetRect.width}px`
      lens.style.height = `${targetRect.height}px`
      const lensLeft = iconRect
        ? iconRect.left + (iconRect.width - targetRect.height) / 2
        : targetRect.left
      lens.style.insetInlineStart = `${rtl
        ? hostRect.right - (lensLeft + targetRect.height)
        : lensLeft - hostRect.left}px`
      lens.style.insetBlockStart = `${(iconRect
        ? iconRect.top + (iconRect.height - targetRect.height) / 2
        : targetRect.top) - hostRect.top}px`
      lens.style.borderRadius = collapsed ? '50%' : '14px'
      lastLensTarget.current = target
    }
    let animationFrame = 0
    const started = performance.now()
    const tick = () => {
      place()
      if (performance.now() - started < 700) animationFrame = requestAnimationFrame(tick)
    }
    tick()
    window.addEventListener('resize', place)
    nav?.addEventListener('scroll', place)
    return () => {
      cancelAnimationFrame(animationFrame)
      window.removeEventListener('resize', place)
      nav?.removeEventListener('scroll', place)
    }
  }, [activePath, collapsed, dark, open, query, rtl])

  return { activePath, navInRef, lensRef, register }
}
