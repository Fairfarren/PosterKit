import type { CardData } from 'poster-kit'
import { useEffect, useState } from 'react'

const imageAssets = [
  'https://material-center.meitudata.com/material/image/62fa22ac354485399.png',
  'https://material-center.meitudata.com/material/image/62fa22ac354485399.png',
  'https://material-center.meitudata.com/material/image/62fa22ac354485399.png',
  'https://material-center.meitudata.com/material/image/62fa22ac354485399.png',
  'https://material-center.meitudata.com/material/image/62fa22ac354485399.png',
]

function ImageList(props: { onAdd: (data: CardData) => void }) {
  const [list, setList] = useState<CardData[]>([])
  const [loading, setLoading] = useState(true)

  async function init() {
    setLoading(true)
    const arr: typeof list = []
    for (const imageAsset of imageAssets) {
      const image = new Image()
      image.src = imageAsset
      image.crossOrigin = 'anonymous'
      await new Promise((resolve, reject) => {
        image.onload = () => {
          arr.push({
            id: Math.random().toString(36),
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
    setLoading(false)
  }

  useEffect(() => {
    init()
  }, [])

  if (loading) {
    return (
      <div className="image-list">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="image-item loading-placeholder">
            <div className="skeleton-image" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="image-list">
      {list.map((item, index) => (
        <div key={index} className="image-item">
          <img
            src={item.type === 'image' ? item.image.src : ''}
            alt={`Image ${index + 1}`}
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
