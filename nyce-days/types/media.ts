export type MediaVariant = {
  url: string
  width: number
  height: number
}

export type MediaItem = {
  id: string
  alt?: string
  caption?: string
  category?: string
  createdAt: string
  position: number
  variants: {
    thumb: MediaVariant
    grid: MediaVariant
    full: MediaVariant
  }
}

export type ManifestItem = {
  relative_source: string
  original: {
    width: number
    height: number
  }
  outputs: {
    thumb: {
      relative_path: string
      width: number
      height: number
    }
    grid: {
      relative_path: string
      width: number
      height: number
    }
    full: {
      relative_path: string
      width: number
      height: number
    }
  }
}

export type Manifest = {
  variants: Array<{ name: string; width: number; quality: number }>
  items: ManifestItem[]
}
