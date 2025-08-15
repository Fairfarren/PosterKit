import { Component, h, Prop, Element } from '@stencil/core'
import { CardData } from '@/typing/index.d'

@Component({
  tag: 'kit-card',
  styleUrl: 'kit-card.css',
})
export class KitCard {
  @Element() el: HTMLElement

  @Prop()
  data: CardData

  @Prop()
  zoom: number = 1

  render() {
    return (
      <div class="kit-card-box">
        <div
          class="kit-card"
          style={{
            width: this.data.width + 'px',
            height: this.data.height + 'px',
            transform: `translateX(${this.data.x}px) translateY(${this.data.y}px)`,
            backgroundImage: `url(${this.data.type === 'image' ? this.data.image.src : ''})`,
            backgroundSize: '100% 100%',
            backgroundRepeat: 'no-repeat',
          }}
        >
          {this.data.type === 'text' ? <kit-svg data={this.data} /> : ''}
        </div>
      </div>
    )
  }
}
