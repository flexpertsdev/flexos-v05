import type { Database } from '../database'

// Base database type
export type PageRow = Database['public']['Tables']['pages']['Row']

// Extended page type with computed/derived fields
export interface Page extends PageRow {
  // Add any computed properties here
}

// Page metadata structure
export interface PageMeta {
  status?: 'draft' | 'in-progress' | 'completed' | 'done'
  description?: string
  lastEdited?: string
  author?: string
  [key: string]: any
}

// Page content structure
export interface PageContent {
  vueTemplate?: string
  template?: string
  components?: string[]
  styles?: Record<string, any>
  [key: string]: any
}

// Helper to get typed metadata
export function getPageMeta(page: PageRow): PageMeta {
  return (page.meta as PageMeta) || {}
}

// Helper to get typed content
export function getPageContent(page: PageRow): PageContent {
  return (page.content as PageContent) || {}
}
