import { newE2EPage } from '@stencil/core/testing'

describe('kit-shortcut', () => {
  it('renders', async () => {
    const page = await newE2EPage()
    await page.setContent('<kit-shortcut></kit-shortcut>')

    const element = await page.find('kit-shortcut')
    expect(element).toHaveClass('hydrated')
  })
})
