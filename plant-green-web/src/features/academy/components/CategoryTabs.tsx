import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { Category } from '../academy.service'
import './CategoryTabs.css'

interface CategoryTabsProps {
  categories: Category[]
  selectedCategoryId: number | null
  onSelect: (categoryId: number | null) => void
}

export function CategoryTabs({ categories, selectedCategoryId, onSelect }: CategoryTabsProps) {
  const { i18n } = useTranslation()
  const isRtl = i18n.resolvedLanguage?.startsWith('ar') ?? i18n.language.startsWith('ar')
  const scrollRef = useRef<HTMLDivElement>(null)
  const [overflowing, setOverflowing] = useState(false)
  const [canScrollBack, setCanScrollBack] = useState(false)
  const [canScrollForward, setCanScrollForward] = useState(false)

  const updateScrollState = useCallback(() => {
    const element = scrollRef.current
    if (!element) return
    const max = element.scrollWidth - element.clientWidth
    setOverflowing(max > 1)
    // Normalize the positive and negative RTL scrollLeft models.
    const distance = isRtl && element.scrollLeft > 0
      ? max - element.scrollLeft
      : Math.abs(element.scrollLeft)
    setCanScrollBack(distance > 1)
    setCanScrollForward(max - distance > 1)
  }, [isRtl])

  useEffect(() => {
    const element = scrollRef.current
    if (!element) return
    updateScrollState()
    const observer = new ResizeObserver(updateScrollState)
    observer.observe(element)
    if (element.firstElementChild) observer.observe(element.firstElementChild)
    return () => observer.disconnect()
  }, [categories, updateScrollState])

  const scroll = (logicalDirection: -1 | 1) => {
    const element = scrollRef.current
    if (!element) return
    const sign = isRtl ? -1 : 1
    element.scrollBy({ left: logicalDirection * sign * Math.max(200, element.clientWidth * 0.7), behavior: 'smooth' })
  }

  const selectedId = selectedCategoryId ?? 1

  return (
      <nav className="academy-category" aria-label={isRtl ? 'فئات الفيديو' : 'Video categories'}>
      {overflowing && (
        <button
          className="academy-category__arrow"
          type="button"
          aria-label={isRtl ? 'الفئات السابقة' : 'Previous categories'}
          disabled={!canScrollBack}
          onClick={() => scroll(-1)}
        >
          {isRtl ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      )}
      <div className="academy-category__viewport" ref={scrollRef} onScroll={updateScrollState}>
        <div className="academy-category__list" role="tablist" aria-label={isRtl ? 'فئات الفيديو' : 'Video categories'}>
          {categories.map((category) => {
            const active = category.id === selectedId
            return (
              <button
                className="academy-category__tab"
                id={`academy-category-${category.id}`}
                key={category.id}
                type="button"
                role="tab"
                aria-selected={active}
                aria-controls="academy-video-results"
                tabIndex={active ? 0 : -1}
                onClick={() => onSelect(category.id === 1 ? null : category.id)}
              >
                <span>{isRtl ? category.name_ar : category.name_en}</span>
                <span className="academy-category__count">{category.count ?? '—'}</span>
              </button>
            )
          })}
        </div>
      </div>
      {overflowing && (
        <button
          className="academy-category__arrow"
          type="button"
          aria-label={isRtl ? 'الفئات التالية' : 'Next categories'}
          disabled={!canScrollForward}
          onClick={() => scroll(1)}
        >
          {isRtl ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      )}
    </nav>
  )
}
