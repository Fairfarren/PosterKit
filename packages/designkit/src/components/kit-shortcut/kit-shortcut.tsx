import { Event, Prop, Component, h, EventEmitter } from '@stencil/core'
import { CardData } from '@/typing/index.d'
import iconDelete from '../../assets/icon/delete.svg'

@Component({
  tag: 'kit-shortcut',
  styleUrl: 'kit-shortcut.css',
})
export class KitShortcut {
  private menuList = [
    {
      name: '上一层',
      icon: '↑',
      onClick: () => this.toUp.emit(this.data),
    },
    {
      name: '下一层',
      icon: '↓',
      onClick: () => this.toDown.emit(this.data),
    },
    {
      name: '删除',
      icon: <img src={iconDelete} class="icon icon-delete" />,
      onClick: () => this.toDelete.emit(this.data),
    },
  ]

  @Prop()
  moveY: number = 0

  @Prop()
  data: CardData

  @Event()
  toUp: EventEmitter<CardData>

  @Event()
  toDown: EventEmitter<CardData>

  @Event()
  toDelete: EventEmitter<CardData>

  render() {
    return (
      <div
        class={`kit-shortcut ${this.moveY < 40 ? 'kit-shortcut-bottom' : ''}`}
      >
        <div class="kit-shortcut-content">
          {this.menuList.map((item, index) => (
            <div key={index} class="kit-shortcut-item" onClick={item.onClick}>
              {item.icon}
            </div>
          ))}
        </div>
      </div>
    )
  }
}
