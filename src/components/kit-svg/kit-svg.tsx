import { Component, h, Prop } from '@stencil/core'
import { CardData } from 'typing/index'

@Component({
  tag: 'kit-svg',
  styleUrl: 'kit-svg.css',
})
export class KitSvg {
  @Prop() data: CardData

  // 文本换行处理方法
  private renderTextWithLineBreaks() {
    if (this.data.type !== 'text') {
      return null
    }

    const text = this.data.text
    const maxWidth = this.data.width // 留出一些边距
    const lineHeight = this.data.fontSize * 1.4 // 行高
    const fontSize = this.data.fontSize

    // 简单的换行逻辑：按字符数估算
    const charsPerLine = Math.floor(maxWidth / fontSize) // 估算每行字符数
    const lines = []

    for (let i = 0; i < text.length; i += charsPerLine) {
      lines.push(text.slice(i, i + charsPerLine))
    }

    return lines.map((line, index) => (
      <tspan key={index} x="0" dy={index === 0 ? '0' : lineHeight}>
        {line}
      </tspan>
    ))
  }

  render() {
    if (this.data.type === 'image') {
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

          <use xlinkHref={`#${this.data.id}`}></use>
        </svg>
      </div>
    )
  }
}
