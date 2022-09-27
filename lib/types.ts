import { css } from '@emotion/react'

export type PropsWithCss<T> = T & { cssProp?: ReturnType<typeof css> }
