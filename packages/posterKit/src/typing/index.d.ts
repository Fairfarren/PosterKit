export type CardType = 'image' | 'text'

interface BaseOptions {
  id: string
  width: number
  height: number
  x: number
  y: number
}

export type CardData =
  | (BaseOptions & {
      type: 'image'
      image: HTMLImageElement
    })
  | (BaseOptions & {
      type: 'text'
      text: string
      fontSize: number
      fontFamily: string
      color: string
      fontWeight: string
      fontStyle: 'normal' | 'italic'
      decoration: 'none' | 'underline' | 'line-through'
    })
