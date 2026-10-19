import { describe, expect, it } from 'vitest'
import { parseTextMessage, type NotificationBody } from './notifications'

const incomingText: NotificationBody = {
  typeWebhook: 'incomingMessageReceived',
  timestamp: 1_700_000_000,
  idMessage: 'BAE5F4886F6F2D05',
  senderData: { chatId: '79001234567', chatName: '', senderName: 'Иван' },
  messageData: { typeMessage: 'textMessage', textMessageData: { textMessage: 'Привет!' } },
}

describe('parseTextMessage', () => {
  it('parses an incoming text message', () => {
    expect(parseTextMessage(incomingText)).toEqual({
      message: {
        id: 'BAE5F4886F6F2D05',
        chatId: '79001234567',
        text: 'Привет!',
        timestamp: 1_700_000_000_000,
        outgoing: false,
        status: 'sent',
      },
      chatName: 'Иван',
    })
  })

  it('parses extended text and marks messages sent from the phone as outgoing', () => {
    const result = parseTextMessage({
      ...incomingText,
      typeWebhook: 'outgoingMessageReceived',
      messageData: { typeMessage: 'extendedTextMessage', extendedTextMessageData: { text: 'Ссылка' } },
    })

    expect(result?.message).toMatchObject({ text: 'Ссылка', outgoing: true })
  })

  it('ignores non-text messages and other notification types', () => {
    expect(
      parseTextMessage({ ...incomingText, messageData: { typeMessage: 'imageMessage' } }),
    ).toBeNull()
    expect(parseTextMessage({ typeWebhook: 'stateInstanceChanged', timestamp: 1 })).toBeNull()
  })
})
