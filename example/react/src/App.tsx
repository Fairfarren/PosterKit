import './App.css'
import { KitBox } from 'poster-kit/dist/react/components.ts'
import type { CardData } from 'poster-kit'
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
    <div className="app-container">
      <div className="content">
        <div className="main-section">
          <div className="canvas-container">
            <h2 className="canvas-title">海报设计画布</h2>
            <div className="box">
              <KitBox
                ref={kitBoxRef}
                width={1080}
                height={1920}
                onCurrentDataChange={(e) => currentDataChange(e.detail)}
              />
            </div>
          </div>
          
          <div className="controls-section">
            <h3 className="controls-title">设计工具</h3>
            <ImageList onAdd={addImage} />
            <div className="button-group">
              <button className="btn btn-primary" onClick={addText}>
                添加文字
              </button>
              <button className="btn btn-secondary" onClick={createPoster}>
                生成海报
              </button>
            </div>
          </div>
          
          {url && (
            <div className="result-section">
              <h3 className="result-title">生成结果</h3>
              <img
                className="result-image"
                src={url}
                alt="Generated poster"
              />
            </div>
          )}
        </div>
        
        {currentData?.id && (
          <div className="sidebar">
            <h3 className="sidebar-title">属性编辑器</h3>
            {Object.entries(currentData).map(([key, value]) => {
              const isDisabled = ['id', 'type', 'image'].includes(key)
              const isColorField = key === 'color'
              const isNumberField = ['x', 'y', 'width', 'height', 'fontSize'].includes(key)
              const isSelectField = key === 'fontWeight'
              
              return (
                <div key={key} className="property-group">
                  <label className="property-label">{key}</label>
                  {isColorField && !isDisabled ? (
                    <div className="color-input-wrapper">
                      <input
                        type="color"
                        className="color-input"
                        value={String(value).startsWith('#') ? String(value) : '#000000'}
                        onChange={(e) => {
                          updateData({
                            ...currentData,
                            [key]: e.target.value,
                          })
                        }}
                      />
                      <input
                        type="text"
                        className="property-input color-text-input"
                        value={value}
                        onChange={(e) => {
                          updateData({
                            ...currentData,
                            [key]: e.target.value,
                          })
                        }}
                      />
                    </div>
                  ) : isNumberField && !isDisabled ? (
                    <input
                      type="number"
                      className="property-input"
                      value={Number(value) || 0}
                      onChange={(e) => {
                        updateData({
                          ...currentData,
                          [key]: Number(e.target.value),
                        })
                      }}
                    />
                  ) : isSelectField && !isDisabled ? (
                    <select
                      className="property-input property-select"
                      value={String(value)}
                      onChange={(e) => {
                        updateData({
                          ...currentData,
                          [key]: e.target.value,
                        })
                      }}
                    >
                      <option value="normal">Normal</option>
                      <option value="bold">Bold</option>
                      <option value="lighter">Lighter</option>
                      <option value="100">100</option>
                      <option value="200">200</option>
                      <option value="300">300</option>
                      <option value="400">400</option>
                      <option value="500">500</option>
                      <option value="600">600</option>
                      <option value="700">700</option>
                      <option value="800">800</option>
                      <option value="900">900</option>
                    </select>
                  ) : (
                    <input
                      type="text"
                      className="property-input"
                      value={value}
                      disabled={isDisabled}
                      onChange={(e) => {
                        updateData({
                          ...currentData,
                          [key]: e.target.value,
                        })
                      }}
                    />
                  )}
                </div>
              )
            })}
          </div>
        )}
        
        {!currentData?.id && (
          <div className="sidebar">
            <h3 className="sidebar-title">属性编辑器</h3>
            <div className="empty-state">
              请选择一个元素来编辑属性
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
