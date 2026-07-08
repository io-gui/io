import { describe, it, expect } from 'vitest'
import {
  DEFAULT_SIZE,
  DEFAULT_AUTO_BUDGET_PX,
  sizeToFlex,
  isAutoSize,
  isValidSize,
  parseSizeBudgetPx,
  layoutSizeToJSON,
  applyLayoutSizeProps,
  ensureOneChildHasAutoSize,
} from './layoutSize.js'

describe('layoutSize', () => {
  describe('sizeToFlex', () => {
    it('should map auto to flex grow', () => {
      expect(sizeToFlex('auto')).toBe('1 1 auto')
    })

    it('should map px auto to flex grow', () => {
      expect(sizeToFlex('100px auto')).toBe('1 1 auto')
    })

    it('should map percent auto to flex grow', () => {
      expect(sizeToFlex('20% auto')).toBe('1 1 auto')
    })

    it('should map px size to fixed flex basis', () => {
      expect(sizeToFlex('200px')).toBe('0 0 200px')
    })

    it('should map percent size to fixed flex basis', () => {
      expect(sizeToFlex('50%')).toBe('0 0 50%')
    })
  })

  describe('isAutoSize', () => {
    it('should return true for auto', () => {
      expect(isAutoSize('auto')).toBe(true)
    })

    it('should return true for explicit auto sizes', () => {
      expect(isAutoSize('100px auto')).toBe(true)
      expect(isAutoSize('20% auto')).toBe(true)
    })

    it('should return false for fixed sizes', () => {
      expect(isAutoSize('200px')).toBe(false)
      expect(isAutoSize('50%')).toBe(false)
    })
  })

  describe('isValidSize', () => {
    it('should accept auto', () => {
      expect(isValidSize('auto')).toBe(true)
    })

    it('should accept fixed px and percent', () => {
      expect(isValidSize('200px')).toBe(true)
      expect(isValidSize('33.33%')).toBe(true)
    })

    it('should accept explicit auto sizes', () => {
      expect(isValidSize('100px auto')).toBe(true)
      expect(isValidSize('20% auto')).toBe(true)
    })

    it('should reject invalid values', () => {
      expect(isValidSize('1 1 auto')).toBe(false)
      expect(isValidSize('200')).toBe(false)
      expect(isValidSize('auto 100px')).toBe(false)
    })
  })

  describe('parseSizeBudgetPx', () => {
    it('should use default budget for plain auto', () => {
      expect(parseSizeBudgetPx('auto', 1000)).toBe(DEFAULT_AUTO_BUDGET_PX)
    })

    it('should parse fixed px values', () => {
      expect(parseSizeBudgetPx('350px', 1000)).toBe(350)
    })

    it('should parse fixed percent relative to container', () => {
      expect(parseSizeBudgetPx('10%', 1000)).toBe(100)
    })

    it('should parse explicit px auto budget', () => {
      expect(parseSizeBudgetPx('100px auto', 1000)).toBe(100)
    })

    it('should parse explicit percent auto budget', () => {
      expect(parseSizeBudgetPx('20% auto', 1000)).toBe(200)
    })
  })

  describe('layoutSizeToJSON', () => {
    it('should omit default values', () => {
      expect(layoutSizeToJSON({ size: DEFAULT_SIZE })).toEqual({})
    })

    it('should include non-default fixed size', () => {
      expect(layoutSizeToJSON({ size: '200px' })).toEqual({ size: '200px' })
    })

    it('should include non-default explicit auto size', () => {
      expect(layoutSizeToJSON({ size: '100px auto' })).toEqual({ size: '100px auto' })
    })
  })

  describe('applyLayoutSizeProps', () => {
    it('should apply defaults when omitted', () => {
      expect(applyLayoutSizeProps({})).toEqual({ size: DEFAULT_SIZE })
    })

    it('should preserve provided values', () => {
      expect(applyLayoutSizeProps({ size: '300px' })).toEqual({ size: '300px' })
      expect(applyLayoutSizeProps({ size: '100px auto' })).toEqual({ size: '100px auto' })
    })
  })

  describe('ensureOneChildHasAutoSize', () => {
    it('should promote second child when none grow', () => {
      const children = [{ size: '200px' }, { size: '300px' }]
      ensureOneChildHasAutoSize(children)
      expect(children[1].size).toBe('auto')
    })

    it('should do nothing when one child already grows', () => {
      const children = [{ size: '200px' }, { size: 'auto' }]
      ensureOneChildHasAutoSize(children)
      expect(children[0].size).toBe('200px')
      expect(children[1].size).toBe('auto')
    })

    it('should recognize explicit auto sizes', () => {
      const children = [{ size: '200px' }, { size: '100px auto' }]
      ensureOneChildHasAutoSize(children)
      expect(children[0].size).toBe('200px')
      expect(children[1].size).toBe('100px auto')
    })
  })
})
