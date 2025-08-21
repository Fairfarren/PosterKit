import { CardData } from '@/typing/index.d'
import { Component, h, Prop } from '@stencil/core'

@Component({
  tag: 'kit-svg',
  styleUrl: 'kit-svg.css',
})
export class KitSvg {
  @Prop() data: CardData

  // 文本换行处理方法
  private renderTextWithLineBreaks() {
    if (!this.data || this.data.type !== 'text') {
      return null
    }

    const text = this.data.text || ''
    const fontSize = this.data.fontSize || 16
    const maxWidth = (this.data.width || 0) - fontSize * 0.2 // 留出一些边距
    const lineHeight = fontSize * 1.4 // 行高

    // 创建临时 canvas 来测量文本宽度
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      return [
        <tspan key={0} x="0" dy="0">
          {text}
        </tspan>,
      ]
    }

    ctx.font = `${this.data.fontStyle || 'normal'} ${this.data.fontWeight || 'normal'} ${fontSize}px ${this.data.fontFamily || 'Arial'}`

    const lines: string[] = []
    let currentLine = ''
    let currentWidth = 0

    for (let i = 0; i < text.length; i++) {
      const char = text[i]
      const charWidth = ctx.measureText(char).width

      // 如果添加这个字符会超出宽度，则开始新行
      if (currentWidth + charWidth > maxWidth && currentLine.length > 0) {
        lines.push(currentLine)
        currentLine = char
        currentWidth = charWidth
      } else {
        currentLine += char
        currentWidth += charWidth
      }
    }

    // 添加最后一行
    if (currentLine.length > 0) {
      lines.push(currentLine)
    }

    return lines.map((line, index) => (
      <tspan key={index} x="0" dy={index === 0 ? '0' : lineHeight}>
        {line}
      </tspan>
    ))
  }

  render() {
    if (!this.data || this.data.type === 'image') {
      return null
    }
    return (
      <div class="kit-svg-box">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="kit-svg"
          viewBox={`0 0 ${this.data.width} ${this.data.height}`}
          width={this.data.width}
          height={this.data.height}
        >
          <defs>
            <g id={this.data.id}>
              <text
                xmlSpace="preserve"
                id={this.data.id}
                x="0"
                y="0"
                letter-spacing="0"
                writing-mode="horizontal-tb"
                dominant-baseline="text-before-edge"
                font-family={this.data.fontFamily}
                font-size={this.data.fontSize}
                text-decoration={this.data.decoration}
                font-style={this.data.fontStyle}
                font-weight={this.data.fontWeight}
                fill={this.data.color}
              >
                {this.renderTextWithLineBreaks()}
              </text>
            </g>
          </defs>

          <use
            {...{
              xlinkHref: `#${this.data.id}`,
              // @ts-ignore
              ['xmlns:xlink']: 'http://www.w3.org/1999/xlink',
            }}
          ></use>
        </svg>
      </div>
    )
  }
}
