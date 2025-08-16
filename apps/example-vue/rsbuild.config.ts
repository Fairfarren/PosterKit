import { defineConfig } from '@rsbuild/core'
import { pluginVue } from '@rsbuild/plugin-vue'
import { pluginBabel } from '@rsbuild/plugin-babel'
import { pluginVueJsx } from '@rsbuild/plugin-vue-jsx'

export default defineConfig({
  plugins: [
    pluginBabel({
      include: /\.(?:jsx|tsx)$/,
    }),
    pluginVue({
      vueLoaderOptions: {
        compilerOptions: {
          isCustomElement: (tag) => tag.startsWith('kit-'), // 例如所有以 my- 开头的标签
        },
      },
    }),
    pluginVueJsx(),
  ],
  // 如果使用vite，请使用下面这个写法
  // import vueJsx from '@vitejs/plugin-vue-jsx'
  // plugins: [
  //   vue({
  //     template: {
  //       compilerOptions: {
  //         isCustomElement: (tag) => tag.includes('-'),
  //       },
  //     },
  //   }),
  //   vueJsx(),
  // ],
})
