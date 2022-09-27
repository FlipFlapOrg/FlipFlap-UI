import { produce } from 'immer'
import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useState,
} from 'react'
import useSWR from 'swr'
import { Client, useClient } from 'api'
import { recommend } from 'api/manga/recommend'
import { addBookmarks, removeBookmarks } from 'api/users/[user_id]/bookmarks'
import { favorite, unfavorite } from 'api/users/[user_id]/faves'

export interface Manga {
  id: string
  description: {
    title: string
    author: string
    links: string[]
    cover_image_url: string
  }
  page_count: number
  favorite_count: number
  is_favorite: boolean
  is_bookmarked: boolean
}

export const getRecommendedManga = async (
  client: Client,
  user_id: string
): Promise<Manga | null> => {
  try {
    const data = await recommend(client)(user_id)
    return {
      id: data.manga_id,
      description: {
        title: data.title,
        author: data.author,
        links: data.manga_url.split(','),
        cover_image_url: `/api/manga/${data.manga_id}/image/0`,
      },
      page_count: data.page_num,
      favorite_count: data.faves_count,
      is_favorite: data.is_faved,
      is_bookmarked: data.is_bookmarked,
    }
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

  const initializeAction = async (user_id: string) => {
    const getFirstManga = getRecommendedManga(client, user_id)
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
  }

  const readNextAction = async (user_id: string) => {
    if (data === undefined || data.currentMangaIndex === undefined) {
      throw new Error('Failed to read next')
    }

    // 読み込みが終わっている中で最後の漫画だった場合
    if (data.currentMangaIndex === data.manga.length - 1) {
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
    if (data.currentMangaIndex === data.manga.length - 1) {
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
  }

  const readPrevAction = () => {
    mutate((data) => {
      if (data === undefined) {
        throw new Error('Failed to mutate')
      }

      return produce(data, (draft) => {
        draft.currentMangaIndex =
          draft.currentMangaIndex === 0 ? 0 : draft.currentMangaIndex! - 1
      })
    }, false)
  }

  const seekAction = (pageIndex: number) => {
    mutate((data) => {
      if (data === undefined) {
        throw new Error('Failed to mutate')
      }

      return produce(data, (draft) => {
        draft.manga[draft.currentMangaIndex!].pageIndex = pageIndex
      })
    }, false)
  }

  const favoriteAction = async (user_id: string, manga_id: string) => {
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
  }

  const unfavoriteAction = async (user_id: string, manga_id: string) => {
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
  }

  const addBookmarkAction = async (user_id: string, manga_id: string) => {
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
  }

  const removeBookmarkAction = async (user_id: string, manga_id: string) => {
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
  }

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
