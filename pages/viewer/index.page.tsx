import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { NextPage } from 'next'
import Image from 'next/image'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import BookmarkButton from './components/BookmarkButton'
import FavoriteButton from './components/FavoriteButton'
import ShareButton from './components/ShareButton'
import { SkeltonCircle } from './components/Skeletons'
import { Client, useClient } from 'api'
import { Shop } from 'api/parser/manga'
import { Toggle } from 'components/Toggle'
import { MangaState, useManga } from 'lib/mangaData'
import { serviceIcon } from 'lib/serviceIcon'
import { useUserData } from 'lib/userData'
import FavoriteAnim, { useFavoriteAnim } from 'components/FavoriteAnim'

export const hideScrollBar = css`
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`

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
    mutate: { initialize, readNext, readPrev, seek },
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

  const reachPageHandler = useCallback(
    (idx: number, page: number) => {
      if (currentMangaIndex === undefined) {
        return
      }

      if (idx !== currentMangaIndex) {
        return
      }
      seek(page)
    },
    [currentMangaIndex, seek]
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
    <PageContainer>
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
                user_id={user_id}
                reachHandler={reachHandler}
                reachPageHandler={reachPageHandler}
                currentPage={mangaEle.pageIndex}
              />
            </div>
          )
        })}
      </PageContainerY>
    </PageContainer>
  )
}

const PageContainer = styled.div`
  margin: 0 auto;
  max-width: 640px;
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
`

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
  ${hideScrollBar}
`

const PageContainerX = styled.div`
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
  ${hideScrollBar}
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
  user_id: string
  reachHandler: (_idx: number) => void
  reachPageHandler: (_idx: number, _page: number) => void
  currentPage: number
}
const ViewerPageRow: React.FC<ViewerPageRowProps> = ({
  manga,
  idx,
  user_id,
  reachHandler,
  reachPageHandler,
  currentPage,
}) => {
  const client = useClient()
  const {
    mutate: { addBookmark, removeBookmark, favorite, unfavorite },
  } = useManga()

  const onBookmark = useCallback(
    (to: boolean) => {
      if (to) {
        addBookmark(user_id, manga.id)
      } else {
        removeBookmark(user_id, manga.id)
      }
    },
    [addBookmark, manga.id, removeBookmark, user_id]
  )

  const ref = useRef<HTMLDivElement>(null)
  const { showFavoriteAnim, ref: favoriteAnimRef } = useFavoriteAnim()

  const pagesRef = useRef<Array<React.RefObject<HTMLDivElement>>>([])
  Array.from({ length: manga.page_count }).forEach((_, i) => {
    if (pagesRef.current[i] === undefined) {
      pagesRef.current[i] = React.createRef<HTMLDivElement>()
    }
  })

  const [isHeaderShow, setIsHeaderShow] = useState(false)

  const onClickHandler = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (ref.current === null) {
        return
      }

      const rect = ref.current.getBoundingClientRect()
      const x = e.clientX - rect.left

      if (currentPage === manga.page_count - 1) {
        return
      }

      if (x < rect.width / 3) {
        pagesRef.current[currentPage + 1].current?.scrollIntoView({
          behavior: 'smooth',
        })
        setIsHeaderShow(false)
      } else if (x > (rect.width * 2) / 3) {
        if (currentPage === 0) {
          return
        }
        pagesRef.current[currentPage - 1].current?.scrollIntoView({
          behavior: 'smooth',
        })
        setIsHeaderShow(false)
      } else {
        setIsHeaderShow((prev) => !prev)
      }
    },
    [currentPage, manga.page_count]
  )
  const onDoubleClickHandler = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      e.preventDefault()

      if (manga.is_favorite) {
        unfavorite(user_id, manga.id)
      } else {
        favorite(user_id, manga.id)
        showFavoriteAnim()
      }
    },
    [
      favorite,
      manga.id,
      manga.is_favorite,
      showFavoriteAnim,
      unfavorite,
      user_id,
    ]
  )

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
    <PageElement
      css={css`
        position: relative;
        overflow: hidden;
      `}
    >
      <div
        css={css`
          position: fixed;
          z-index: 2;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          margin: auto;
          pointer-events: none;
          display: grid;
          place-items: center;
        `}
      >
        <FavoriteAnim ref={favoriteAnimRef} />
      </div>
      <ViewerPageHeader
        title={manga.description.title}
        author={manga.description.author}
        onBookmark={onBookmark}
        isBookmarked={manga.is_bookmarked}
        isShow={isHeaderShow}
      />
      <Toggle
        state='viewer'
        cssProp={css`
          position: absolute;
          z-index: 1;
          bottom: 16px;
          right: 0;
          left: 0;
          margin: 0 auto;

          transform: ${isHeaderShow || currentPage === manga.page_count - 1
            ? 'translateY(0px)'
            : 'translateY(calc(101% + 16px))'};
          transition: transform 0.2s ease-out;
        `}
      />
      <PageContainerX
        ref={ref}
        onClick={onClickHandler}
        onDoubleClick={onDoubleClickHandler}
      >
        {Array.from({ length: manga.page_count - 1 }).map((_, i) => {
          return (
            <PageElement key={i} ref={pagesRef.current[i]}>
              <ViewerPage
                image_url={imageUrl(client, manga.id, i)}
                idx={idx}
                page={i}
                reachPageHandler={reachPageHandler}
              />
            </PageElement>
          )
        })}
        <PageElement ref={pagesRef.current[manga.page_count - 1]}>
          <ViewerPageInfo
            cover_image_url={`${manga.base_url}${manga.description.cover_image_url}`}
            links={manga.description.links}
            title={manga.description.title}
            author={manga.description.author}
            idx={idx}
            user_id={user_id}
            page={manga.page_count - 1}
            reachPageHandler={reachPageHandler}
            isBookmark={manga.is_bookmarked}
            isFavorite={manga.is_favorite}
            manga_id={manga.id}
            favorite_count={manga.favorite_count}
          />
        </PageElement>
      </PageContainerX>
    </PageElement>
  )
}

