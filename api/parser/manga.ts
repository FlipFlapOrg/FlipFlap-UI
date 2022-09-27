import { z } from 'zod'

export interface Manga {
  manga_id: string
  title: string
  author: string
  tags: string[]
  manga_url: string
  page_num: number
  is_faved: boolean
  is_bookmarked: boolean
  faves_count: number
}

export const mangaSchema = z.object({
  manga_id: z.string(),
  title: z.string(),
  author: z.string(),
  tags: z.array(z.string()),
  manga_url: z.string(),
  page_num: z.number(),
  is_faved: z.boolean(),
  is_bookmarked: z.boolean(),
  faves_count: z.number(),
})
