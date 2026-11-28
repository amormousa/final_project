import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { EmptyState } from '../../components/feedback/EmptyState'
import { getAcademyData } from './academy.service'
import type { Category, Video } from './academy.service'
import { CategoryTabs } from './components/CategoryTabs'
import { VideoCard } from './components/VideoCard'
import { VideoModal } from './components/VideoModal'
import './AcademyPage.css'

export function AcademyPage() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const isRtl = i18n.resolvedLanguage?.startsWith('ar') ?? i18n.language.startsWith('ar')
  const [categories, setCategories] = useState<Category[]>([])
  const [videos, setVideos] = useState<Video[]>([])
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeVideo, setActiveVideo] = useState<Video | null>(null)
  const watchTriggerRef = useRef<HTMLButtonElement | null>(null)
  const [animatedPlaceholder, setAnimatedPlaceholder] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [retryKey, setRetryKey] = useState(0)
  const searchPlaceholder = isRtl ? 'ابحث عن فيديو' : 'Search videos'

  useEffect(() => {
    if (searchFocused || searchTerm) {
      setAnimatedPlaceholder('')
      return
    }

    let characterIndex = 0
    let deleting = false
    let timeout: ReturnType<typeof setTimeout>
    let cancelled = false

    const tick = () => {
      if (cancelled) return
      if (!deleting) {
        characterIndex += 1
        setAnimatedPlaceholder(searchPlaceholder.slice(0, characterIndex))
        if (characterIndex >= searchPlaceholder.length) {
          deleting = true
          timeout = setTimeout(tick, 1100)
          return
        }
      } else {
        characterIndex -= 1
        setAnimatedPlaceholder(searchPlaceholder.slice(0, characterIndex))
        if (characterIndex <= 0) {
          deleting = false
          timeout = setTimeout(tick, 450)
          return
        }
      }
      timeout = setTimeout(tick, deleting ? 65 : 100)
    }

    timeout = setTimeout(tick, 350)
    return () => {
      cancelled = true
      clearTimeout(timeout)
    }
  }, [searchFocused, searchPlaceholder, searchTerm])

  useEffect(() => {
    let active = true
    setLoading(true)
    setError(false)

    getAcademyData()
      .then((data) => {
        if (!active) return
        setCategories(data.categories)
        setVideos(data.videos.filter((video) => !video.is_hidden))
      })
      .catch(() => {
        if (active) setError(true)
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => { active = false }
  }, [retryKey])

  const retry = useCallback(() => setRetryKey((key) => key + 1), [])
  const openVideo = useCallback((video: Video, trigger: HTMLButtonElement) => {
    watchTriggerRef.current = trigger
    setActiveVideo(video)
  }, [])
  const closeVideo = useCallback(() => {
    setActiveVideo(null)
    requestAnimationFrame(() => watchTriggerRef.current?.focus())
  }, [])
  const visibleVideos = useMemo(() => {
    const query = searchTerm.trim().toLocaleLowerCase()
    return videos.filter((video) => {
      const matchesCategory = selectedCategoryId === null
        || selectedCategoryId === 1
        || video.category_id === selectedCategoryId
      const matchesSearch = video.title.toLocaleLowerCase().includes(query)
      return matchesCategory && matchesSearch
    })
  }, [searchTerm, selectedCategoryId, videos])

  const categoriesWithCounts = useMemo(() => {
    const availableVideos = videos.filter((video) => !video.is_hidden)
    return categories.map((category) => ({
      ...category,
      count: category.id === 1
        ? availableVideos.length
        : availableVideos.filter((video) => video.category_id === category.id).length,
    }))
  }, [categories, videos])

  return (
    <main className="academy-page" dir={isRtl ? 'rtl' : 'ltr'}>
      <header className="academy-page__header">
        <button
          className="academy-page__back"
          type="button"
          aria-label={isRtl ? 'العودة' : 'Go back'}
          onClick={() => navigate(-1)}
        >
          {isRtl ? <ArrowRight size={20} aria-hidden="true" /> : <ArrowLeft size={20} aria-hidden="true" />}
        </button>
        <div className="academy-page__heading">
          <p className="academy-page__eyebrow">{t('sidebar.brand')}</p>
          <h1>{t('sidebar.brand')} {t('sidebar.academy')}</h1>
          <p className="academy-page__subtitle">{t('sidebar.tagline')}</p>
        </div>
      </header>

      <div className="academy-page__search-wrap">
        <Search className="academy-page__search-icon" size={20} aria-hidden="true" />
        <input
          type="search"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder={searchFocused || searchTerm ? searchPlaceholder : animatedPlaceholder}
          aria-label={searchPlaceholder}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
        />
      </div>

      {loading ? (
        <section className="academy-page__loading" aria-busy="true" aria-live="polite">
          <div className="academy-page__loading-bar" />
          <div className="academy-page__loading-grid">
            {Array.from({ length: 6 }, (_, index) => <div className="academy-page__skeleton" key={index} />)}
          </div>
          <span className="academy-page__sr-only">{t('common.loading')}</span>
        </section>
      ) : error ? (
        <section className="academy-page__error" role="alert">
          <p>{isRtl ? 'تعذر تحميل فيديوهات الأكاديمية.' : 'Could not load Academy videos.'}</p>
          <button type="button" onClick={retry}>{t('common.retry')}</button>
        </section>
      ) : (
        <>
          <CategoryTabs
            categories={categoriesWithCounts}
            selectedCategoryId={selectedCategoryId}
            onSelect={setSelectedCategoryId}
          />
          {visibleVideos.length > 0 ? (
            <section
              className="academy-page__grid"
              key={`${selectedCategoryId ?? 'all'}:${searchTerm}`}
              id="academy-video-results"
              role="tabpanel"
              aria-labelledby={`academy-category-${selectedCategoryId ?? 1}`}
              aria-label={isRtl ? 'فيديوهات الأكاديمية' : 'Academy videos'}
            >
              {visibleVideos.map((video, index) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  animationDelay={Math.min(index * 20, 120)}
                  onWatch={openVideo}
                />
              ))}
            </section>
          ) : (
            <div
              className="academy-page__empty"
              id="academy-video-results"
              role="tabpanel"
              aria-labelledby={`academy-category-${selectedCategoryId ?? 1}`}
            >
              <EmptyState message={isRtl ? 'لا توجد فيديوهات تطابق بحثك.' : 'No videos match your search.'} />
            </div>
          )}
        </>
      )}
      {activeVideo && <VideoModal video={activeVideo} onClose={closeVideo} />}
    </main>
  )
}

export default AcademyPage
