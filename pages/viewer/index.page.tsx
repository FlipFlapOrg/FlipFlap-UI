import { NextPage } from 'next'
import { useManga } from 'lib/mangaData'
import { SkeltonCircle } from './components/Skeletons'
import { Client } from 'api'
import { PropsWithChildren } from 'react'
import styled from '@emotion/styled'
import { css } from '@emotion/react'
import { CustomTheme } from 'components/theme'

/**
 * page は 0-indexed
 */
const imageUrl = (client: Client, manga_id: string, page: number) => {
  return `${client.baseUrl}/api/manga/${manga_id}/image/${page + 1}`
}

const Viewer: NextPage = () => {
  const {
    data: { manga, currentMangaIndex },
    error,
    mutate,
  } = useManga()

  return (
    // 一番外で中身のサイズを指定 (主に PC で横幅小さくする用)
    <div>
      {/* ここでスクロールように長いの置く */}
      {/* ここにページ郡と最後のページとかを置く */}
    </div>
  )
}

const PageElement = styled.div`
  
`

interface ViewerPageProps {
  image_url: string
}
const ViewerPage: React.FC<ViewerPageProps> = ({ image_url }) => {
  return (
    <div
      css={(theme) => css`
        height: 100%;
        width: 100%;
        background-color: ${theme.background.primary}; // ここの型エラーの原因調査する
      `}
    >
      {/* ここはイメージ置くだけ */}
      {/* todo */}
    </div>
  )
}
export default Viewer
