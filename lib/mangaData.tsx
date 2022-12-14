import { produce } from 'immer'
import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useCallback,
  useState,
} from 'react'
import useSWR from 'swr'
import { Client, useClient } from 'api'
import { getManga as getMangaApi } from 'api/manga/[id]'
import { recommend } from 'api/manga/recommend'
import { Manga as MangaModel, Shop } from 'api/parser/manga'
import { addBookmarks, removeBookmarks } from 'api/users/[user_id]/bookmarks'
import { favorite, unfavorite } from 'api/users/[user_id]/faves'

export interface Manga {
  base_url: string
  id: string
  description: {
    title: string
    author: string
    links: Shop[]
    cover_image_url: string
  }
  page_count: number
  favorite_count: number
  is_favorite: boolean
  is_bookmarked: boolean
}

export const formatManga = (data: MangaModel, base_url: string): Manga => {
  return {
    base_url,
    id: data.manga_id,
    description: {
      title: data.title,
      author: data.author,
      links: data.next_info,
      cover_image_url: `/manga/${data.manga_id}/image/0`,
    },
    page_count: data.page_num,
    favorite_count: data.faves_count,
    is_favorite: data.is_faved,
    is_bookmarked: data.is_bookmarked,
  }
}

export const getRecommendedManga = async (
  client: Client,
  user_id: string
): Promise<Manga | null> => {
  try {
    const data = await recommend(client)(user_id)
    return formatManga(data, client.baseUrl)
  } catch (e) {
    console.error(e)
    return null
  }
}

export const getManga = async (
  client: Client,
  manga_id: string,
  user_id: string
): Promise<Manga | null> => {
  try {
    const data = await getMangaApi(client)(user_id, manga_id)
    return formatManga(data, client.baseUrl)
  } catch (e) {
    console.error(e)
    return null
  }
}

export interface MangaContextType {
  manga: Manga[]
  setManga: Dispatch<SetStateAction<Manga[]>>
}

export const MangaContext = createContext<MangaContextType>({
  manga: [],
  setManga: () => {},
})

export const MangaProvider: React.FC<PropsWithChildren<{}>> = ({
  children,
}) => {
  const [manga, setManga] = useState<Manga[]>([])

  return (
    <MangaContext.Provider value={{ manga, setManga }}>
      {children}
    </MangaContext.Provider>
  )
}

export type MangaState = Manga & {
  pageIndex: number
}
export const initialMangaState = (manga: Manga): MangaState => ({
  ...manga,
  pageIndex: 0,
})

export interface Data {
  manga: MangaState[]
  currentMangaIndex: number | undefined
  task: Promise<void> | undefined
}

