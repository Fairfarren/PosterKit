import { Component, h, Prop, State } from '@stencil/core'
import { CardData } from 'typing/index'

@Component({
  tag: 'kit-card',
  styleUrl: 'kit-card.css',
})
export class KitCard {
  private cardRef?: HTMLDivElement

  @Prop({
    mutable: true,
  })
  data: CardData

  @State() isDragging = false
  @State() isResizing = false
  @State() resizeDirection = ''

  private startX = 0
  private startY = 0
  private startWidth = 0
  private startHeight = 0
  private startCardX = 0
  private startCardY = 0

  componentDidLoad() {
    console.log('KitCard => ', this.cardRef)
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

    this.data = {
      ...this.data,
      x: this.startCardX + deltaX,
      y: this.startCardY + deltaY,
    }
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

    switch (this.resizeDirection) {
      case 'nw':
        newWidth = Math.max(10, this.startWidth - deltaX)
        newHeight = Math.max(10, this.startHeight - deltaY)
        newX = this.startCardX + (this.startWidth - newWidth)
        newY = this.startCardY + (this.startHeight - newHeight)
        break
      case 'n':
        newHeight = Math.max(10, this.startHeight - deltaY)
        newY = this.startCardY + (this.startHeight - newHeight)
        break
      case 'ne':
        newWidth = Math.max(10, this.startWidth + deltaX)
        newHeight = Math.max(10, this.startHeight - deltaY)
        newY = this.startCardY + (this.startHeight - newHeight)
        break
      case 'e':
        newWidth = Math.max(10, this.startWidth + deltaX)
        break
      case 'se':
        newWidth = Math.max(10, this.startWidth + deltaX)
        newHeight = Math.max(10, this.startHeight + deltaY)
        break
      case 's':
        newHeight = Math.max(10, this.startHeight + deltaY)
        break
      case 'sw':
        newWidth = Math.max(10, this.startWidth - deltaX)
        newHeight = Math.max(10, this.startHeight + deltaY)
        newX = this.startCardX + (this.startWidth - newWidth)
        break
      case 'w':
        newWidth = Math.max(10, this.startWidth - deltaX)
        newX = this.startCardX + (this.startWidth - newWidth)
        break
    }

    this.data = {
      ...this.data,
      width: newWidth,
      height: newHeight,
      x: newX,
      y: newY,
    }
  }

  render() {
    const cardClass = `kit-card ${this.isDragging ? 'dragging' : ''} ${this.isResizing ? 'resizing' : ''}`

    return (
      <div
        ref={(el) => (this.cardRef = el as HTMLDivElement)}
        class={cardClass}
        style={{
          width: this.data.width + 'px',
          height: this.data.height + 'px',
          transform: `translateX(${this.data.x}px) translateY(${this.data.y}px)`,
          backgroundImage: `url(${this.data.image.src})`,
          backgroundSize: '100% 100%',
        }}
        onMouseDown={this.handleCardMouseDown}
      >
        {/* 8个缩放控制点 */}
        <div
          class="resize-handle nw"
          onMouseDown={(e) => this.handleResizeMouseDown(e, 'nw')}
        ></div>
        <div
          class="resize-handle n"
          onMouseDown={(e) => this.handleResizeMouseDown(e, 'n')}
        ></div>
        <div
          class="resize-handle ne"
          onMouseDown={(e) => this.handleResizeMouseDown(e, 'ne')}
        ></div>
        <div
          class="resize-handle e"
          onMouseDown={(e) => this.handleResizeMouseDown(e, 'e')}
        ></div>
        <div
          class="resize-handle se"
          onMouseDown={(e) => this.handleResizeMouseDown(e, 'se')}
        ></div>
        <div
          class="resize-handle s"
          onMouseDown={(e) => this.handleResizeMouseDown(e, 's')}
        ></div>
        <div
          class="resize-handle sw"
          onMouseDown={(e) => this.handleResizeMouseDown(e, 'sw')}
        ></div>
        <div
          class="resize-handle w"
          onMouseDown={(e) => this.handleResizeMouseDown(e, 'w')}
        ></div>
      </div>
    )
  }
}
