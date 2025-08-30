# PosterKit 🎨

> 一个现代化的海报编辑工具库，基于 Stencil 构建，支持 React、Vue 等主流框架

[![npm version](https://img.shields.io/npm/v/poster-kit.svg)](https://www.npmjs.com/package/poster-kit)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://github.com/Fairfarren/PosterKit/actions/workflows/ci.yml/badge.svg)](https://github.com/Fairfarren/PosterKit/actions)

## ✨ 特性

- 🎯 **组件化设计** - 基于 Stencil 构建的 Web Components，框架无关
- 🚀 **多框架支持** - 原生支持 React、Vue 等主流前端框架
- 📝 **丰富的文本样式** - 支持字体、大小、颜色、装饰等自定义样式
- 🖼️ **图像处理** - 支持图片元素的编辑和处理
- 📱 **响应式设计** - 适配不同屏幕尺寸和设备
- 🧪 **完整测试** - 包含单元测试和 E2E 测试
- 📦 **TypeScript 支持** - 完整的类型定义

## 🚀 快速开始

### 安装

```bash
# npm
npm install poster-kit

# yarn
yarn add poster-kit

# pnpm
pnpm add poster-kit

# bun
bun add poster-kit
```

### 基础使用

#### HTML / Vanilla JS

```html
<!DOCTYPE html>
<html>
<head>
  <script type="module" src="https://unpkg.com/poster-kit/dist/posterKit/posterKit.esm.js"></script>
</head>
<body>
  <kit-svg id="poster"></kit-svg>

  <script>
    const poster = document.getElementById('poster');
    poster.data = {
      id: 'text-1',
      type: 'text',
      text: 'Hello PosterKit!',
      fontSize: 24,
      fontFamily: 'Arial',
      color: '#333333',
      width: 300,
      height: 100
    };
  </script>
</body>
</html>
```

#### React

```tsx
import { KitSvg } from 'poster-kit/react';

function App() {
  const textData = {
    id: 'text-1',
    type: 'text',
    text: 'Hello PosterKit!',
    fontSize: 24,
    fontFamily: 'Arial',
    color: '#333333',
    width: 300,
    height: 100
  };

  return <KitSvg data={textData} />;
}
```

#### Vue

```vue
<template>
  <kit-svg :data="textData" />
</template>

<script setup>
import { KitSvg } from 'poster-kit/vue';

const textData = {
  id: 'text-1',
  type: 'text',
  text: 'Hello PosterKit!',
  fontSize: 24,
  fontFamily: 'Arial',
  color: '#333333',
  width: 300,
  height: 100
};
</script>
```

## 📚 API 文档

### 组件

| 组件名     | 描述         | 支持的数据类型 |
| ---------- | ------------ | -------------- |
| `kit-svg`  | SVG 渲染组件 | text, image    |
| `kit-box`  | 容器组件     | -              |
| `kit-card` | 卡片组件     | -              |
| `kit-move` | 拖拽组件     | -              |

### 数据类型

#### 文本数据

```typescript
interface TextData {
  id: string;
  type: 'text';
  text: string;
  fontSize: number;
  fontFamily: string;
  color: string;
  fontWeight?: string;
  fontStyle?: 'normal' | 'italic';
  decoration?: 'none' | 'underline' | 'line-through';
  width: number;
  height: number;
  x?: number;
  y?: number;
}
```

#### 图像数据

```typescript
interface ImageData {
  id: string;
  type: 'image';
  image: {
    src: string;
    [key: string]: any;
  };
  width: number;
  height: number;
  x?: number;
  y?: number;
}
```

## 🛠️ 开发

### 环境要求

- Node.js >= 18
- Bun >= 1.2.17 (推荐) 或 npm/yarn/pnpm

### 本地开发

```bash
# 克隆项目
git clone https://github.com/Fairfarren/PosterKit.git
cd PosterKit

# 安装依赖
bun install

# 启动开发服务器
cd packages/posterKit
bun run start

# 运行示例
cd example/react
bun run dev

# 或运行 Vue 示例
cd example/vue
bun run dev
```

### 测试

```bash
# 运行所有测试
bun run test

# 运行单元测试
bun run test --spec

# 运行 E2E 测试
bun run test --e2e

# 监听模式
bun run test.watch
```

### 构建

```bash
# 构建组件库
cd packages/posterKit
bun run build

# 构建示例
cd example/react
bun run build
```

## 🌐 在线体验

- **演示地址**: [https://fairfarren.github.io/PosterKit/](https://fairfarren.github.io/PosterKit/)
- **文档地址**: [https://fairfarren.github.io/PosterKit-docs/](https://fairfarren.github.io/PosterKit-docs/)

## 🏗️ 项目结构

```
posterKit/
├── packages/
│   └── posterKit/          # 核心组件库
│       ├── src/
│       │   ├── components/ # 组件源码
│       │   ├── typing/     # 类型定义
│       │   └── utils/      # 工具函数
│       └── loader/         # 加载器
├── example/
│   ├── react/             # React 示例
│   └── vue/               # Vue 示例
└── pages/                 # 构建产物
```

## 🤝 贡献

欢迎贡献代码！请先阅读 [贡献指南](CONTRIBUTING.md)。

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📋 待办事项

- [x] 删除内容功能
- [x] 生成海报功能
- [x] GitHub Actions 自动部署
- [x] React / Vue 示例
- [x] 完整文档
- [x] 单元测试和 E2E 测试
- [ ] 更多组件类型
- [ ] 拖拽排序功能
- [ ] 图层管理
- [ ] 撤销/重做功能

## 📝 更新日志

查看 [CHANGELOG.md](CHANGELOG.md) 了解版本更新详情。

## 📄 许可证

本项目基于 [MIT](LICENSE) 许可证开源。

## 💡 灵感

感谢所有为这个项目提供灵感和支持的开发者们！

---

<div align="center">
  <sub>Built with ❤️ by <a href="https://github.com/Fairfarren">Fairfarren</a></sub>
</div>

