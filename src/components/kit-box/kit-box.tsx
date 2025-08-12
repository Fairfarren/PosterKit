import { Component, Prop, h, Method, State } from '@stencil/core'
import { CardData } from 'typing/index'

// const imgList = [
//   'https://remember-quick.oss-cn-chengdu.aliyuncs.com/avatar/default_avatar.png',
//   'https://material-center.meitudata.com/material/image/62fa22ac354485399.png'
// ]

@Component({
  tag: 'kit-box',
  styleUrl: 'kit-box.css',
})
export class MyComponent {
  // 用于存储 designkit div 的引用
  private designkitRef?: HTMLDivElement

  @Prop() width: number
  @Prop() height: number

  @State() domList: CardData[] = []
  @State() moveData: CardData = {
    width: 0,
    height: 0,
    x: 0,
    y: 0,
    image: null,
  }

  @Method()
  public async init() {
    // 使用 designkitRef 获取 div.designkit 元素
    console.log('designkit div:', this.designkitRef)
  }

  @Method()
  public async add(data: CardData) {
    this.domList = [...this.domList, data]
  }

  @Method()
  public async getDomList() {
    return this.domList
  }

  componentDidLoad() {
    this.init()
  }

  // 处理卡片点击的回调函数
  private handleCardClick = (cardData: CardData) => {
    console.log('卡片被点击了:', cardData)
    this.moveData = {
      ...cardData,
    }
  }

  render() {
    return (
      <div
        class="designkit"
        ref={(el) => (this.designkitRef = el as HTMLDivElement)}
      >
        {this.domList.map((item, index) => (
          <kit-card
            key={index}
            data={item}
            onClick={() => this.handleCardClick(item)}
          />
        ))}
        <kit-move data={this.moveData} />
      </div>
    )
  }
}
