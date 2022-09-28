import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const SharePage: NextPage = () => {
  const [url, setUrl] = useState('')
  const router = useRouter()
  const { id } = router.query
  useEffect(() => {
    setUrl(`${window.location.origin}/viewer?id=${id}`)
  }, [id])

  return (
    <ShareContainer>
      <h1>URLを共有</h1>
      <input
        type='text'
        value={url}
        readOnly
        css={css`
          max-width: 300px;
          width: 100%;
        `}
      />
    </ShareContainer>
  )
}

const ShareContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`
export default SharePage
