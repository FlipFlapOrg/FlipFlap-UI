import { NextPage } from 'next'
import { useManga } from 'lib/mangaData'
import { SkeltonCircle } from './components/Skeletons'
import { Client } from 'api'
import { PropsWithChildren, useEffect } from 'react'
import styled from '@emotion/styled'
import { css } from '@emotion/react'
import { useUserData } from 'lib/userData'

/**
 * page は 0-indexed
 */
const imageUrl = (client: Client, manga_id: string, page: number) => {
  return `${client.baseUrl}/manga/${manga_id}/image/${page + 1}`
}

const Viewer: NextPage = () => {
  const {
    data: { manga, currentMangaIndex },
    error,
    mutate,
  } = useManga()
  const { data: userData, error: userError } = useUserData()

  useEffect(() => {
    mutate.initialize(userData?.id ?? 'unknown')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (error || userError) {
    return <div>Failed to load</div>
  }

  if (!manga || !currentMangaIndex || !userData) {
    return <SkeltonCircle size={300} />
  }

  console.log(manga, currentMangaIndex)

  return (
    // 一番外で中身のサイズを指定 (主に PC で横幅小さくする用)
    <div>
      oisu
      {/* ここでスクロールように長いの置く */}
      {/* ここにページ郡と最後のページとかを置く */}
    </div>
  )
}

const PageElement = styled.div``

interface ViewerPageProps {
  image_url: string
}
const ViewerPage: React.FC<ViewerPageProps> = ({ image_url }) => {
  return (
    <div
      css={(theme) => css`
        height: 100%;
        width: 100%;
        background-color: ${theme.background.primary};
      `}
    >
      {/* ここはイメージ置くだけ */}
      {/* todo */}
    </div>
  )
}
export default Viewer
