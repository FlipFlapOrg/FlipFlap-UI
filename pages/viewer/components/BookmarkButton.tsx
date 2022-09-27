import Image from 'next/image'
import FloatButton from './FloatButton'

interface BookmarkButtonProps {
  isBookmark: boolean
  onClick: () => void
}

const BookmarkButton = ({ isBookmark, onClick }: BookmarkButtonProps) => {
  return (
    <FloatButton size={48} onClick={onClick}>
      <Image
        src={isBookmark ? '/icons/bookmark-fill.svg' : '/icons/bookmark.svg'}
        width={40}
        height={40}
        alt=''
      />
    </FloatButton>
  )
}

export default BookmarkButton
