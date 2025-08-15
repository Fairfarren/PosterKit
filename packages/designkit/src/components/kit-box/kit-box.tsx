import {
  Component,
  Prop,
  h,
  Method,
  State,
  EventEmitter,
  Watch,
  Event,
} from '@stencil/core'
import { CardData } from '@/typing/index.d'

@Component({
  tag: 'kit-box',
  styleUrl: 'kit-box.css',
})
export class MyComponent {
  // 用于存储 designkit div 的引用
  private designkitRef?: HTMLDivElement
  private cardRefs: HTMLKitCardElement[] = []

  @State() private zoom = 1
  @State() private previewWidth = 0
  @State() private previewHeight = 0

  @Prop() width: number
  @Prop() height: number

  // React 侧沿用 camelCase 名称
  @Event() currentDataChange: EventEmitter<CardData>
  // Vue 侧使用 kebab-case 名称
  @Event({ eventName: 'current-data-change', bubbles: true, composed: true })
  currentDataChangeKebab: EventEmitter<CardData>
  dataOnChange(data: CardData) {
    // 同时派发两个事件，保证向后兼容
    this.currentDataChange.emit(data)
    this.currentDataChangeKebab.emit(data)
  }

  @State() domList: CardData[] = []
  @State() moveData: CardData = {
    id: '',
    width: 0,
    height: 0,
    x: 0,
    y: 0,
    image: null,
    type: 'image',
  }

  @Watch('moveData')
  watch_moveData(newData: CardData) {
    this.dataOnChange({
      ...newData,
      width: newData.width / this.zoom,
      height: newData.height / this.zoom,
      x: newData.x / this.zoom,
      y: newData.y / this.zoom,
    })
  }

  @Watch('zoom')
  watch_zoom(newZoom: number, oldZoom: number) {
    this.updateDomListZoom(newZoom, oldZoom)
  }

  private updateDomListZoom(zoom: number, oldZoom: number) {
    this.domList = this.domList.map((item) => {
      return {
        ...item,
        width: (item.width / oldZoom) * zoom,
        height: (item.height / oldZoom) * zoom,
        x: (item.x / oldZoom) * zoom,
        y: (item.y / oldZoom) * zoom,
      }
    })
    this.moveData = {
      ...this.moveData,
      width: (this.moveData.width / oldZoom) * zoom,
      height: (this.moveData.height / oldZoom) * zoom,
      x: (this.moveData.x / oldZoom) * zoom,
      y: (this.moveData.y / oldZoom) * zoom,
    }
  }

  @Method()
  public async init(list: CardData[] = []) {
    this.domList = list.map((item) => {
      return {
        ...item,
        width: item.width * this.zoom,
        height: item.height * this.zoom,
        x: item.x * this.zoom,
        y: item.y * this.zoom,
      }
    })
    if (this.moveData.id) {
      this.domList.find((item) => {
        if (item.id === this.moveData.id) {
          this.moveData = {
            ...item,
          }
          return true
        }
      })
    }
  }

  @Method()
  public async add(data: CardData) {
    this.domList = [
      ...this.domList,
      {
        ...data,
        width: data.width * this.zoom,
        height: data.height * this.zoom,
        x: data.x * this.zoom,
        y: data.y * this.zoom,
      },
    ]
  }

  @Method()
  public async getDomList() {
    return this.domList
  }

  @Method()
  public async updateCurrentData(data: CardData) {
    data.width = data.width * this.zoom
    data.height = data.height * this.zoom
    data.x = data.x * this.zoom
    data.y = data.y * this.zoom
    this.domList = this.domList.map((item) => {
      if (item.id === data.id) {
        item = {
          ...item,
          ...data,
        }
      }
      return item
    })
    this.moveData = {
      ...data,
    }
  }

  @Method()
  public async createPoster() {
    const canvas = document.createElement('canvas')
    canvas.width = this.width
    canvas.height = this.height
    const ctx = canvas.getContext('2d')

    for (const [index, _item] of this.domList.entries()) {
      const item = {
        ..._item,
        width: _item.width / this.zoom,
        height: _item.height / this.zoom,
        x: _item.x / this.zoom,
        y: _item.y / this.zoom,
      }

      if (item.type === 'image') {
        ctx.drawImage(item.image, item.x, item.y, item.width, item.height)
      } else if (item.type === 'text') {
        const cardRef = this.cardRefs[index]
        if (cardRef) {
          const svgElement = cardRef.querySelector('svg')
          if (svgElement) {
            const svgDataUrl =
              'data:image/svg+xml;charset=UTF-8,' +
              encodeURIComponent(svgElement.outerHTML)

            await new Promise<void>((resolve) => {
              const img = new Image()
              img.crossOrigin = 'anonymous'
              img.onload = () => {
                ctx.drawImage(img, item.x, item.y, item.width, item.height)
                resolve()
              }
              img.onerror = () => {
                console.error('Failed to load SVG image')
                resolve()
              }
              img.src = svgDataUrl
            })
          }
        }
      }
    }

    return canvas
  }

