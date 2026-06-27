import { describe, it, expect } from 'vitest'
import { resolveInitialLang } from './resolveInitialLang'

describe('resolveInitialLang', () => {
  it('honors a valid stored value', () => {
    expect(resolveInitialLang('zh', 'en-US')).toBe('zh')
    expect(resolveInitialLang('en', 'zh-CN')).toBe('en')
  })
  it('falls back to navigator when stored is missing/invalid', () => {
    expect(resolveInitialLang(null, 'zh-CN')).toBe('zh')
    expect(resolveInitialLang('garbage', 'zh')).toBe('zh')
    expect(resolveInitialLang(null, 'en-GB')).toBe('en')
  })
  it('defaults to en for non-zh navigator languages', () => {
    expect(resolveInitialLang(null, 'fr-FR')).toBe('en')
    expect(resolveInitialLang(null, '')).toBe('en')
  })
})
