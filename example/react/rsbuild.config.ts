import { defineConfig } from '@rsbuild/core'
import { pluginReact } from '@rsbuild/plugin-react'

export default defineConfig({
  html: {
    title: 'poster-kit example react',
  },
  output: {
    assetPrefix: './',
  },
  plugins: [pluginReact()],
})
