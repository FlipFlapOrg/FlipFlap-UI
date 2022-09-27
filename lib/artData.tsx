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
      {
        id: '2',
        title: 'おかえり、初恋。1',
        favorite_count: 100,
        is_favorite: false,
        comments: comments,
        urls: [
          '/images/p00000a.jpg',
          '/images/p00000b.jpg',
          '/images/p00001.jpg',
          '/images/00002.jpg',
          '/images/00003.jpg',
          '/images/00004.jpg',
          '/images/00005.jpg',
          '/images/00006.jpg',
          '/images/00007.jpg',
          '/images/00008.jpg',
          '/images/00009.jpg',
          '/images/00010.jpg',
          '/images/00011.jpg',
          '/images/00012.jpg',
          '/images/00013.jpg',
          '/images/00014.jpg',
          '/images/00015.jpg',
          '/images/00016.jpg',
          '/images/00017.jpg',
          '/images/00018.jpg',
          '/images/00019.jpg',
          '/images/00020.jpg',
          '/images/00021.jpg',
          '/images/00022.jpg',
          '/images/00023.jpg',
          '/images/00024.jpg',
          '/images/00025.jpg',
          '/images/00026.jpg',
          '/images/00027.jpg',
          '/images/00028.jpg',
          '/images/00029.jpg',
          '/images/00030.jpg',
          '/images/00031.jpg',
          '/images/00032.jpg',
          '/images/00033.jpg',
          '/images/00034.jpg',
          '/images/00035.jpg',
          '/images/00036.jpg',
          '/images/00037.jpg',
          '/images/00038.jpg',
          '/images/00039.jpg',
          '/images/00040.jpg',
          '/images/00041.jpg',
          '/images/00042.jpg',
          '/images/00043.jpg',
          '/images/00044.jpg',
          '/images/00045.jpg',
          '/images/00046.jpg',
          '/images/00047.jpg',
          '/images/00048.jpg',
          '/images/00049.jpg',
          '/images/00050.jpg',
          '/images/00051.jpg',
          '/images/00052.jpg',
          '/images/00053.jpg',
          '/images/00054.jpg',
          '/images/00055.jpg',
          '/images/00056.jpg',
          '/images/00057.jpg',
          '/images/00058.jpg',
          '/images/00059.jpg',
          '/images/00060.jpg',
          '/images/00061.jpg',
          '/images/00062.jpg',
          '/images/00063.jpg',
          '/images/00064.jpg',
          '/images/00065.jpg',
          '/images/00066.jpg',
          '/images/00067.jpg',
          '/images/00068.jpg',
          '/images/00069.jpg',
          '/images/00070.jpg',
          '/images/00071.jpg',
          '/images/00072.jpg',
          '/images/00073.jpg',
          '/images/00074.jpg',
          '/images/00075.jpg',
          '/images/00076.jpg',
          '/images/00077.jpg',
          '/images/00078.jpg',
          '/images/00079.jpg',
          '/images/00080.jpg',
          '/images/00081.jpg',
          '/images/00082.jpg',
          '/images/00083.jpg',
          '/images/00084.jpg',
          '/images/00085.jpg',
          '/images/00086.jpg',
        ],
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
