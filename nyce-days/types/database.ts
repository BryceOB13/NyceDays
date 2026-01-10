// types/database.ts
// Supabase Database Types for Nyce Days

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      media: {
        Row: {
          id: string
          created_at: string
          filename: string
          storage_path: string
          public_url: string | null
          type: 'image' | 'video'
          mime_type: string | null
          width: number | null
          height: number | null
          size_bytes: number | null
          alt_text: string | null
          caption: string | null
          category: 'event' | 'bts' | 'merch' | 'community' | 'site' | null
          project_id: string | null
          sort_order: number
        }
        Insert: {
          id?: string
          created_at?: string
          filename: string
          storage_path: string
          public_url?: string | null
          type: 'image' | 'video'
          mime_type?: string | null
          width?: number | null
          height?: number | null
          size_bytes?: number | null
          alt_text?: string | null
          caption?: string | null
          category?: 'event' | 'bts' | 'merch' | 'community' | 'site' | null
          project_id?: string | null
          sort_order?: number
        }
        Update: {
          id?: string
          created_at?: string
          filename?: string
          storage_path?: string
          public_url?: string | null
          type?: 'image' | 'video'
          mime_type?: string | null
          width?: number | null
          height?: number | null
          size_bytes?: number | null
          alt_text?: string | null
          caption?: string | null
          category?: 'event' | 'bts' | 'merch' | 'community' | 'site' | null
          project_id?: string | null
          sort_order?: number
        }
      }
      projects: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          slug: string
          description: string | null
          content: string | null
          client: string | null
          date: string | null
          location: string | null
          category: 'event' | 'content' | 'partnership' | null
          services: string[] | null
          featured: boolean
          published: boolean
          hero_media_id: string | null
          sort_order: number
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          title: string
          slug: string
          description?: string | null
          content?: string | null
          client?: string | null
          date?: string | null
          location?: string | null
          category?: 'event' | 'content' | 'partnership' | null
          services?: string[] | null
          featured?: boolean
          published?: boolean
          hero_media_id?: string | null
          sort_order?: number
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          title?: string
          slug?: string
          description?: string | null
          content?: string | null
          client?: string | null
          date?: string | null
          location?: string | null
          category?: 'event' | 'content' | 'partnership' | null
          services?: string[] | null
          featured?: boolean
          published?: boolean
          hero_media_id?: string | null
          sort_order?: number
        }
      }
      products: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          slug: string
          description: string | null
          price: number
          compare_price: number | null
          category: 'apparel' | 'accessories' | 'tickets' | null
          variants: Json
          inventory: number
          published: boolean
          featured: boolean
          snipcart_id: string | null
          sort_order: number
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name: string
          slug: string
          description?: string | null
          price: number
          compare_price?: number | null
          category?: 'apparel' | 'accessories' | 'tickets' | null
          variants?: Json
          inventory?: number
          published?: boolean
          featured?: boolean
          snipcart_id?: string | null
          sort_order?: number
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string
          slug?: string
          description?: string | null
          price?: number
          compare_price?: number | null
          category?: 'apparel' | 'accessories' | 'tickets' | null
          variants?: Json
          inventory?: number
          published?: boolean
          featured?: boolean
          snipcart_id?: string | null
          sort_order?: number
        }
      }
      product_images: {
        Row: {
          id: string
          product_id: string
          media_id: string
          is_primary: boolean
          sort_order: number
        }
        Insert: {
          id?: string
          product_id: string
          media_id: string
          is_primary?: boolean
          sort_order?: number
        }
        Update: {
          id?: string
          product_id?: string
          media_id?: string
          is_primary?: boolean
          sort_order?: number
        }
      }
      events: {
        Row: {
          id: string
          created_at: string
          title: string
          slug: string
          description: string | null
          date: string
          time: string | null
          end_date: string | null
          location: string | null
          address: string | null
          ticket_url: string | null
          ticket_price: number | null
          published: boolean
          featured: boolean
          flyer_media_id: string | null
          project_id: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          slug: string
          description?: string | null
          date: string
          time?: string | null
          end_date?: string | null
          location?: string | null
          address?: string | null
          ticket_url?: string | null
          ticket_price?: number | null
          published?: boolean
          featured?: boolean
          flyer_media_id?: string | null
          project_id?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          slug?: string
          description?: string | null
          date?: string
          time?: string | null
          end_date?: string | null
          location?: string | null
          address?: string | null
          ticket_url?: string | null
          ticket_price?: number | null
          published?: boolean
          featured?: boolean
          flyer_media_id?: string | null
          project_id?: string | null
        }
      }
      subscribers: {
        Row: {
          id: string
          created_at: string
          email: string
          source: 'footer' | 'community' | 'shop' | 'contact' | null
          subscribed: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          email: string
          source?: 'footer' | 'community' | 'shop' | 'contact' | null
          subscribed?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          email?: string
          source?: 'footer' | 'community' | 'shop' | 'contact' | null
          subscribed?: boolean
        }
      }
      contact_submissions: {
        Row: {
          id: string
          created_at: string
          name: string
          email: string
          company: string | null
          inquiry_type: 'partnership' | 'event' | 'content' | 'general'
          message: string
          referral: string | null
          read: boolean
          archived: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          email: string
          company?: string | null
          inquiry_type: 'partnership' | 'event' | 'content' | 'general'
          message: string
          referral?: string | null
          read?: boolean
          archived?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          email?: string
          company?: string | null
          inquiry_type?: 'partnership' | 'event' | 'content' | 'general'
          message?: string
          referral?: string | null
          read?: boolean
          archived?: boolean
        }
      }
      site_settings: {
        Row: {
          id: string
          key: string
          value: Json | null
          updated_at: string
        }
        Insert: {
          id?: string
          key: string
          value?: Json | null
          updated_at?: string
        }
        Update: {
          id?: string
          key?: string
          value?: Json | null
          updated_at?: string
        }
      }
    }
    Views: {
      featured_projects: {
        Row: {
          id: string
          title: string
          slug: string
          description: string | null
          category: string | null
          date: string | null
          hero_url: string | null
          hero_alt: string | null
        }
      }
      upcoming_events: {
        Row: {
          id: string
          title: string
          slug: string
          description: string | null
          date: string
          location: string | null
          ticket_url: string | null
          flyer_url: string | null
          flyer_alt: string | null
        }
      }
      shop_products: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          price: number
          compare_price: number | null
          category: string | null
          inventory: number
          image_url: string | null
          image_alt: string | null
        }
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Helper types for common queries
export type Media = Database['public']['Tables']['media']['Row']
export type Project = Database['public']['Tables']['projects']['Row']
export type Product = Database['public']['Tables']['products']['Row']
export type ProductImage = Database['public']['Tables']['product_images']['Row']
export type Event = Database['public']['Tables']['events']['Row']
export type Subscriber = Database['public']['Tables']['subscribers']['Row']
export type ContactSubmission = Database['public']['Tables']['contact_submissions']['Row']
export type SiteSetting = Database['public']['Tables']['site_settings']['Row']

// Extended types with relations
export type ProjectWithMedia = Project & {
  hero_media: Media | null
  gallery?: Media[]
}

export type ProductWithImages = Product & {
  images: (ProductImage & { media: Media })[]
}

export type EventWithFlyer = Event & {
  flyer: Media | null
}

// Insert types
export type MediaInsert = Database['public']['Tables']['media']['Insert']
export type ProjectInsert = Database['public']['Tables']['projects']['Insert']
export type ProductInsert = Database['public']['Tables']['products']['Insert']
export type EventInsert = Database['public']['Tables']['events']['Insert']
export type SubscriberInsert = Database['public']['Tables']['subscribers']['Insert']
export type ContactSubmissionInsert = Database['public']['Tables']['contact_submissions']['Insert']
