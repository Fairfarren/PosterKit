import './App.css'
import { KitBox } from 'designkit/dist/react/components.ts'
import type { CardData } from 'designkit'
import { useRef, type ComponentRef, useState } from 'react'
import ImageList from './components/ImageList.tsx'

const App = () => {
  const kitBoxRef = useRef<ComponentRef<typeof KitBox> | null>(null)
  const [currentData, setCurrentData] = useState<CardData | undefined>(
    undefined,
  )
  const [url, setUrl] = useState<string>('')

  function addImage(data: CardData) {
    kitBoxRef.current?.add(data)
  }

  function currentDataChange(data: CardData) {
    setCurrentData(data)
  }

  function addText() {
    kitBoxRef.current?.add({
      id: Math.random().toString(36),
      width: 1080,
      height: 500,
      x: 0,
      y: 0,
      text: '你好世界你好世界1234567890🤔abcdefghijklmnopqrstuvwxyz',
      type: 'text',
      fontSize: 32,
      fontFamily: 'cursive',
      color: '#db3f9178',
      fontWeight: 'bold',
      fontStyle: 'italic',
      decoration: 'line-through',
    })
  }

  function updateData(data: CardData) {
    kitBoxRef.current?.updateCurrentData(data)
  }

  function createPoster() {
    kitBoxRef.current
      ?.createPoster()
      .then((canvas) => {
        const url = canvas.toDataURL('image/png')
        setUrl(url)
      })
      .catch((err) => {
        console.error('Error creating poster:', err)
      })
  }

  return (
    <div className="content">
      <div className="box">
        <KitBox
          ref={kitBoxRef}
          width={1080}
          height={1920}
          onCurrentDataChange={(e) => currentDataChange(e.detail)}
        />
      </div>
      <div>
        <ImageList onAdd={addImage} />
      </div>
      <div>
        <button onClick={addText}>添加文字</button>
      </div>
      <div>
        <button onClick={createPoster}>生成海报</button>
      </div>
      {currentData?.id && (
        <div>
          {Object.entries(currentData).map(([key, value]) => (
            <div key={key}>
              {key}:{' '}
              <input
                type="text"
                value={value}
                disabled={['id', 'type', 'image'].includes(key)}
                onChange={(e) => {
                  updateData({
                    ...currentData,
                    [key]: e.target.value,
                  })
                }}
              />
            </div>
          ))}
        </div>
      )}
      <div>
        <img
          style={{
            width: '500px',
            height: '500px',
            objectFit: 'contain',
          }}
          src={url}
          alt=""
        />
      </div>
    </div>
  )
}

export default App
