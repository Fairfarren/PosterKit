import { Component, h, Prop } from '@stencil/core'
import { CardData } from 'typing/index'

@Component({
  tag: 'kit-card',
  styleUrl: 'kit-card.css',
})
export class KitCard {
  @Prop({
    mutable: true,
  })
  data: CardData

  render() {
    return (
      <div
        class="kit-card"
        style={{
          width: this.data.width + 'px',
          height: this.data.height + 'px',
          transform: `translateX(${this.data.x}px) translateY(${this.data.y}px)`,
          backgroundImage: `url(${this.data.image.src})`,
          backgroundSize: '100% 100%',
        }}
      ></div>
    )
  }
}
