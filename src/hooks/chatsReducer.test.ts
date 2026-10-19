import { describe, expect, it } from 'vitest'
import type { ChatMessage } from '../types'
import { chatsReducer, initialChatsState, sortChats, type ChatsState } from './chatsReducer'

function message(overrides: Partial<ChatMessage> = {}): ChatMessage {
  return {
    id: 'msg-1',
    chatId: '79001234567',
    text: 'Привет',
    timestamp: 1_000,
    outgoing: false,
    status: 'sent',
    ...overrides,
  }
}

describe('chatsReducer', () => {
  it('creates a chat on open and makes it active', () => {
    const state = chatsReducer(initialChatsState, { type: 'openChat', chatId: '79001234567' })

    expect(state.activeChatId).toBe('79001234567')
    expect(state.chats['79001234567']).toMatchObject({ name: '79001234567', messages: [] })
  })

  it('counts unread incoming messages only for inactive chats', () => {
    let state = chatsReducer(initialChatsState, { type: 'addMessage', message: message() })
    expect(state.chats['79001234567'].unreadCount).toBe(1)

    state = chatsReducer(state, { type: 'openChat', chatId: '79001234567' })
    expect(state.chats['79001234567'].unreadCount).toBe(0)

    state = chatsReducer(state, { type: 'addMessage', message: message({ id: 'msg-2' }) })
    expect(state.chats['79001234567'].unreadCount).toBe(0)
  })

  it('ignores a message it already has', () => {
    const once = chatsReducer(initialChatsState, { type: 'addMessage', message: message() })
    const twice = chatsReducer(once, { type: 'addMessage', message: message() })

    expect(twice).toBe(once)
  })

  it('maps chat ids with a suffix onto the same chat', () => {
    const state = chatsReducer(initialChatsState, {
      type: 'addMessage',
      message: message({ chatId: '79001234567@c.us' }),
    })

    expect(Object.keys(state.chats)).toEqual(['79001234567'])
  })

  it('takes the contact name from the first message that has one', () => {
    let state = chatsReducer(initialChatsState, { type: 'openChat', chatId: '79001234567' })
    state = chatsReducer(state, { type: 'addMessage', message: message(), chatName: 'Иван' })
    state = chatsReducer(state, {
      type: 'addMessage',
      message: message({ id: 'msg-2' }),
      chatName: 'Другое имя',
    })

    expect(state.chats['79001234567'].name).toBe('Иван')
  })

  it('confirms a pending message with the id returned by the API', () => {
    const pending = message({ id: 'local-1', outgoing: true, status: 'pending' })
    let state = chatsReducer(initialChatsState, { type: 'addMessage', message: pending })
    state = chatsReducer(state, {
      type: 'updateMessage',
      chatId: '79001234567',
      messageId: 'local-1',
      patch: { id: 'BAE5', status: 'sent' },
    })

    expect(state.chats['79001234567'].messages).toEqual([{ ...pending, id: 'BAE5', status: 'sent' }])
  })

  it('drops the pending copy when the API echo arrived first', () => {
    const pending = message({ id: 'local-1', outgoing: true, status: 'pending' })
    const echo = message({ id: 'BAE5', outgoing: true, timestamp: 2_000 })
    let state: ChatsState = chatsReducer(initialChatsState, { type: 'addMessage', message: pending })
    state = chatsReducer(state, { type: 'addMessage', message: echo })
    state = chatsReducer(state, {
      type: 'updateMessage',
      chatId: '79001234567',
      messageId: 'local-1',
      patch: { id: 'BAE5', status: 'sent' },
    })

    expect(state.chats['79001234567'].messages).toEqual([echo])
  })
})

describe('sortChats', () => {
  it('puts the chat with the latest message first', () => {
    let state = chatsReducer(initialChatsState, { type: 'openChat', chatId: '111111' })
    state = chatsReducer(state, {
      type: 'addMessage',
      message: message({ chatId: '222222', timestamp: 5_000 }),
    })

    expect(sortChats(state.chats).map((chat) => chat.id)).toEqual(['222222', '111111'])
  })
})
