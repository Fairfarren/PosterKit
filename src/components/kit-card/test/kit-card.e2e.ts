import { newE2EPage } from '@stencil/core/testing';

describe('kit-card', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<kit-card></kit-card>');

    const element = await page.find('kit-card');
    expect(element).toHaveClass('hydrated');
  });
});
