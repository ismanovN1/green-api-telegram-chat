import { describe, expect, it } from 'vitest'
import { chatKey, toChatId } from './chatId'

describe('toChatId', () => {
  it('keeps only the digits of a phone number', () => {
    expect(toChatId(' +7 (900) 123-45-67 ')).toBe('79001234567')
  })

  it('keeps the minus of a group id', () => {
    expect(toChatId('-1001234567890')).toBe('-1001234567890')
  })

  it('rejects input that cannot be a chat', () => {
    expect(toChatId('')).toBeNull()
    expect(toChatId('abc')).toBeNull()
    expect(toChatId('123')).toBeNull()
  })
})

describe('chatKey', () => {
  it('drops the domain suffix', () => {
    expect(chatKey('79001234567@c.us')).toBe('79001234567')
    expect(chatKey('79001234567')).toBe('79001234567')
  })
})