interface ViewerPageHeaderProps {
  title: string
  author: string
  onBookmark: (_to_bookmarked: boolean) => void
  isBookmarked: boolean
  isShow?: boolean
}
const ViewerPageHeader: React.FC<ViewerPageHeaderProps> = ({
  title,
  author,
  onBookmark,
  isBookmarked,
  isShow,
}) => {
  const toggleBookmark = useCallback(() => {
    onBookmark(!isBookmarked)
  }, [isBookmarked, onBookmark])

  return (
    <Header
      css={css`
        transform: translateY(${isShow ? '0' : '-101%'});
        transition: transform 0.2s ease-out;
      `}
    >
      <div>
        <Strong
          css={css`
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          `}
        >
          {title}
        </Strong>
        <div
          css={css`
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            margin-top: 4px;
          `}
        >
          {author}
        </div>
      </div>
      <div>
        <button
          onClick={toggleBookmark}
          css={css`
            border: none;
            background-color: transparent;
            cursor: pointer;
          `}
        >
          <Image
            src={
              isBookmarked ? '/icons/bookmark-fill.svg' : '/icons/bookmark.svg'
            }
            width={40}
            height={40}
            alt=''
          />
        </button>
      </div>
    </Header>
  )
}

const Header = styled.header`
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  background-color: rgba(243, 249, 255, 0.9);
  z-index: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 16px;

  transform: translateY(-101%);
`

interface ViewerPageProps {
  image_url: string
  idx: number
  page: number
  reachPageHandler: (_idx: number, _page: number) => void
}
const ViewerPage: React.FC<ViewerPageProps> = ({
  image_url,
  idx,
  page,
  reachPageHandler,
}) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            reachPageHandler(idx, page)
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
  }, [idx, page, reachPageHandler])

  return (
    <PageElement
      css={(theme) => css`
        background-color: ${theme.background.primary};
        position: relative;
      `}
      ref={ref}
    >
      <Image
        src={image_url}
        alt=''
        layout='fill'
        objectFit='contain'
        draggable={false}
        priority={true}
        quality={30}
      />
    </PageElement>
  )
}

interface ViewerPageInfoProps {
  cover_image_url: string
  links: Shop[]
  title: string
  author: string
  idx: number
  page: number
  isBookmark: boolean
  isFavorite: boolean
  manga_id: string
  user_id: string
  favorite_count: number
  reachPageHandler: (_idx: number, _page: number) => void
}
export const ViewerPageInfo: React.FC<ViewerPageInfoProps> = ({
  cover_image_url,
  links,
  title,
  author,
  idx,
  page,
  isBookmark,
  isFavorite,
  favorite_count,
  user_id,
  manga_id,
  reachPageHandler,
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const { mutate } = useManga()

  const bookmarkHandler = useCallback(() => {
    if (isBookmark === true) {
      mutate.removeBookmark(user_id, manga_id)
    } else {
      mutate.addBookmark(user_id, manga_id)
    }
  }, [isBookmark, manga_id, mutate, user_id])

  const favoriteHandler = useCallback(() => {
    if (isFavorite === true) {
      mutate.unfavorite(user_id, manga_id)
    } else {
      mutate.favorite(user_id, manga_id)
    }
  }, [isFavorite, manga_id, mutate, user_id])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            reachPageHandler(idx, page)
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
  }, [idx, page, reachPageHandler])

  return (
    <PageElement
      css={css`
        display: flex;
        flex-direction: column;
      `}
      ref={ref}
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
          <BookmarkButton isBookmark={isBookmark} onClick={bookmarkHandler} />
          <FavoriteButton
            isFavorite={isFavorite}
            onClick={favoriteHandler}
            count={favorite_count}
          />
          <ShareButton url={`/share?id=${manga_id}`} />
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
  const icon = serviceIcon(name)
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
        <Image
          src={icon}
          css={css`
            border-radius: 50%;
          `}
          width={48}
          height={48}
          alt='logo'
          objectFit='contain'
          quality={100}
        />
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
