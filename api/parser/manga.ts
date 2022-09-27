import { z } from 'zod'

export interface Manga {
  manga_id: string
  title: string
  author: string
  tags: string[]
  page_num: number
  is_faved: boolean
  is_bookmarked: boolean
  faves_count: number
  next_info: Shop[]
}

export interface Shop {
  service_name: string
  url: string
}

export const shopSchema = z.object({
  service_name: z.string(),
  url: z.string(),
})

export const mangaSchema = z.object({
  manga_id: z.string(),
  title: z.string(),
  author: z.string(),
  tags: z.array(z.string()),
  page_num: z.number(),
  is_faved: z.boolean(),
  is_bookmarked: z.boolean(),
  faves_count: z.number(),
  next_info: z.array(shopSchema),
})

export const bookmarksSchema = z.array(mangaSchema)
