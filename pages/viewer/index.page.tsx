import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { NextPage } from 'next'
import Image from 'next/image'
import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import { SkeltonCircle } from './components/Skeletons'
import { Client, useClient } from 'api'
import { Shop } from 'api/parser/manga'
import { MangaState, useManga } from 'lib/mangaData'
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
    mutate: { initialize, readNext, readPrev },
  } = useManga()
  const { data: userData, error: userError } = useUserData()

  const user_id = useMemo(() => {
    return userData?.id ?? 'unknown'
  }, [userData?.id])

  useEffect(() => {
    initialize(user_id)
  }, [initialize, user_id])

  const reachHandler = useCallback(
    (idx: number) => {
      if (currentMangaIndex === undefined) {
        return
      }

      console.log('reachHandler', idx, currentMangaIndex)

      if (idx === currentMangaIndex) {
        return
      }
      if (idx > currentMangaIndex) {
        for (let i = currentMangaIndex + 1; i <= idx; i++) {
          readNext(user_id)
        }
      } else {
        for (let i = currentMangaIndex - 1; i >= idx; i--) {
          readPrev()
        }
      }
    },
    [currentMangaIndex, readNext, readPrev, user_id]
  )

  if (error || userError) {
    return <div>Failed to load</div>
  }

  if (
    manga === undefined ||
    currentMangaIndex === undefined ||
    userData === undefined
  ) {
    return <SkeltonCircle size={300} />
  }

  return (
    <PageContainerY>
      {manga.map((mangaEle, i) => {
        return (
          <div
            key={i}
            css={css`
              scroll-snap-align: start;
              scroll-snap-stop: always;
            `}
          >
            <ViewerPageRow
              manga={mangaEle}
              idx={i}
              reachHandler={reachHandler}
            />
          </div>
        )
      })}
    </PageContainerY>
  )
}

const PageContainerY = styled.div`
  margin: 0 auto;
  max-width: 640px;
  width: 100%;
  height: 100vh;
  position: relative;
  overflow-x: hidden;
  overflow-y: scroll;
  scroll-snap-type: y mandatory;
  display: flex;
  flex-direction: column;
`

const PageContainer = styled.div`
  margin: 0 auto;
  max-width: 640px;
  width: 100%;
  height: 100vh;
  position: relative;
  overflow-x: scroll;
  overflow-y: hidden;
  scroll-snap-type: x mandatory;
  display: flex;
  flex-direction: row-reverse;
`

const PageElement = styled.div`
  width: 100%;
  height: 100%;
  scroll-snap-stop: always;
  scroll-snap-align: start;
  flex-shrink: 0;
  flex-basis: 100%;
`

interface ViewerPageRowProps {
  manga: MangaState
  idx: number
  reachHandler: (_idx: number) => void
}
const ViewerPageRow: React.FC<ViewerPageRowProps> = ({
  manga,
  idx,
  reachHandler,
}) => {
  const client = useClient()

  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            reachHandler(idx)
          }
        })
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.5,
      }
    )

    if (ref.current === null) {
      return
    }

    observer.observe(ref.current)

    return () => {
      observer.disconnect()
    }
  }, [idx, reachHandler])

  return (
    <PageContainer ref={ref}>
      {Array.from({ length: manga.page_count - 1 }).map((_, i) => {
        return <ViewerPage key={i} image_url={imageUrl(client, manga.id, i)} />
      })}
      <ViewerPageInfo
        cover_image_url={`${manga.base_url}${manga.description.cover_image_url}`}
        links={manga.description.links}
        title={manga.description.title}
        author={manga.description.author}
      />
    </PageContainer>
  )
}

interface ViewerPageProps {
  image_url: string
}
const ViewerPage: React.FC<ViewerPageProps> = ({ image_url }) => {
  return (
    <PageElement
      css={(theme) => css`
        background-color: ${theme.background.primary};
        position: relative;
      `}
    >
      <Image
        src={image_url}
        alt=''
        layout='fill'
        objectFit='contain'
        draggable={false}
      />
    </PageElement>
  )
}

interface ViewerPageInfoProps {
  cover_image_url: string
  links: Shop[]
  title: string
  author: string
}
export const ViewerPageInfo: React.FC<ViewerPageInfoProps> = ({
  cover_image_url,
  links,
  title,
  author,
}) => {
  return (
    <PageElement
      css={css`
        display: flex;
        flex-direction: column;
      `}
    >
      <div
        css={(theme) => css`
          background-color: ${theme.background.tertiary};
          padding: 20px 16px 16px 16px;
        `}
      >
        <div>
          <Strong>{title}</Strong>
          <div
            css={(theme) => css`
              color: ${theme.text.primary};
              font-size: 12px;
              margin-top: 2px;
            `}
          >
            {author}
          </div>
        </div>
        <div
          css={css`
            position: relative;
            height: 180px;
            margin-top: 24px;
          `}
        >
          <Image
            src={cover_image_url}
            alt=''
            layout='fill'
            objectFit='contain'
            draggable={false}
          />
        </div>
        <div
          css={css`
            display: flex;
            flex-direction: row;
            column-gap: 16px;
            align-items: center;
            justify-content: center;
            margin-top: 12px;
          `}
        >
          <SkeltonCircle size={48} />
          <SkeltonCircle size={60} />
          <SkeltonCircle size={48} />
        </div>
      </div>
      <div
        css={css`
          padding: 16px 0 0 0;
        `}
      >
        <Strong
          css={css`
            text-align: center;
          `}
        >
          続きはコチラ
        </Strong>
        <div
          css={css`
            margin-top: 12px;
          `}
        >
          {links.map((link, idx) => {
            return (
              <React.Fragment key={link.service_name}>
                {idx !== 0 && <Divider />}
                <LinksCard name={link.service_name} url={link.url} />
              </React.Fragment>
            )
          })}
        </div>
      </div>
    </PageElement>
  )
}
const Divider = styled.div`
  margin-left: 62px;
  margin-right: 16px;
  height: 1px;
  background-color: #d7d7e3;
  border-radius: 1px;
`
const Strong = styled.div`
  color: ${(props) => props.theme.text.primary};
  font-weight: bold;
  font-size: 18px;
`

interface LinksCardProps {
  name: string
  url: string
}
export const LinksCard: React.FC<LinksCardProps> = ({ name, url }) => {
  return (
    <a
      href={url}
      target='_blank'
      rel='noopener noreferrer'
      css={(theme) => css`
        padding: 8px 28px 8px 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: ${theme.background.primary};
        &:hover,
        &:active {
          background-color: ${theme.background.primary_hover};
        }
      `}
    >
      <div
        css={css`
          display: flex;
          align-items: center;
        `}
      >
        <SkeltonCircle size={36} />
        <span
          css={(theme) => css`
            margin-left: 16px;
            font-size: 16px;
            color: ${theme.text.primary};
          `}
        >
          {name}
        </span>
      </div>
      <Image src='/icons/external-link.svg' alt='共有' width={24} height={24} />
    </a>
  )
}

export default Viewer