export const useManga = () => {
  const client = useClient()
  const { data, error, mutate } = useSWR<Data>('state:manga', {
    fallbackData: {
      manga: [],
      currentMangaIndex: undefined,
      task: undefined,
    },
  })

  const initializeAction = useCallback(
    async (user_id: string, manga_id?: string) => {
      const getFirstManga =
        manga_id === undefined
          ? getRecommendedManga(client, user_id)
          : getManga(client, manga_id, user_id)
      const getSecondManga = getRecommendedManga(client, user_id)

      const manga = await getFirstManga

      let resolver: () => void
      const stopper = new Promise<void>((resolve) => {
        resolver = resolve
      })

      const task = (async () => {
        const manga = await getSecondManga
        if (manga === null) {
          return
        }
        await stopper
        mutate((prev) => {
          if (prev === undefined) {
            throw new Error('Failed to mutate')
          }

          return produce(prev, (draft) => {
            draft.manga.push(initialMangaState(manga))
            draft.task = undefined
          })
        })
      })()

      mutate(
        {
          manga: manga === null ? [] : [initialMangaState(manga)],
          currentMangaIndex: 0,
          task,
        },
        false
      )

      resolver!()
    },
    [client, mutate]
  )

  const readNextAction = useCallback(
    async (user_id: string) => {
      if (data === undefined || data.currentMangaIndex === undefined) {
        throw new Error('Failed to read next')
      }

      // ?????????????????????????????????????????????????????????????????????
      if (data.currentMangaIndex === data.manga.length - 2) {
        if (data.task !== undefined) {
          await data.task
        }

        const task = (async () => {
          const manga = await getRecommendedManga(client, user_id)
          if (manga === null) {
            return
          }

          mutate((prev) => {
            if (prev === undefined) {
              throw new Error('Failed to mutate')
            }

            return produce(prev, (draft) => {
              draft.manga.push(initialMangaState(manga))
              draft.task = undefined
            })
          })
        })()
        mutate((prev) => {
          if (prev === undefined) {
            throw new Error('Failed to mutate')
          }

          return produce(prev, (draft) => {
            draft.task = task
          })
        })
      }
      if (data.currentMangaIndex === data.manga.length - 2) {
        console.error('Failed to read next')
        return
      }

      mutate((prev) => {
        if (prev === undefined) {
          throw new Error('Failed to mutate')
        }

        return produce(prev, (draft) => {
          draft.currentMangaIndex = draft.currentMangaIndex! + 1
        })
      })
    },
    [client, data, mutate]
  )

  const readPrevAction = useCallback(() => {
    mutate((data) => {
      if (data === undefined) {
        throw new Error('Failed to mutate')
      }

      return produce(data, (draft) => {
        draft.currentMangaIndex =
          draft.currentMangaIndex === 0 ? 0 : draft.currentMangaIndex! - 1
      })
    }, false)
  }, [mutate])

  const seekAction = useCallback(
    (pageIndex: number) => {
      mutate((data) => {
        if (data === undefined) {
          throw new Error('Failed to mutate')
        }

        return produce(data, (draft) => {
          draft.manga[draft.currentMangaIndex!].pageIndex = pageIndex
        })
      }, false)
    },
    [mutate]
  )

  const favoriteAction = useCallback(
    async (user_id: string, manga_id: string) => {
      if (data === undefined || data.currentMangaIndex === undefined) {
        throw new Error('Failed to favorite')
      }

      await favorite(client)(user_id, manga_id)

      mutate((prev) => {
        if (prev === undefined) {
          throw new Error('Failed to mutate')
        }

        return produce(prev, (draft) => {
          draft.manga = draft.manga.map((data) => {
            if (data.id !== manga_id) {
              return data
            }
            return {
              ...data,
              favorite_count: data.favorite_count + (data.is_favorite ? 0 : 1),
              is_favorite: true,
            }
          })
        })
      })
    },
    [client, data, mutate]
  )

  const unfavoriteAction = useCallback(
    async (user_id: string, manga_id: string) => {
      if (data === undefined || data.currentMangaIndex === undefined) {
        throw new Error('Failed to unfavorite')
      }

      await unfavorite(client)(user_id, manga_id)

      mutate((prev) => {
        if (prev === undefined) {
          throw new Error('Failed to mutate')
        }

        return produce(prev, (draft) => {
          draft.manga = draft.manga.map((data) => {
            if (data.id !== manga_id) {
              return data
            }
            return {
              ...data,
              favorite_count: data.favorite_count - (data.is_favorite ? 1 : 0),
              is_favorite: false,
            }
          })
        })
      })
    },
    [client, data, mutate]
  )

  const addBookmarkAction = useCallback(
    async (user_id: string, manga_id: string) => {
      if (data === undefined || data.currentMangaIndex === undefined) {
        throw new Error('Failed to add bookmarks')
      }

      await addBookmarks(client)(user_id, manga_id)

      mutate((prev) => {
        if (prev === undefined) {
          throw new Error('Failed to mutate')
        }

        return produce(prev, (draft) => {
          draft.manga = draft.manga.map((data) => {
            if (data.id !== manga_id) {
              return data
            }
            return {
              ...data,
              is_bookmarked: true,
            }
          })
        })
      })
    },
    [client, data, mutate]
  )

  const removeBookmarkAction = useCallback(
    async (user_id: string, manga_id: string) => {
      if (data === undefined || data.currentMangaIndex === undefined) {
        throw new Error('Failed to remove bookmarks')
      }

      await removeBookmarks(client)(user_id, manga_id)

      mutate((prev) => {
        if (prev === undefined) {
          throw new Error('Failed to mutate')
        }

        return produce(prev, (draft) => {
          draft.manga = draft.manga.map((data) => {
            if (data.id !== manga_id) {
              return data
            }
            return {
              ...data,
              is_bookmarked: false,
            }
          })
        })
      })
    },
    [client, data, mutate]
  )

  return {
    data: {
      manga: data?.manga,
      currentMangaIndex: data?.currentMangaIndex,
    },
    error,
    mutate: {
      initialize: initializeAction,
      readNext: readNextAction,
      readPrev: readPrevAction,
      seek: seekAction,
      favorite: favoriteAction,
      unfavorite: unfavoriteAction,
      addBookmark: addBookmarkAction,
      removeBookmark: removeBookmarkAction,
    },
  }
}
