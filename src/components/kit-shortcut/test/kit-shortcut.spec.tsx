import { newSpecPage } from '@stencil/core/testing';
import { KitShortcut } from '../kit-shortcut';

describe('kit-shortcut', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [KitShortcut],
      html: `<kit-shortcut></kit-shortcut>`,
    });
    expect(page.root).toEqualHtml(`
      <kit-shortcut>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </kit-shortcut>
    `);
  });
});