  // 计算预览区域的尺寸和缩放比例
  private calculatePreviewSize() {
    if (!this.designkitRef) {
      return
    }

    const containerRect = this.designkitRef.getBoundingClientRect()
    const containerWidth = containerRect.width
    const containerHeight = containerRect.height

    // 计算基于宽度和高度的缩放比例
    const scaleX = containerWidth / this.width
    const scaleY = containerHeight / this.height

    // 取较小的缩放比例，确保内容完��显示在容器内
    this.zoom = Math.min(scaleX, scaleY, 1) // 最大不超过 1（100%）

    // 计算预览区域的实际尺寸
    this.previewWidth = this.width * this.zoom
    this.previewHeight = this.height * this.zoom
  }

  // 用于存储事件监听器引用
  private resizeHandler = () => {
    this.calculatePreviewSize()
  }

  componentDidLoad() {
    // 使用 requestAnimationFrame 延迟状态更新，避免在同一渲染周期内重新渲染
    requestAnimationFrame(() => {
      this.calculatePreviewSize()
    })

    // 监听窗口大小变化
    window.addEventListener('resize', this.resizeHandler)
  }

  disconnectedCallback() {
    window.removeEventListener('resize', this.resizeHandler)
  }

  // 处理卡片点击的调函数
  private handleCardClick = (cardData: CardData) => {
    this.moveData = {
      ...cardData,
    }
  }

  private onDataChanged(data) {
    this.domList = this.domList.map((item) => {
      if (item.id === data.id) {
        item = {
          ...data,
        }
      }
      return item
    })
    this.moveData = {
      ...data,
    }
  }

  private clearMoveData = (e?) => {
    e?.stopPropagation()
    this.onDataChanged({})
  }

  private moveLayer = (cardData: CardData, direction: 'up' | 'down') => {
    const index = this.domList.findIndex((item) => item.id === cardData.id)
    let targetIndex: number

    if (direction === 'up') {
      // 上移一层与后一个元素交换位置
      targetIndex = index + 1
      if (targetIndex >= this.domList.length) {
        return
      } // 已经在最上层
    } else {
      // 下移一层：与前一个元素交换位置
      targetIndex = index - 1
      if (targetIndex < 0) {
        return
      } // 已经在最下层
    }

    const newList = [...this.domList]
    const temp = newList[targetIndex]
    newList[targetIndex] = newList[index]
    newList[index] = temp
    this.domList = newList
  }

  private toUp = (e: CardData) => {
    this.moveLayer(e, 'up')
  }

  private toDown = (e: CardData) => {
    this.moveLayer(e, 'down')
  }

  private toDelete = (e: CardData) => {
    // 删除当前卡片
    this.domList = this.domList.filter((item) => item.id !== e.id)
    if (this.moveData.id === e.id) {
      this.clearMoveData()
    }
  }

  render() {
    return (
      <div
        class="designkit"
        ref={(el) => (this.designkitRef = el as HTMLDivElement)}
        onClick={this.clearMoveData}
      >
        <div
          class="kit-preview"
          style={{
            width: `${this.previewWidth}px`,
            height: `${this.previewHeight}px`,
          }}
        >
          <div class="kit-list">
            {this.domList.map((item, index) => (
              <kit-card
                ref={(el) => (this.cardRefs[index] = el)}
                key={index}
                data={item}
                zoom={this.zoom}
                onClick={(e) => {
                  e.stopPropagation()
                  this.handleCardClick(item)
                }}
              />
            ))}
          </div>
          {this.moveData.id && (
            <kit-move
              zoom={this.zoom}
              data={this.moveData}
              onDataChanged={(data) =>
                this.onDataChanged.call(this, data.detail)
              }
              onClick={(e) => e.stopPropagation()}
              onToUp={(e) => this.toUp(e.detail)}
              onToDown={(e) => this.toDown(e.detail)}
              onToDelete={(e) => this.toDelete(e.detail)}
            />
          )}
        </div>
      </div>
    )
  }
}
