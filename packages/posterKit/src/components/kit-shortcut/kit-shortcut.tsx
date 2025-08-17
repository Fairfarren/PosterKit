import { Event, Prop, Component, h, EventEmitter } from '@stencil/core'
import { CardData } from '@/typing/index.d'
import iconDelete from '../../assets/icon/delete.svg'
import iconLock from '../../assets/icon/lock.svg'
import iconUnLock from '../../assets/icon/unLock.svg'

@Component({
  tag: 'kit-shortcut',
  styleUrl: 'kit-shortcut.css',
})
export class KitShortcut {
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

  @Event()
  dataChanged: EventEmitter<CardData>

  render() {
    const menuList = [
      {
        name: '锁比例',
        icon: (
          <img
            src={this.data?.isLock ? iconLock : iconUnLock}
            class="icon icon-lock"
          />
        ),
        onClick: () =>
          this.dataChanged.emit({
            ...this.data,
            isLock: !this.data.isLock,
          }),
      },
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

    return (
      <div
        class={`kit-shortcut ${this.moveY < 40 ? 'kit-shortcut-bottom' : ''}`}
      >
        <div class="kit-shortcut-content">
          {menuList.map((item, index) => (
            <div key={index} class="kit-shortcut-item" onClick={item.onClick}>
              {item.icon}
            </div>
          ))}
        </div>
      </div>
    )
  }
}
