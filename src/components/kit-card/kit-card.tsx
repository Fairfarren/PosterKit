import { Component, h, Prop } from '@stencil/core'
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

  componentDidLoad() {
    console.log('KitCard => ', this.cardRef)
  }

  render() {
    return (
      <div class="kit-card-box">
        <div
          ref={(el) => (this.cardRef = el as HTMLDivElement)}
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
