import { newSpecPage } from '@stencil/core/testing'
import { KitMove } from 'src/components/kit-move/kit-move'

describe('kit-card', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [KitMove],
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
