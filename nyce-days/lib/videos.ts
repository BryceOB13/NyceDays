const VIDEO_CDN = 'https://pub-4acc10508d2b4472a5ef31d7322ce9af.r2.dev'

export type VideoSource = {
  desktop: string
  mobile: string
  poster: string
  square?: string
}

export const videos = {
  hero: {
    desktop: `${VIDEO_CDN}/hero/desktop.mp4`,
    mobile: `${VIDEO_CDN}/hero/mobile.mp4`,
    square: `${VIDEO_CDN}/hero/square.mp4`,
    poster: `${VIDEO_CDN}/hero/desktop-poster.webp`,
  },
  about: {
    header: {
      desktop: `${VIDEO_CDN}/about/header-desktop.mp4`,
      mobile: `${VIDEO_CDN}/about/header-mobile.mp4`,
      poster: `${VIDEO_CDN}/about/header-poster.webp`,
    },
    mission: {
      desktop: `${VIDEO_CDN}/about/mission-desktop.mp4`,
      mobile: `${VIDEO_CDN}/about/mission-mobile.mp4`,
      poster: `${VIDEO_CDN}/about/mission-poster.webp`,
    },
  },
  events: {
    header: {
      desktop: `${VIDEO_CDN}/events/header-desktop.mp4`,
      mobile: `${VIDEO_CDN}/events/header-mobile.mp4`,
      poster: `${VIDEO_CDN}/events/header-poster.webp`,
    },
  },
  media: {
    header: {
      desktop: `${VIDEO_CDN}/media/header-desktop.mp4`,
      mobile: `${VIDEO_CDN}/media/header-mobile.mp4`,
      poster: `${VIDEO_CDN}/media/header-poster.webp`,
    },
  },
  services: {
    desktop: `${VIDEO_CDN}/services/desktop.mp4`,
    mobile: `${VIDEO_CDN}/services/mobile.mp4`,
    poster: `${VIDEO_CDN}/services/poster.webp`,
  },
  upcoming: {
    desktop: `${VIDEO_CDN}/upcoming/desktop.mp4`,
    mobile: `${VIDEO_CDN}/upcoming/mobile.mp4`,
    poster: `${VIDEO_CDN}/upcoming/poster.webp`,
  },
  midPage: {
    desktop: `${VIDEO_CDN}/mid-page/desktop.mp4`,
    mobile: `${VIDEO_CDN}/mid-page/mobile.mp4`,
    poster: `${VIDEO_CDN}/mid-page/poster.webp`,
  },
} as const
