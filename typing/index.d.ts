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
      type: Extract<CardType, 'image'>
      image: HTMLImageElement
    })
  | (BaseOptions & {
      type: Extract<CardType, 'text'>
      text: string
      fontSize: number
      fontFamily: string
      color: string
      fontWeight: string
    })
