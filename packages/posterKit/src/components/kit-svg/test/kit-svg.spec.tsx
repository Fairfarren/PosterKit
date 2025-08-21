import { newSpecPage } from '@stencil/core/testing'
import { KitSvg } from '../kit-svg'
import { CardData } from '@/typing/index.d'

describe('kit-svg', () => {
  let mockCanvas: HTMLCanvasElement
  let mockContext: CanvasRenderingContext2D

  beforeEach(() => {
    // Mock Canvas API
    mockContext = {
      measureText: jest.fn().mockReturnValue({ width: 10 }),
      font: '',
    } as any

    mockCanvas = {
      getContext: jest.fn().mockReturnValue(mockContext),
    } as any

    // Mock document.createElement for canvas
    jest.spyOn(document, 'createElement').mockImplementation((tagName) => {
      if (tagName === 'canvas') {
        return mockCanvas
      }
      return document.createElement(tagName)
    })
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  const createTextCardData = (overrides: any = {}): CardData => ({
    id: 'test-text-id',
    type: 'text' as const,
    width: 200,
    height: 100,
    x: 0,
    y: 0,
    text: 'Hello World',
    fontSize: 16,
    fontFamily: 'Arial',
    color: '#000000',
    fontWeight: 'normal',
    fontStyle: 'normal' as const,
    decoration: 'none' as const,
    ...overrides,
  })

  const createImageCardData = (overrides: any = {}): CardData => ({
    id: 'test-image-id',
    type: 'image' as const,
    width: 200,
    height: 100,
    x: 0,
    y: 0,
    image: new Image(),
    ...overrides,
  })

  it('should render text card correctly', async () => {
    const testData = createTextCardData()
    const page = await newSpecPage({
      components: [KitSvg],
      html: `<kit-svg></kit-svg>`,
    })

    page.root.data = testData
    await page.waitForChanges()

    const svgBox = page.root.querySelector('.kit-svg-box')
    expect(svgBox).toBeTruthy()

    const svg = page.root.querySelector('svg')
    expect(svg).toBeTruthy()
    expect(svg.getAttribute('viewBox')).toBe('0 0 200 100')
    expect(svg.getAttribute('width')).toBe('200')
    expect(svg.getAttribute('height')).toBe('100')

    const textElement = page.root.querySelector('text')
    expect(textElement).toBeTruthy()
    expect(textElement.getAttribute('id')).toBe('test-text-id')
    expect(textElement.getAttribute('font-family')).toBe('Arial')
    expect(textElement.getAttribute('font-size')).toBe('16')
    expect(textElement.getAttribute('fill')).toBe('#000000')

    const useElement = page.root.querySelector('use')
    expect(useElement).toBeTruthy()
  })

  it('should not render anything for image type', async () => {
    const testData = createImageCardData()
    const page = await newSpecPage({
      components: [KitSvg],
      html: `<kit-svg></kit-svg>`,
    })

    page.root.data = testData
    await page.waitForChanges()

    const svgBox = page.root.querySelector('.kit-svg-box')
    expect(svgBox).toBeFalsy()

    const svg = page.root.querySelector('svg')
    expect(svg).toBeFalsy()
  })

  it('should handle text wrapping when text exceeds width', async () => {
    // Mock canvas context to return specific widths for text measurement
    mockContext.measureText = jest
      .fn()
      .mockReturnValueOnce({ width: 50 }) // 'H'
      .mockReturnValueOnce({ width: 50 }) // 'e'
      .mockReturnValueOnce({ width: 50 }) // 'l'
      .mockReturnValueOnce({ width: 50 }) // 'l'
      .mockReturnValueOnce({ width: 50 }) // 'o'
      .mockReturnValueOnce({ width: 50 }) // ' ' - this should trigger line break
      .mockReturnValueOnce({ width: 50 }) // 'W'
      .mockReturnValueOnce({ width: 50 }) // 'o'
      .mockReturnValueOnce({ width: 50 }) // 'r'
      .mockReturnValueOnce({ width: 50 }) // 'l'
      .mockReturnValueOnce({ width: 50 }) // 'd'

    const testData = createTextCardData({
      text: 'Hello World',
      width: 200, // Small width to force wrapping
      fontSize: 16,
    })

    const page = await newSpecPage({
      components: [KitSvg],
      html: `<kit-svg></kit-svg>`,
    })

    page.root.data = testData
    await page.waitForChanges()

    const tspans = page.root.querySelectorAll('tspan')
    expect(tspans.length).toBeGreaterThan(1) // Should have multiple lines
  })

  it('should apply font styles correctly', async () => {
    const testData = createTextCardData({
      fontFamily: 'Helvetica',
      fontSize: 20,
      fontWeight: 'bold',
      fontStyle: 'italic',
      decoration: 'underline',
      color: '#ff0000',
    })

    const page = await newSpecPage({
      components: [KitSvg],
      html: `<kit-svg></kit-svg>`,
    })

    page.root.data = testData
    await page.waitForChanges()

    const textElement = page.root.querySelector('text')
    expect(textElement.getAttribute('font-family')).toBe('Helvetica')
    expect(textElement.getAttribute('font-size')).toBe('20')
    expect(textElement.getAttribute('font-weight')).toBe('bold')
    expect(textElement.getAttribute('font-style')).toBe('italic')
    expect(textElement.getAttribute('text-decoration')).toBe('underline')
    expect(textElement.getAttribute('fill')).toBe('#ff0000')
  })

  it('should handle empty text gracefully', async () => {
    const testData = createTextCardData({
      text: '',
    })

    const page = await newSpecPage({
      components: [KitSvg],
      html: `<kit-svg></kit-svg>`,
    })

    page.root.data = testData
    await page.waitForChanges()

    const textElement = page.root.querySelector('text')
    expect(textElement).toBeTruthy()

    const tspan = page.root.querySelector('tspan')
    expect(tspan).toBeFalsy()
  })

  it('should handle canvas context not available', async () => {
    // Mock canvas to return null context
    mockCanvas.getContext = jest.fn().mockReturnValue(null)

    const testData = createTextCardData({
      text: 'Test text',
    })

    const page = await newSpecPage({
      components: [KitSvg],
      html: `<kit-svg></kit-svg>`,
    })

    page.root.data = testData
    await page.waitForChanges()

    // Should still render with fallback tspan
    const tspan = page.root.querySelector('tspan')
    expect(tspan).toBeTruthy()
    expect(tspan.textContent).toBe('Test text')
    expect(tspan.getAttribute('dy')).toBe('0')
  })

  it('should set correct SVG viewBox and dimensions', async () => {
    const testData = createTextCardData({
      width: 300,
      height: 150,
    })

    const page = await newSpecPage({
      components: [KitSvg],
      html: `<kit-svg></kit-svg>`,
    })

    page.root.data = testData
    await page.waitForChanges()

    const svg = page.root.querySelector('svg')
    expect(svg.getAttribute('viewBox')).toBe('0 0 300 150')
    expect(svg.getAttribute('width')).toBe('300')
    expect(svg.getAttribute('height')).toBe('150')
  })

  it('should use correct line height for multiple lines', async () => {
    // Force text wrapping by making each character exceed width
    mockContext.measureText = jest.fn().mockReturnValue({ width: 100 })

    const testData = createTextCardData({
      text: 'ABC',
      width: 50,
      fontSize: 20,
    })

    const page = await newSpecPage({
      components: [KitSvg],
      html: `<kit-svg></kit-svg>`,
    })

    page.root.data = testData
    await page.waitForChanges()

    const tspans = page.root.querySelectorAll('tspan')
    if (tspans.length > 1) {
      // Line height should be fontSize * 1.4 = 20 * 1.4 = 28
      expect(tspans[1].getAttribute('dy')).toBe('28')
    }
  })

  it('should handle special characters in text', async () => {
    const testData = createTextCardData({
      text: 'Hello\n世界! 🌍',
    })

    const page = await newSpecPage({
      components: [KitSvg],
      html: `<kit-svg></kit-svg>`,
    })

    page.root.data = testData
    await page.waitForChanges()

    const textElement = page.root.querySelector('text')
    expect(textElement).toBeTruthy()
    expect(page.root.textContent).toContain('Hello\n世界! 🌍')
  })

  it('should render defs and g elements correctly', async () => {
    const testData = createTextCardData()
    const page = await newSpecPage({
      components: [KitSvg],
      html: `<kit-svg></kit-svg>`,
    })

    page.root.data = testData
    await page.waitForChanges()

    const defs = page.root.querySelector('defs')
    expect(defs).toBeTruthy()

    const g = page.root.querySelector('defs g')
    expect(g).toBeTruthy()
    expect(g.getAttribute('id')).toBe('test-text-id')

    const textInG = page.root.querySelector('defs g text')
    expect(textInG).toBeTruthy()
  })

  it('should handle different font weights and styles', async () => {
    const testData = createTextCardData({
      fontWeight: '600',
      fontStyle: 'italic',
      decoration: 'line-through',
    })

    const page = await newSpecPage({
      components: [KitSvg],
      html: `<kit-svg></kit-svg>`,
    })

    page.root.data = testData
    await page.waitForChanges()

    const textElement = page.root.querySelector('text')
    expect(textElement.getAttribute('font-weight')).toBe('600')
    expect(textElement.getAttribute('font-style')).toBe('italic')
    expect(textElement.getAttribute('text-decoration')).toBe('line-through')
  })
})
