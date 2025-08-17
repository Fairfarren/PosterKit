import { Component, h, Prop, State, Event, EventEmitter } from '@stencil/core'
import { CardData } from '@/typing/index.d'

@Component({
  tag: 'kit-move',
  styleUrl: 'kit-move.css',
})
export class KitMove {
  private minWidth = 10

  @Prop()
  data: CardData

  @Prop()
  zoom: number = 1

  @State() isDragging = false
  @State() isResizing = false
  @State() resizeDirection = ''

  @Event() dataChanged: EventEmitter<CardData>
  dataOnChanged(data: CardData) {
    this.dataChanged.emit(data)
  }

  @Event()
  toUp: EventEmitter<CardData>
  @Event()
  toDown: EventEmitter<CardData>
  @Event()
  toDelete: EventEmitter<CardData>

  private startX = 0
  private startY = 0
  private startWidth = 0
  private startHeight = 0
  private startCardX = 0
  private startCardY = 0

  componentDidLoad() {
    this.addGlobalEventListeners()
  }

  disconnectedCallback() {
    this.removeGlobalEventListeners()
  }

  private addGlobalEventListeners() {
    document.addEventListener('mousemove', this.handleMouseMove)
    document.addEventListener('mouseup', this.handleMouseUp)
  }

  private removeGlobalEventListeners() {
    document.removeEventListener('mousemove', this.handleMouseMove)
    document.removeEventListener('mouseup', this.handleMouseUp)
  }

  private handleMouseMove = (e: MouseEvent) => {
    if (this.isDragging) {
      this.handleDrag(e)
    } else if (this.isResizing) {
      this.handleResize(e)
    }
  }

  private handleMouseUp = () => {
    this.isDragging = false
    this.isResizing = false
    this.resizeDirection = ''
  }

  private handleCardMouseDown = (e: MouseEvent) => {
    // 只有点击卡片本身才开始拖拽，不包括缩放控制点
    if ((e.target as HTMLElement).classList.contains('resize-handle')) {
      return
    }

    e.preventDefault()
    this.isDragging = true
    this.startX = e.clientX
    this.startY = e.clientY
    this.startCardX = this.data.x
    this.startCardY = this.data.y
  }

  private handleDrag(e: MouseEvent) {
    const deltaX = e.clientX - this.startX
    const deltaY = e.clientY - this.startY

    this.setData({
      ...this.data,
      x: this.startCardX + deltaX,
      y: this.startCardY + deltaY,
    })
  }

  private handleResizeMouseDown = (e: MouseEvent, direction: string) => {
    e.preventDefault()
    e.stopPropagation()

    this.isResizing = true
    this.resizeDirection = direction
    this.startX = e.clientX
    this.startY = e.clientY
    this.startWidth = this.data.width
    this.startHeight = this.data.height
    this.startCardX = this.data.x
    this.startCardY = this.data.y
  }

