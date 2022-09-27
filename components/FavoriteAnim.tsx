import styled from '@emotion/styled'
import {
  useCallback,
  useState,
  useRef,
  useImperativeHandle,
  forwardRef,
  ForwardRefRenderFunction,
  useEffect,
  createRef,
  RefObject,
} from 'react'

interface Handler {
  showFavoriteAnim: () => void
}

export const useFavoriteAnim = () => {
  const ref = useRef<Handler>(null)
  const showFavoriteAnim = useCallback(() => {
    ref.current?.showFavoriteAnim()
  }, [ref])

  return {
    showFavoriteAnim,
    ref,
  }
}

const heartTumbling: Keyframe[] = [
  { transform: 'scale(0.2)', opacity: 0 },
  { transform: 'scale(0.2)', opacity: 0, offset: 0.1 },
  { transform: 'scale(1.2)', opacity: 1, offset: 0.2 },
  { transform: 'scale(1.0)', opacity: 1, offset: 0.5 },
  { opacity: 1, offset: 0.9 },
  { opacity: 0 },
]

const animationTiming: KeyframeAnimationOptions = {
  duration: 900,
  iterations: 1,
  fill: 'forwards',
}

const particleColors = [
  '#4E711F',
  '#FBE88E',
  '#5CA4F8',
  '#F8D74E',
  '#EC5C4E',
  '#9051F6',
]

const FavoriteAnim: ForwardRefRenderFunction<Handler, {}> = (_, ref) => {
  const [showable, setShowable] = useState(false)
  const heartRef = useRef<HTMLDivElement>(null)
  const [heartAnimation, setHeartAnimation] = useState<Animation | null>(null)
  const [dotsAnimation, setDotsAnimation] = useState<
    (Animation | undefined)[] | null
  >(null)

  const dots = useRef<RefObject<HTMLDivElement>[]>([])
  const DOT_COUNT = 10
  const datas = []
  for (let i = 0; i < DOT_COUNT; i++) {
    dots.current[i] = createRef<HTMLDivElement>()
    datas.push(i)
  }

  const showFavoriteAnim = useCallback(() => {
    setShowable(true)
    heartAnimation?.finish()
    dotsAnimation?.forEach((animation) => animation?.finish())
    heartAnimation?.play()
    dotsAnimation?.forEach((animation) => animation?.play())
  }, [heartAnimation, dotsAnimation])

  useEffect(() => {
    // heart animation
    if (heartRef.current) {
      setHeartAnimation(
        heartRef.current.animate(heartTumbling, animationTiming)
      )
    }
    // change particle color
    dots.current.forEach((dotRef) => {
      if (dotRef.current) {
        dotRef.current.style.backgroundColor =
          particleColors[Math.floor(Math.random() * particleColors.length)]
      }
    })

    // particle animation
    const animation = dots.current.map((dot, index) => {
      const angle: number = (360 / DOT_COUNT) * index
      const dist = Math.random() > 0.5 ? 60 + Math.random() * 20 : 70
      const len = Math.random() > 0.5 ? 2 + Math.random() * 4 : 0.5
      const angleDiff = 10 - Math.random() * 20
      return dot.current?.animate(
        [
          {
            transform: `rotate(${angle}deg) translateX(0px) scaleX(1)`,
            opacity: 0,
          },
          {
            opacity: 0.7,
            transform: `rotate(${angle + angleDiff * 0.2}deg) translateX(${
              dist * 0.8
            }px) scale(1) scaleX(${len})`,
            offset: 0.2,
          },
          {
            transform: `rotate(${
              angle + angleDiff * 0.4
            }deg) translateX(${dist}px) scale(1) scaleX(1)`,
            opacity: 0.7,
            offset: 0.3,
          },
          {
            transform: `rotate(${
              angle + angleDiff
            }deg) translateX(${dist}px) scale(0.1)`,
            opacity: 0.7,
            offset: 0.7,
          },
          {
            transform: `rotate(${
              angle + angleDiff
            }deg) translateX(${dist}px) scale(0)`,
            opacity: 0,
          },
        ],
        animationTiming
      )
    })
    setDotsAnimation(animation)
  }, [heartRef, dots])

  useImperativeHandle(
    ref,
    () => ({
      showFavoriteAnim,
    }),
    [showFavoriteAnim]
  )

  return (
    <HeartContainer visible={showable}>
      <DotContainer>
        {datas.map((val) => (
          <Dot ref={dots.current[val]} key={val}></Dot>
        ))}
      </DotContainer>
      <Heart ref={heartRef}></Heart>
    </HeartContainer>
  )
}

const DotContainer = styled.div`
  top: 0px;
  left: 0px;
  position: absolute;
  display: flex;
  width: 100px;
  height: 100px;
`

const Dot = styled.div`
  position: absolute;
  top: 40%;
  left: 50%;
  background-color: yellow;
  width: 8px;
  height: 8px;
  border-radius: 50%;
`

const HeartContainer = styled.div<{ visible: boolean }>`
  position: relative;
  display: ${({ visible }) => (visible === true ? 'div' : 'none')};
`

const Heart = styled.div`
  width: 100px;
  height: 100px;
  position: relative;
  &::before,
  &::after {
    content: '';
    width: 50%;
    height: 80%;
    background: #e84444;
    border-radius: 25px 25px 0 0;
    display: block;
    position: absolute;
  }
  &::before {
    transform: rotate(-45deg);
    left: 14%;
  }
  &::after {
    transform: rotate(45deg);
    right: 14%;
  }
`

export default forwardRef(FavoriteAnim)
