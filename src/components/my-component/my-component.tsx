import { Component, Prop, h, Method, Element } from '@stencil/core';

@Component({
  tag: 'my-component',
  styleUrl: 'my-component.css',
})
export class MyComponent {
  // 用于存储 designkit div 的引用
  private designkitRef?: HTMLDivElement;

  @Prop() width: number;
  @Prop() height: number;

  domList: Array<{
    width: number
    height: number
    image: HTMLImageElement
    x: number
    y: number
  }> = [];

  @Method()
  async init() {
    // 使用 designkitRef 获取 div.designkit 元素
    console.log('designkit div:', this.designkitRef);
  }

  @Method()
  public async add(data: {
    width: number
    height: number
    image: HTMLImageElement
    x: number
    y: number
  }) {
    if (!data) return;
    this.domList.push(data);
  }

  @Method()
  public async reset(list: typeof this.domList) {
    this.domList = list
  }

  componentDidLoad() {
    this.init();
  }

  render() {
    return <div
      class="designkit"
      ref={(el) => this.designkitRef = el as HTMLDivElement}
    >
      canvas
    </div>
  }
}
