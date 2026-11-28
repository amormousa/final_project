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
}

export function useActiveRoute({ collapsed, open, query, rtl }: ActiveRouteOptions) {
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
      ).find((entry) => activePath === entry.path || activePath.startsWith(`${entry.path}/`))
      if (!screen) return null
      const direct = refs.current[screen.id]
      const group = NAV.flatMap((section) => section.items)
        .find((item) => item.children?.some((child) => activePath === child.path || activePath.startsWith(`${child.path}/`)))
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
      const lensInlineSize = iconRect ? targetRect.height : targetRect.width
      const lensBlockSize = targetRect.height
      const lensLeft = iconRect
        ? iconRect.left + (iconRect.width - lensInlineSize) / 2
        : targetRect.left
      const lensRight = iconRect ? lensLeft + lensInlineSize : targetRect.right
      lens.style.inlineSize = `${lensInlineSize}px`
      lens.style.blockSize = `${lensBlockSize}px`
      lens.style.insetInlineStart = `${rtl ? hostRect.right - lensRight : lensLeft - hostRect.left}px`
      lens.style.insetBlockStart = `${(iconRect
        ? iconRect.top + (iconRect.height - lensBlockSize) / 2
        : targetRect.top) - hostRect.top}px`
      lens.style.borderRadius = collapsed ? '50%' : '14px'
      lastLensTarget.current = target
    }
    let animationFrame = 0
    const schedulePlace = () => {
      if (animationFrame) return
      animationFrame = requestAnimationFrame(() => {
        animationFrame = 0
        place()
      })
    }
    place()
    let disposed = false
    const resizeObserver = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(schedulePlace)
    if (nav) resizeObserver?.observe(nav)
    const target = findTarget()
    if (target) resizeObserver?.observe(target)
    document.fonts?.ready.then(() => {
      if (!disposed) schedulePlace()
    })
    window.addEventListener('resize', schedulePlace)
    nav?.addEventListener('scroll', schedulePlace)
    return () => {
      disposed = true
      resizeObserver?.disconnect()
      cancelAnimationFrame(animationFrame)
      window.removeEventListener('resize', schedulePlace)
      nav?.removeEventListener('scroll', schedulePlace)
    }
  }, [activePath, collapsed, open, query, rtl])

  return { activePath, navInRef, lensRef, register }
}
