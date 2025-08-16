import type { CardData } from 'designkit'
import { useEffect, useState } from 'react'

const imageAssets = [
  'https://material-center.meitudata.com/material/image/62fa22ac354485399.png',
]

function ImageList(props: { onAdd: (data: CardData) => void }) {
  const [list, setList] = useState<CardData[]>([])

  async function init() {
    const arr: typeof list = []
    for (const imageAsset of imageAssets) {
      const image = new Image()
      image.src = imageAsset
      image.crossOrigin = 'anonymous'
      await new Promise((resolve, reject) => {
        image.onload = () => {
          arr.push({
            id: '',
            image,
            width: image.width,
            height: image.height,
            x: 0,
            y: 0,
            type: 'image',
          })
          resolve(null)
        }
        image.onerror = (err) => {
          console.error('Image load error:', err)
          reject(err)
        }
      })
    }
    setList(arr)
  }

  useEffect(() => {
    init()
  }, [])

  return (
    <div className="image-list">
      {list.map((item, index) => (
        <div key={index}>
          <img
            src={item.type === 'image' ? item.image.src : ''}
            alt=""
            onClick={() =>
              props.onAdd({
                ...item,
                id: Math.random().toString(36),
              })
            }
          />
        </div>
      ))}
    </div>
  )
}

export default ImageList
