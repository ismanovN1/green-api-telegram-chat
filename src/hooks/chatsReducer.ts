import type { Chat, ChatMessage } from '../types'
import { chatKey } from '../utils/chatId'

export interface ChatsState {
  chats: Record<string, Chat>
  activeChatId: string | null
}

export type ChatsAction =
  | { type: 'openChat'; chatId: string }
  | { type: 'closeChat' }
  | { type: 'addMessage'; message: ChatMessage; chatName?: string }
  | { type: 'updateMessage'; chatId: string; messageId: string; patch: Partial<ChatMessage> }

export const initialChatsState: ChatsState = { chats: {}, activeChatId: null }

function emptyChat(id: string): Chat {
  return { id, name: id, messages: [], unreadCount: 0 }
}

export function chatsReducer(state: ChatsState, action: ChatsAction): ChatsState {
  switch (action.type) {
    case 'openChat': {
      const id = chatKey(action.chatId)
      const chat = state.chats[id] ?? emptyChat(id)
      return {
        activeChatId: id,
        chats: { ...state.chats, [id]: { ...chat, unreadCount: 0 } },
      }
    }

    case 'closeChat':
      return { ...state, activeChatId: null }

    case 'addMessage': {
      const id = chatKey(action.message.chatId)
      const chat = state.chats[id] ?? emptyChat(id)
      // outgoingAPIMessageReceived echoes messages this app has already shown
      if (chat.messages.some((message) => message.id === action.message.id)) return state

      const isUnread = !action.message.outgoing && state.activeChatId !== id
      const updated: Chat = {
        ...chat,
        name: chat.name === id && action.chatName ? action.chatName : chat.name,
        messages: [...chat.messages, { ...action.message, chatId: id }],
        unreadCount: chat.unreadCount + (isUnread ? 1 : 0),
      }
      return { ...state, chats: { ...state.chats, [id]: updated } }
    }

    case 'updateMessage': {
      const chat = state.chats[action.chatId]
      if (!chat) return state

      const { id: newId } = action.patch
      // The API echo may arrive before the send request resolves; keep only one copy.
      const echoed =
        newId !== undefined &&
        newId !== action.messageId &&
        chat.messages.some((message) => message.id === newId)

      const messages = echoed
        ? chat.messages.filter((message) => message.id !== action.messageId)
        : chat.messages.map((message) =>
            message.id === action.messageId ? { ...message, ...action.patch } : message,
          )
      return { ...state, chats: { ...state.chats, [chat.id]: { ...chat, messages } } }
    }
  }
}

/** Chats ordered like the Telegram list: most recent activity first. */
export function sortChats(chats: Record<string, Chat>): Chat[] {
  const lastActivity = (chat: Chat) => chat.messages.at(-1)?.timestamp ?? 0
  return Object.values(chats).sort((a, b) => lastActivity(b) - lastActivity(a))
}
