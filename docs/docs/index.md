---
pageType: home

hero:
  name: DesignKit
  text: 海报编辑器组件库
  tagline: 基于 Web Components 的跨框架海报编辑能力，React/Vue 即插即用
  actions:
    - theme: brand
      text: 快速开始
      link: /install/
    - theme: alt
      text: GitHub
      link: https://github.com/Fairfarren/DesignKit
  image:
    src: /rspress-icon.png
    alt: DesignKit Logo
features:
  - title: 拖拽与八点缩放
    details: 卡片支持拖拽与八个方向锚点缩放，最小尺寸限制 10×10。
    icon: ✋
  - title: 图片与文本卡片
    details: CardData 通过 TypeScript 联合类型区分 image/text，字段类型安全。
    icon: 🧩
  - title: SVG 文本高保真
    details: 文本以 SVG 渲染，支持字体、字号、颜色、字重、斜体、装饰等，导出到 Canvas 生成海报。
    icon: 🖼️
  - title: 比例自适配与缩放
    details: 预览区域按宽高基准自适应外层，记录缩放比例 zoom 便于数据换算。
    icon: 🔎
  - title: 事件通信
    details: 通过 current-data-change 事件向外层同步当前数据变化，便于落盘与联动。
    icon: 🔔
  - title: 跨框架易用
    details: 提供 React/Vue 包装与原生自定义元素，低耦合、零依赖。
    icon: 🔗
  - title: 快捷操作与层级
    details: 支持层级上移、下移、删除等快捷操作，编辑体验顺滑。
    icon: ⌨️
  - title: 体积小性能优
    details: 基于 Stencil 构建，按需加载、运行高效。
    icon: ⚡
---
