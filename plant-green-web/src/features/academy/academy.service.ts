/** Category returned by GET /api/academy. */
export interface Category {
  id: number
  name_en: string
  name_ar: string
  count: number | null
}

/** Video returned by GET /api/academy. */
export interface Video {
  id: number
  title: string
  description: string
  video_url: string
  thumbnail: string
  category_id: number
  level: 'Standard' | 'Advanced'
  is_hidden: boolean
}

/** Payload returned by GET /api/academy. */
export interface AcademyResponse {
  categories: Category[]
  videos: Video[]
}

const MOCK_CATEGORIES: Category[] = [
  { id: 1, name_en: 'All Videos', name_ar: 'كل الفيديوهات', count: 0 },
  { id: 2, name_en: 'Getting Started', name_ar: 'ابدأ هنا', count: 0 },
  { id: 3, name_en: 'Irrigation & Canopy', name_ar: 'الري والمظلات', count: 0 },
  { id: 4, name_en: 'Devices & Sensors', name_ar: 'الأجهزة والحساسات', count: 0 },
  { id: 5, name_en: 'Weather & Climate Alerts', name_ar: 'الطقس والتنبيهات المناخية', count: 0 },
  { id: 6, name_en: 'Farm Cost & Pricing', name_ar: 'التكلفة والأسعار', count: 0 },
  { id: 7, name_en: 'Success Stories', name_ar: 'قصص نجاح المزارعين', count: 0 },
]

const MOCK_VIDEOS: Video[] = [
  {
    id: 1,
    title: 'SIDEUP | Create Bulk Shipments',
    description: 'YouTube Video',
    video_url: 'https://youtube.com/watch?v=PLACEHOLDER1',
    thumbnail: 'https://placehold.co/400x225',
    // Guess: this shipment how-to is closest to a general Getting Started tutorial.
    category_id: 2,
    level: 'Standard',
    is_hidden: false,
  },
  {
    id: 2,
    title: 'SIDEUP | Create New Single Shipment',
    description: 'YouTube Video',
    video_url: 'https://youtube.com/watch?v=PLACEHOLDER2',
    thumbnail: 'https://placehold.co/400x225',
    // Guess: this shipment how-to is closest to a general Getting Started tutorial.
    category_id: 2,
    level: 'Standard',
    is_hidden: false,
  },
  {
    id: 3,
    title: 'SIDEUP | Create reverse shipment',
    description: 'YouTube Video',
    video_url: 'https://youtube.com/watch?v=PLACEHOLDER3',
    thumbnail: 'https://placehold.co/400x225',
    // Guess: this shipment how-to is closest to a general Getting Started tutorial.
    category_id: 2,
    level: 'Standard',
    is_hidden: false,
  },
  ...Array.from({ length: 16 }, (_, index): Video => {
    const id = index + 4

    return {
      id,
      title: `Placeholder Video ${id}`,
      description: 'YouTube Video',
      video_url: `https://youtube.com/watch?v=PLACEHOLDER${id}`,
      thumbnail: 'https://placehold.co/400x225',
      // Guess: placeholder titles provide no topic, so distribute across categories 3–7.
      category_id: [3, 4, 5, 6, 7][index % 5],
      level: 'Standard',
      is_hidden: false,
    }
  }),
]

// Derive badge counts from visible mock videos.
for (const category of MOCK_CATEGORIES) {
  category.count = category.id === 1
    ? MOCK_VIDEOS.filter((video) => !video.is_hidden).length
    : MOCK_VIDEOS.filter((video) => !video.is_hidden && video.category_id === category.id).length
}

/**
 * Mock implementation of GET /api/academy.
 * Replace only this function's body with the real HTTP request when available.
 */
export function getAcademyData(): Promise<AcademyResponse> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        categories: MOCK_CATEGORIES.map((category) => ({ ...category })),
        videos: MOCK_VIDEOS.map((video) => ({ ...video })),
      })
    }, 400)
  })
}
