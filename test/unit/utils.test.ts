import { describe, expect, it } from 'vitest'

describe('utils', () => {
  it('should pass a simple test', () => {
    expect(1 + 1).toBe(2)
  })

  it('should test string manipulation', () => {
    const str = 'hello'
    expect(str.toUpperCase()).toBe('HELLO')
  })
})
