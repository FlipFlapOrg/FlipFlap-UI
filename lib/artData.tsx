import { produce } from 'immer'
import useSWR from 'swr'

// TODO: Comment と Manga は API とかの方にまとめる
export interface Comment {
  id: string
  author_id: string
  author_name: string
  favorite_count: number
  is_favorite: boolean
  content: string
}

export interface Manga {
  id: string
  title: string
  favorite_count: number
  is_favorite: boolean
  comments: Comment[]
  urls: string[]
}

export interface Data {
  manga: Manga[]
  currentMangaIndex: number
  currentPage: number
}
export const useArtData = () => {
  // TODO: key は tmp
  const { data, error, mutate } = useSWR<Data>('/api/artData', async (_) => {
    // TODO: API はまだないので、とりあえずダミー
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const comments: Comment[] = [
      {
        id: '1',
        author_id: '1',
        author_name: 'author1',
        favorite_count: 20,
        is_favorite: false,
        content: 'Comment aaaaaaaaaaaaaaaaaa',
      },
      {
        id: '2',
        author_id: '2',
        author_name: 'author2',
        favorite_count: 10,
        is_favorite: false,
        content: 'Comment bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
      },
    ]
    const manga: Manga[] = [
      {
        id: '1',
        title: 'Manga 1',
        favorite_count: 20,
        is_favorite: false,
        comments: comments,
        urls: ['/images/p00000a.jpg', '/images/p00000b.jpg'],
      },
    ]
    return {
      manga: manga,
      currentMangaIndex: 0,
      currentPage: 0,
    }
  })

  const toggleFavorite = async (id: string) => {
    if (!data) {
      return
    }
    // await fetch('/api/favorite/toggle', {
    //   method: 'POST',
    //   body: JSON.stringify({
    //     mangaId: id
    //   })
    // })
    mutate((prev) => {
      if (!prev) {
        return prev
      }

      return produce(prev, (draft) => {
        draft.manga = draft.manga.map((manga) => {
          if (manga.id === id) {
            manga.is_favorite = !manga.is_favorite
            manga.favorite_count += manga.is_favorite ? 1 : -1
          }
          return manga
        })
      })
    })
  }

  const addComment = async (mangaId: string, content: string) => {
    if (!data) {
      return
    }

    // TODO: API はないので叩かない

    mutate((prev) => {
      if (!prev) {
        return prev
      }

      return produce(prev, (draft) => {
        draft.manga = draft.manga.map((manga) => {
          if (manga.id === mangaId) {
            manga.comments.push({
              id: '3',
              author_id: '3',
              author_name: 'author3',
              favorite_count: 0,
              is_favorite: false,
              content: content,
            })
          }
          return manga
        })
      })
    })
  }

  const toggleCommentFavorite = async (mangaId: string, commentId: string) => {
    console.log(data)
    if (!data) {
      return
    }

    // TODO: API はないので叩かない

    mutate((prev) => {
      if (!prev) {
        return prev
      }

      return produce(prev, (draft) => {
        draft.manga = draft.manga.map((manga) => {
          if (manga.id === mangaId) {
            const comments = manga.comments.map((comment) => {
              if (comment.id !== commentId) {
                return comment
              }
              return {
                ...comment,
                is_favorite: !comment.is_favorite,
                favorite_count:
                  comment.favorite_count - (comment.is_favorite ? 1 : -1),
              }
            })
            return {
              ...manga,
              comments: comments,
            }
          }
          return manga
        })
      })
    })
  }

  return {
    data,
    error,
    mutate: {
      toggleFavorite,
      addComment,
      toggleCommentFavorite,
    },
  }
}
