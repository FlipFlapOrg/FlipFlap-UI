import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { NextPage } from 'next'
import Image from 'next/image'
import { memo } from 'react'
import useSWR from 'swr'
import { useClient } from 'api'
import ShopList from 'components/view/shopList'
import ViewerHeader from 'components/view/viewerHeader'
import { getRecommendedManga, Shop } from 'lib/mangaData'

const LastPage: NextPage = () => {
  const client = useClient()

  const { data, error } = useSWR('state:lastPage', async (_) => {
    return getRecommendedManga(client, 'tesso')
  })

  if (!error && !data) return <div>Loading</div>
  const shops: Shop[] = data!.description.links.map((link) => ({
    name: 'ジャンプ',
    url: link,
  }))
  return (
    <Container>
      <ViewerHeader
        title={data!.description.title ?? ''}
        authorName={data!.description.author ?? ''}
      />
      <Image
        src={data!.description.cover_image_url}
        width={144}
        height={205}
        alt={data?.description.title}
        objectFit='contain'
      />
      <H2>続きを読む</H2>
      <ShopList shops={shops} />
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const H2 = styled.h2`
  font-size: 1.125rem;
  text-align: center;
`

export default memo(LastPage)
