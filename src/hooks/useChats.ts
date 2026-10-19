import { useCallback, useEffect, useReducer } from 'react'
import type { GreenApiClient } from '../api/greenApi'
import type { ReceivedMessage } from '../api/notifications'
import type { Chat } from '../types'
import { readJson, writeJson } from '../utils/storage'
import { chatsReducer, initialChatsState, sortChats, type ChatsState } from './chatsReducer'

/**
 * Chat list and message history for one instance. History is kept in
 * localStorage because receiveNotification hands out each message only once.
 */
export function useChats(client: GreenApiClient, idInstance: string) {
  const storageKey = `green-api-chats:${idInstance}`
  const [state, dispatch] = useReducer(chatsReducer, storageKey, loadState)

  useEffect(() => {
    writeJson(storageKey, state.chats)
  }, [storageKey, state.chats])

  const openChat = useCallback((chatId: string) => dispatch({ type: 'openChat', chatId }), [])
  const closeChat = useCallback(() => dispatch({ type: 'closeChat' }), [])

  const receiveMessage = useCallback(
    ({ message, chatName }: ReceivedMessage) => dispatch({ type: 'addMessage', message, chatName }),
    [],
  )

  const sendMessage = useCallback(
    async (chatId: string, text: string) => {
      const localId = `local-${crypto.randomUUID()}`
      dispatch({
        type: 'addMessage',
        message: { id: localId, chatId, text, timestamp: Date.now(), outgoing: true, status: 'pending' },
      })
      try {
        const { idMessage } = await client.sendMessage(chatId, text)
        dispatch({ type: 'updateMessage', chatId, messageId: localId, patch: { id: idMessage, status: 'sent' } })
      } catch {
        dispatch({ type: 'updateMessage', chatId, messageId: localId, patch: { status: 'failed' } })
      }
    },
    [client],
  )

  return {
    chats: sortChats(state.chats),
    activeChat: state.activeChatId ? state.chats[state.activeChatId] : null,
    openChat,
    closeChat,
    receiveMessage,
    sendMessage,
  }
}

function loadState(storageKey: string): ChatsState {
  const chats = readJson<Record<string, Chat>>(storageKey)
  if (!chats) return initialChatsState

  // A message still pending when the page was closed never got its confirmation.
  for (const chat of Object.values(chats)) {
    chat.messages = chat.messages.map((message) =>
      message.status === 'pending' ? { ...message, status: 'failed' } : message,
    )
  }
  return { chats, activeChatId: null }
}
