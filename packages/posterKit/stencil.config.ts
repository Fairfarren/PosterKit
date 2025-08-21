import { Config } from '@stencil/core'
import { reactOutputTarget } from '@stencil/react-output-target'
import { vueOutputTarget } from '@stencil/vue-output-target'

export const config: Config = {
  namespace: 'poster-kit',
  sourceMap: false,
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'dist-custom-elements',
      customElementsExportBehavior: 'auto-define-custom-elements',
      externalRuntime: false,
    },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
    },
    reactOutputTarget({
      outDir: './dist/react/',
    }),
    vueOutputTarget({
      componentCorePackage: 'poster-kit',
      proxiesFile: './dist/vue/index.ts',
      includeDefineCustomElements: true,
    }),
  ],
  testing: {
    tsconfig: 'tsconfig.spec.json',
    browserHeadless: 'new',
  },
}
