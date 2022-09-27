import { NextPage } from 'next'
import { useManga } from 'lib/mangaData'

/**
 * page は 0-indexed
 */
const imageUrl = (manga_id: string, page: number) => {
  return `/api/manga/${manga_id}/image/${page + 1}`
}

const Viewer: NextPage = () => {
  const {
    data: { manga, currentMangaIndex },
    error,
    mutate,
  } = useManga()

  return (
    <div>oisu-</div>
  )
}

export default Viewer
