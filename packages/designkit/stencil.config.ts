import { Config } from '@stencil/core'
import { reactOutputTarget } from '@stencil/react-output-target'
import { vueOutputTarget } from '@stencil/vue-output-target'

export const config: Config = {
  namespace: 'designkit',
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
      componentCorePackage: 'designkit',
      proxiesFile: './dist/vue/index.ts',
      includeDefineCustomElements: true,
    }),
  ],
  testing: {
    browserHeadless: 'shell',
  },
}
