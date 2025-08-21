import { newE2EPage } from '@stencil/core/testing'

describe('kit-svg e2e', () => {
  let page

  beforeEach(async () => {
    page = await newE2EPage()
  })

  afterEach(async () => {
    await page.close()
  })

  it('should render text SVG element', async () => {
    await page.setContent(`
      <kit-svg></kit-svg>
      <script>
        const kitSvg = document.querySelector('kit-svg');
        kitSvg.data = {
          id: 'test-text-id',
          type: 'text',
          width: 200,
          height: 100,
          x: 0,
          y: 0,
          text: 'Hello World',
          fontSize: 16,
          fontFamily: 'Arial',
          color: '#000000',
          fontWeight: 'normal',
          fontStyle: 'normal',
          decoration: 'none'
        };
      </script>
    `)

    await page.waitForChanges()

    const kitSvg = await page.find('kit-svg')
    expect(kitSvg).toHaveClass('hydrated')

    const svgBox = await page.find('kit-svg .kit-svg-box')
    expect(svgBox).toBeTruthy()

    const svg = await page.find('kit-svg svg')
    expect(svg).toBeTruthy()

    const viewBox = await svg.getAttribute('viewBox')
    expect(viewBox).toBe('0 0 200 100')

    const width = await svg.getAttribute('width')
    expect(width).toBe('200')

    const height = await svg.getAttribute('height')
    expect(height).toBe('100')
  })

  it('should not render anything for image type', async () => {
    await page.setContent(`
      <kit-svg></kit-svg>
      <script>
        const kitSvg = document.querySelector('kit-svg');
        kitSvg.data = {
          id: 'test-image-id',
          type: 'image',
          width: 200,
          height: 100,
          x: 0,
          y: 0,
          image: new Image()
        };
      </script>
    `)

    await page.waitForChanges()

    const svgBox = await page.find('kit-svg .kit-svg-box')
    expect(svgBox).toBeFalsy()

    const svg = await page.find('kit-svg svg')
    expect(svg).toBeFalsy()
  })

  it('should render text with correct font properties', async () => {
    await page.setContent(`
      <kit-svg></kit-svg>
      <script>
        const kitSvg = document.querySelector('kit-svg');
        kitSvg.data = {
          id: 'test-styled-text',
          type: 'text',
          width: 300,
          height: 150,
          x: 0,
          y: 0,
          text: 'Styled Text',
          fontSize: 24,
          fontFamily: 'Helvetica',
          color: '#ff0000',
          fontWeight: 'bold',
          fontStyle: 'italic',
          decoration: 'underline'
        };
      </script>
    `)

    await page.waitForChanges()

    const textElement = await page.find('kit-svg text')
    expect(textElement).toBeTruthy()

    const fontFamily = await textElement.getAttribute('font-family')
    expect(fontFamily).toBe('Helvetica')

    const fontSize = await textElement.getAttribute('font-size')
    expect(fontSize).toBe('24')

    const fontWeight = await textElement.getAttribute('font-weight')
    expect(fontWeight).toBe('bold')

    const fontStyle = await textElement.getAttribute('font-style')
    expect(fontStyle).toBe('italic')

    const decoration = await textElement.getAttribute('text-decoration')
    expect(decoration).toBe('underline')

    const fill = await textElement.getAttribute('fill')
    expect(fill).toBe('#ff0000')
  })

  it('should render tspan elements for text content', async () => {
    await page.setContent(`
      <kit-svg></kit-svg>
      <script>
        const kitSvg = document.querySelector('kit-svg');
        kitSvg.data = {
          id: 'test-tspan',
          type: 'text',
          width: 200,
          height: 100,
          x: 0,
          y: 0,
          text: 'Multi Line Text',
          fontSize: 16,
          fontFamily: 'Arial',
          color: '#000000',
          fontWeight: 'normal',
          fontStyle: 'normal',
          decoration: 'none'
        };
      </script>
    `)

    await page.waitForChanges()

    const tspans = await page.findAll('kit-svg tspan')
    expect(tspans.length).toBeGreaterThan(0)

    const firstTspan = tspans[0]
    const x = await firstTspan.getAttribute('x')
    expect(x).toBe('0')

    const dy = await firstTspan.getAttribute('dy')
    expect(dy).toBe('0')
  })

  it('should render use element with correct href', async () => {
    await page.setContent(`
      <kit-svg></kit-svg>
      <script>
        const kitSvg = document.querySelector('kit-svg');
        kitSvg.data = {
          id: 'test-use-element',
          type: 'text',
          width: 200,
          height: 100,
          x: 0,
          y: 0,
          text: 'Test Use',
          fontSize: 16,
          fontFamily: 'Arial',
          color: '#000000',
          fontWeight: 'normal',
          fontStyle: 'normal',
          decoration: 'none'
        };
      </script>
    `)

    await page.waitForChanges()

    const useElement = await page.find('kit-svg use')
    expect(useElement).toBeTruthy()

    const href = await useElement.getAttribute('xlink:href')
    expect(href).toBe('#test-use-element')

    const xlinkNs = await useElement.getAttribute('xmlns:xlink')
    expect(xlinkNs).toBe('http://www.w3.org/1999/xlink')
  })

  it('should have correct text element attributes', async () => {
    await page.setContent(`
      <kit-svg></kit-svg>
      <script>
        const kitSvg = document.querySelector('kit-svg');
        kitSvg.data = {
          id: 'test-text-attrs',
          type: 'text',
          width: 200,
          height: 100,
          x: 0,
          y: 0,
          text: 'Attribute Test',
          fontSize: 18,
          fontFamily: 'Times',
          color: '#333333',
          fontWeight: '600',
          fontStyle: 'normal',
          decoration: 'none'
        };
      </script>
    `)

    await page.waitForChanges()

    const textElement = await page.find('kit-svg text')

    const letterSpacing = await textElement.getAttribute('letter-spacing')
    expect(letterSpacing).toBe('0')

    const writingMode = await textElement.getAttribute('writing-mode')
    expect(writingMode).toBe('horizontal-tb')

    const dominantBaseline = await textElement.getAttribute('dominant-baseline')
    expect(dominantBaseline).toBe('text-before-edge')

    const x = await textElement.getAttribute('x')
    expect(x).toBe('0')

    const y = await textElement.getAttribute('y')
    expect(y).toBe('0')

    const xmlSpace = await textElement.getAttribute('xmlspace')
    expect(xmlSpace).toBe('preserve')
  })

  it('should handle different text content', async () => {
    await page.setContent(`
      <kit-svg></kit-svg>
      <script>
        const kitSvg = document.querySelector('kit-svg');
        kitSvg.data = {
          id: 'test-content',
          type: 'text',
          width: 300,
          height: 200,
          x: 0,
          y: 0,
          text: 'Hello 世界! 🌍 123',
          fontSize: 20,
          fontFamily: 'Arial',
          color: '#000000',
          fontWeight: 'normal',
          fontStyle: 'normal',
          decoration: 'none'
        };
      </script>
    `)

    await page.waitForChanges()

    const kitSvg = await page.find('kit-svg')
    const textContent = await kitSvg.textContent

    // Use regex to match the content more flexibly due to encoding differences
    expect(textContent).toMatch(/Hello.*123/)
  })

  it('should render defs and g elements correctly', async () => {
    await page.setContent(`
      <kit-svg></kit-svg>
      <script>
        const kitSvg = document.querySelector('kit-svg');
        kitSvg.data = {
          id: 'test-defs-g',
          type: 'text',
          width: 200,
          height: 100,
          x: 0,
          y: 0,
          text: 'Defs Test',
          fontSize: 16,
          fontFamily: 'Arial',
          color: '#000000',
          fontWeight: 'normal',
          fontStyle: 'normal',
          decoration: 'none'
        };
      </script>
    `)

    await page.waitForChanges()

    const defs = await page.find('kit-svg defs')
    expect(defs).toBeTruthy()

    const g = await page.find('kit-svg defs g')
    expect(g).toBeTruthy()

    const gId = await g.getAttribute('id')
    expect(gId).toBe('test-defs-g')

    const textInG = await page.find('kit-svg defs g text')
    expect(textInG).toBeTruthy()
  })

  it('should update when data changes', async () => {
    await page.setContent(`
      <kit-svg></kit-svg>
      <script>
        const kitSvg = document.querySelector('kit-svg');
        kitSvg.data = {
          id: 'initial-id',
          type: 'text',
          width: 200,
          height: 100,
          x: 0,
          y: 0,
          text: 'Initial Text',
          fontSize: 16,
          fontFamily: 'Arial',
          color: '#000000',
          fontWeight: 'normal',
          fontStyle: 'normal',
          decoration: 'none'
        };
      </script>
    `)

    await page.waitForChanges()

    let kitSvg = await page.find('kit-svg')
    let textContent = await kitSvg.textContent
    expect(textContent).toContain('Initial Text')

    // Update the data
    await page.evaluate(() => {
      const kitSvg = document.querySelector('kit-svg')
      const baseData = kitSvg.data
      kitSvg.data = {
        id: baseData.id,
        width: baseData.width,
        height: baseData.height,
        x: baseData.x,
        y: baseData.y,
        isLock: baseData.isLock,
        type: 'text' as const,
        text: 'Updated Text',
        fontSize: 20,
        color: '#ff0000',
        fontFamily: 'Arial',
        fontWeight: 'normal',
        fontStyle: 'normal' as const,
        decoration: 'none' as const,
      }
    })

    await page.waitForChanges()

    kitSvg = await page.find('kit-svg')
    textContent = await kitSvg.textContent
    expect(textContent).toContain('Updated Text')

    const textElement = await page.find('kit-svg text')
    const fontSize = await textElement.getAttribute('font-size')
    expect(fontSize).toBe('20')

    const color = await textElement.getAttribute('fill')
    expect(color).toBe('#ff0000')
  })
})
