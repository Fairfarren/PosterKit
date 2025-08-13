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
    const lineHeight = 60 // 行高
    const fontSize = 50

    // 简单的换行逻辑：按字符数估算
    const charsPerLine = Math.floor(maxWidth / (fontSize * 0.6)) // 估算每行字符数
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
                font-family="AlibabaPuHuiTi-Regular"
                font-size="50"
                text-decoration="none"
                font-style="normal"
                font-weight="normal"
                fill="#000000ff"
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
