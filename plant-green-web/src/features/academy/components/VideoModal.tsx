import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { Video } from '../academy.service'
import './VideoModal.css'

interface VideoModalProps {
  video: Video
  onClose: () => void
}

function getYouTubeEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url)
    let videoId: string | null = null
    if (parsed.hostname === 'youtu.be' || parsed.hostname.endsWith('.youtu.be')) {
      videoId = parsed.pathname.split('/').filter(Boolean)[0] ?? null
    } else if (parsed.hostname === 'youtube.com' || parsed.hostname.endsWith('.youtube.com')) {
      if (parsed.pathname === '/watch') videoId = parsed.searchParams.get('v')
      else if (parsed.pathname.startsWith('/embed/')) videoId = parsed.pathname.split('/')[2] ?? null
      else if (parsed.pathname.startsWith('/shorts/')) videoId = parsed.pathname.split('/')[2] ?? null
    }
    return videoId && /^[\w-]{11}$/.test(videoId)
      ? `https://www.youtube.com/embed/${videoId}?autoplay=1`
      : null
  } catch {
    return null
  }
}

export function VideoModal({ video, onClose }: VideoModalProps) {
  const { i18n } = useTranslation()
  const isRtl = i18n.resolvedLanguage?.startsWith('ar') ?? i18n.language.startsWith('ar')
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const closingRef = useRef(false)
  const [isClosing, setIsClosing] = useState(false)
  const embedUrl = getYouTubeEmbedUrl(video.video_url)
  const closeModal = useCallback(() => {
    if (closingRef.current) return
    closingRef.current = true
    setIsClosing(true)
    window.setTimeout(onClose, 250)
  }, [onClose])

  useEffect(() => {
    const dialog = dialogRef.current
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        closeModal()
        return
      }
      if (event.key !== 'Tab' || !dialog) return

      const focusable = Array.from(dialog.querySelectorAll<HTMLElement>(
        'button:not([disabled]), iframe, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      )).filter((element) => element.getAttribute('aria-hidden') !== 'true')
      if (focusable.length === 0) {
        event.preventDefault()
        dialog.focus()
        return
      }
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && (document.activeElement === first || !dialog.contains(document.activeElement))) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && (document.activeElement === last || !dialog.contains(document.activeElement))) {
        event.preventDefault()
        first.focus()
      }
    }

    const keepFocusInDialog = (event: FocusEvent) => {
      if (dialog && !dialog.contains(event.target as Node)) closeButtonRef.current?.focus()
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('focusin', keepFocusInDialog)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('focusin', keepFocusInDialog)
    }
  }, [closeModal])

  return createPortal(
    <div className={`academy-video-modal__backdrop${isClosing ? ' is-closing' : ''}`} onMouseDown={(event) => {
      if (event.target === event.currentTarget) closeModal()
    }}>
      <div
        ref={dialogRef}
        className="academy-video-modal__panel"
        role="dialog"
        aria-modal="true"
        aria-label={video.title}
        tabIndex={-1}
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        <header className="academy-video-modal__header">
          <h2 className="academy-video-modal__title">{video.title}</h2>
          <button
            ref={closeButtonRef}
            className="academy-video-modal__close"
            type="button"
            aria-label={isRtl ? 'إغلاق الفيديو' : 'Close video'}
            onClick={closeModal}
          >
            <X size={22} aria-hidden="true" />
          </button>
        </header>
        <div className="academy-video-modal__player">
          {embedUrl && !isClosing ? (
            <iframe
              key={embedUrl}
              src={embedUrl}
              title={video.title}
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
            />
          ) : (
            <p className="academy-video-modal__fallback">
              {isRtl ? 'المعاينة غير متاحة لهذا الفيديو.' : 'Preview not available for this video.'}
            </p>
          )}
        </div>
      </div>
    </div>,
    document.body,
  )
}
