import { newSpecPage } from '@stencil/core/testing';
import { KitCard } from '../kit-card';

describe('kit-card', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [KitCard],
      html: `<kit-card></kit-card>`,
    });
    expect(page.root).toEqualHtml(`
      <kit-card>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </kit-card>
    `);
  });
});