  private handleResize(e: MouseEvent) {
    const deltaX = e.clientX - this.startX
    const deltaY = e.clientY - this.startY

    let newWidth = this.startWidth
    let newHeight = this.startHeight
    let newX = this.startCardX
    let newY = this.startCardY

    // 如果 isLock 为 true，角落的缩放点需要等比例缩放
    if (
      this.data.isLock &&
      ['nw', 'ne', 'se', 'sw'].includes(this.resizeDirection)
    ) {
      // 计算原始宽高比
      const aspectRatio = this.startWidth / this.startHeight

      // 根据拖拽方向选择主要的变化量
      let primaryDelta = 0
      switch (this.resizeDirection) {
        case 'nw':
          primaryDelta = Math.max(-deltaX, -deltaY)
          newWidth = Math.max(this.minWidth, this.startWidth - primaryDelta)
          newHeight = Math.max(this.minWidth, newWidth / aspectRatio)
          newX = this.startCardX + (this.startWidth - newWidth)
          newY = this.startCardY + (this.startHeight - newHeight)
          break
        case 'ne':
          primaryDelta = Math.max(deltaX, -deltaY)
          newWidth = Math.max(this.minWidth, this.startWidth + primaryDelta)
          newHeight = Math.max(this.minWidth, newWidth / aspectRatio)
          newY = this.startCardY + (this.startHeight - newHeight)
          break
        case 'se':
          primaryDelta = Math.max(deltaX, deltaY)
          newWidth = Math.max(this.minWidth, this.startWidth + primaryDelta)
          newHeight = Math.max(this.minWidth, newWidth / aspectRatio)
          break
        case 'sw':
          primaryDelta = Math.max(-deltaX, deltaY)
          newWidth = Math.max(this.minWidth, this.startWidth - primaryDelta)
          newHeight = Math.max(this.minWidth, newWidth / aspectRatio)
          newX = this.startCardX + (this.startWidth - newWidth)
          break
      }
    } else {
      // 原有的缩放逻辑
      switch (this.resizeDirection) {
        case 'nw':
          newWidth = Math.max(this.minWidth, this.startWidth - deltaX)
          newHeight = Math.max(this.minWidth, this.startHeight - deltaY)
          newX = this.startCardX + (this.startWidth - newWidth)
          newY = this.startCardY + (this.startHeight - newHeight)
          break
        case 'n':
          newHeight = Math.max(this.minWidth, this.startHeight - deltaY)
          newY = this.startCardY + (this.startHeight - newHeight)
          break
        case 'ne':
          newWidth = Math.max(this.minWidth, this.startWidth + deltaX)
          newHeight = Math.max(this.minWidth, this.startHeight - deltaY)
          newY = this.startCardY + (this.startHeight - newHeight)
          break
        case 'e':
          newWidth = Math.max(this.minWidth, this.startWidth + deltaX)
          break
        case 'se':
          newWidth = Math.max(this.minWidth, this.startWidth + deltaX)
          newHeight = Math.max(this.minWidth, this.startHeight + deltaY)
          break
        case 's':
          newHeight = Math.max(this.minWidth, this.startHeight + deltaY)
          break
        case 'sw':
          newWidth = Math.max(this.minWidth, this.startWidth - deltaX)
          newHeight = Math.max(this.minWidth, this.startHeight + deltaY)
          newX = this.startCardX + (this.startWidth - newWidth)
          break
        case 'w':
          newWidth = Math.max(this.minWidth, this.startWidth - deltaX)
          newX = this.startCardX + (this.startWidth - newWidth)
          break
      }
    }

    this.setData({
      ...this.data,
      width: newWidth,
      height: newHeight,
      x: newX,
      y: newY,
    })
  }

  private setData(data: CardData) {
    this.dataOnChanged({
      ...data,
    })
  }

  render() {
    return (
      <div class="kit-move-box">
        <div
          class="kit-move dragging resizing"
          style={{
            width: this.data.width + 'px',
            height: this.data.height + 'px',
            transform: `translateX(${this.data.x}px) translateY(${this.data.y}px)`,
          }}
          onMouseDown={this.handleCardMouseDown}
        >
          <kit-shortcut moveY={this.data.y} data={this.data} />
          {/* 缩放控制点 */}
          {/* 四个角的缩放点，始终显示 */}
          <div
            class="resize-handle nw"
            onMouseDown={(e) => this.handleResizeMouseDown(e, 'nw')}
          ></div>
          <div
            class="resize-handle ne"
            onMouseDown={(e) => this.handleResizeMouseDown(e, 'ne')}
          ></div>
          <div
            class="resize-handle se"
            onMouseDown={(e) => this.handleResizeMouseDown(e, 'se')}
          ></div>
          <div
            class="resize-handle sw"
            onMouseDown={(e) => this.handleResizeMouseDown(e, 'sw')}
          ></div>

          {/* 上下左右的缩放点，只有在 isLock 为 false 时才显示 */}
          {!this.data.isLock && (
            <>
              <div
                class="resize-handle n"
                onMouseDown={(e) => this.handleResizeMouseDown(e, 'n')}
              ></div>
              <div
                class="resize-handle e"
                onMouseDown={(e) => this.handleResizeMouseDown(e, 'e')}
              ></div>
              <div
                class="resize-handle s"
                onMouseDown={(e) => this.handleResizeMouseDown(e, 's')}
              ></div>
              <div
                class="resize-handle w"
                onMouseDown={(e) => this.handleResizeMouseDown(e, 'w')}
              ></div>
            </>
          )}
        </div>
      </div>
    )
  }
}
