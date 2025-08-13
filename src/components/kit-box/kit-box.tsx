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
import { CardData } from 'typing/index'

// const imgList = [
//   'https://remember-quick.oss-cn-chengdu.aliyuncs.com/avatar/default_avatar.png',
//   'https://material-center.meitudata.com/material/image/62fa22ac354485399.png'
// ]

@Component({
  tag: 'kit-box',
  styleUrl: 'kit-box.css',
})
export class MyComponent {
  // 用于存储 designkit div 的引用
  private designkitRef?: HTMLDivElement
  @State() private zoom = 1
  @State() private previewWidth = 0
  @State() private previewHeight = 0

  @Prop() width: number
  @Prop() height: number

  @Event() currentDataChange: EventEmitter<CardData>
  dataOnChange(data: CardData) {
    this.currentDataChange.emit(data)
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
    this.domList = list
    if (this.moveData.id) {
      list.find((item) => {
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

    // 取较小的缩放比例，确保内容完全显示在容器内
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

  // 处理卡片点击的回调函数
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

  private clearMoveData = (e) => {
    e.stopPropagation()
    this.onDataChanged({})
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
            />
          )}
        </div>
      </div>
    )
  }
}
