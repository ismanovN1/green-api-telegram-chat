import type { ChatMessage } from '../types'

export interface Notification {
  receiptId: number
  body: NotificationBody
}

export interface NotificationBody {
  typeWebhook: string
  /** Unix time in seconds */
  timestamp: number
  idMessage?: string
  senderData?: {
    chatId: string
    chatName?: string
    senderName?: string
  }
  messageData?: {
    typeMessage: string
    textMessageData?: { textMessage: string }
    extendedTextMessageData?: { text: string }
  }
}

export interface ReceivedMessage {
  message: ChatMessage
  chatName?: string
}

/** Message webhooks we display, mapped to whether the message was sent by us. */
const OUTGOING_BY_WEBHOOK: Record<string, boolean> = {
  incomingMessageReceived: false,
  // sent from the Telegram app on the instance's own account
  outgoingMessageReceived: true,
  // sent through the API, including from this app
  outgoingAPIMessageReceived: true,
}

/** Extracts a text message from a notification; returns null for anything else. */
export function parseTextMessage(body: NotificationBody): ReceivedMessage | null {
  const outgoing = OUTGOING_BY_WEBHOOK[body.typeWebhook]
  const { idMessage, senderData, messageData } = body
  if (outgoing === undefined || !idMessage || !senderData || !messageData) return null

  const text =
    messageData.textMessageData?.textMessage ?? messageData.extendedTextMessageData?.text
  if (text === undefined) return null

  return {
    message: {
      id: idMessage,
      chatId: senderData.chatId,
      text,
      timestamp: body.timestamp * 1000,
      outgoing,
      status: 'sent',
    },
    chatName: outgoing ? senderData.chatName : senderData.chatName || senderData.senderName,
  }
}
