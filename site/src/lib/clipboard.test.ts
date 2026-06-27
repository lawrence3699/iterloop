import { describe, it, expect, vi, beforeEach } from 'vitest'
import { copyText } from './clipboard'

describe('copyText', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('returns true when clipboard write succeeds', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    vi.stubGlobal('navigator', { clipboard: { writeText } })
    expect(await copyText('hi')).toBe(true)
    expect(writeText).toHaveBeenCalledWith('hi')
  })

  it('returns false when clipboard write rejects', async () => {
    vi.stubGlobal('navigator', { clipboard: { writeText: vi.fn().mockRejectedValue(new Error('x')) } })
    expect(await copyText('hi')).toBe(false)
  })

  it('returns false when clipboard API is missing', async () => {
    vi.stubGlobal('navigator', {})
    expect(await copyText('hi')).toBe(false)
  })
})
