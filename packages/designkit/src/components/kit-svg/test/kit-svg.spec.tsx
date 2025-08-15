import { newSpecPage } from '@stencil/core/testing'
import { KitSvg } from 'src/components/kit-svg/kit-svg'

describe('kit-card', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [KitSvg],
      html: `<kit-card></kit-card>`,
    })
    expect(page.root).toEqualHtml(`
      <kit-card>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </kit-card>
    `)
  })
})
