import { useState } from 'react'
import { CirclePlay, Play } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { Video } from '../academy.service'
import './VideoCard.css'

interface VideoCardProps {
  video: Video
  animationDelay?: number
  onWatch: (video: Video, trigger: HTMLButtonElement) => void
}

export function VideoCard({ video, animationDelay = 0, onWatch }: VideoCardProps) {
  const { i18n } = useTranslation()
  const isRtl = i18n.resolvedLanguage?.startsWith('ar') ?? i18n.language.startsWith('ar')
  const [imageFailed, setImageFailed] = useState(false)
  const isPlaceholderThumbnail = video.thumbnail.includes('placehold.co')

  return (
    <article className="academy-video-card" style={{ animationDelay: `${animationDelay}ms` }}>
      <button
        className="academy-video-card__thumbnail-wrap"
        type="button"
        aria-label={isRtl ? `تشغيل الفيديو: ${video.title}` : `Play video: ${video.title}`}
        onClick={(event) => onWatch(video, event.currentTarget)}
      >
        {isPlaceholderThumbnail && <span className="academy-video-card__placeholder" aria-hidden="true">400 × 225</span>}
        {!imageFailed ? (
          <img
            className="academy-video-card__thumbnail"
            src={video.thumbnail}
            alt=""
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="academy-video-card__fallback" aria-hidden="true"><Play size={34} fill="currentColor" /></div>
        )}
        <span className="academy-video-card__play-overlay" aria-hidden="true">
          <span className="academy-video-card__play-button"><Play size={25} fill="currentColor" /></span>
        </span>
        <span className="academy-video-card__source"><CirclePlay size={16} aria-hidden="true" /> YouTube</span>
      </button>
      <div className="academy-video-card__body">
        <h2>{video.title}</h2>
        <p className="academy-video-card__description">{video.description}</p>
        <div className="academy-video-card__meta">
          <span className="academy-video-card__level">{video.level}</span>
        </div>
        <button
          className="academy-video-card__watch"
          type="button"
          onClick={(event) => onWatch(video, event.currentTarget)}
        >
          <span>{isRtl ? 'شاهد الآن' : 'Watch Now'}</span>
          <Play size={16} aria-hidden="true" />
        </button>
      </div>
    </article>
  )
}
