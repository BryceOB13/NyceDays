const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const BUCKET = 'media'

const getVideoUrl = (path: string) => 
  `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/videos/${path}`

export const videos = {
  hero: {
    desktop: getVideoUrl('hero/desktop.mp4'),
    mobile: getVideoUrl('hero/mobile.mp4'),
    square: getVideoUrl('hero/square.mp4'),
  },
  about: {
    header: {
      desktop: getVideoUrl('about/header-desktop.mp4'),
      mobile: getVideoUrl('about/header-mobile.mp4'),
    },
    mission: {
      desktop: getVideoUrl('about/mission-desktop.mp4'),
      mobile: getVideoUrl('about/mission-mobile.mp4'),
    },
  },
  events: {
    header: {
      desktop: getVideoUrl('events/header-desktop.mp4'),
      mobile: getVideoUrl('events/header-mobile.mp4'),
    },
  },
  media: {
    header: {
      desktop: getVideoUrl('media/header-desktop.mp4'),
      mobile: getVideoUrl('media/header-mobile.mp4'),
    },
  },
  services: {
    desktop: getVideoUrl('services/desktop.mp4'),
    mobile: getVideoUrl('services/mobile.mp4'),
  },
  upcoming: {
    desktop: getVideoUrl('upcoming/desktop.mp4'),
    mobile: getVideoUrl('upcoming/mobile.mp4'),
  },
  midPage: {
    desktop: getVideoUrl('mid-page/desktop.mp4'),
    mobile: getVideoUrl('mid-page/mobile.mp4'),
  },
}
