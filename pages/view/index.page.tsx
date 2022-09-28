import styled from '@emotion/styled'
import { NextPage } from 'next'
import Image from 'next/image'
import { useCallback, useMemo } from 'react'
import { useArtData } from 'lib/artData'

const View: NextPage = () => {
  const { data, error } = useArtData()

  const manga = useMemo(() => {
    return data?.manga[data.currentMangaIndex]
  }, [data])

  if (error) return <ErrorCard>Failed to load</ErrorCard>
  if (!data) return <div>Loading...</div>

  return (
    <div>
      {manga!.urls.map((url, idx) => {
        return (
          <Page key={idx}>
            <Image src={url} alt={`page ${idx}`} width={1024} height={1456} />
          </Page>
        )
      })}

      {manga!.comments.map((comment) => {
        return (
          <CommentCard
            key={comment.id}
            manga_id={manga!.id}
            comment_id={comment.id}
          />
        )
      })}
    </div>
  )
}

const ErrorCard = styled.div`
  display: grid;
  place-items: center;
  text-align: center;
  padding: 32px;
  background-color: #f56c6c;
  color: #fff;
  border-radius: 8px;
`

const Page = styled.div`
  max-width: 375px;
`

interface CommentCardProps {
  manga_id: string
  comment_id: string
}
const CommentCard: React.FC<CommentCardProps> = ({ manga_id, comment_id }) => {
  const { data, mutate } = useArtData()

  const toggleFavorite = useCallback(() => {
    console.log({ manga_id, comment_id })
    mutate.toggleCommentFavorite(manga_id, comment_id)
  }, [comment_id, manga_id, mutate])

  const comment = useMemo(() => {
    return data?.manga
      .find((manga) => manga.id === manga_id)
      ?.comments.find((comment) => comment.id === comment_id)
  }, [comment_id, data, manga_id])

  if (comment === undefined) return <></>

  return (
    <CommentContainer>
      <CommentAuthor>{comment.author_name}</CommentAuthor>
      <CommentContent>{comment.content}</CommentContent>
      <button onClick={toggleFavorite}>
        {comment.is_favorite ? 'Unfavorite' : 'Favorite'} (
        {comment.favorite_count})
      </button>
    </CommentContainer>
  )
}

const CommentContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  row-gap: 8px;
`
const CommentAuthor = styled.div`
  font-weight: bold;
  color: #606266;
  font-size: 16px;
`

const CommentContent = styled.div`
  font-size: 12px;
  color: #303133;
`

export default View
