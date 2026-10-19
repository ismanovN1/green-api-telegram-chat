export interface Credentials {
  apiUrl: string
  idInstance: string
  apiTokenInstance: string
}

export type MessageStatus = 'pending' | 'sent' | 'failed'

export interface ChatMessage {
  id: string
  chatId: string
  text: string
  /** Unix time in milliseconds */
  timestamp: number
  outgoing: boolean
  status: MessageStatus
}

export interface Chat {
  id: string
  name: string
  messages: ChatMessage[]
  unreadCount: number
}
