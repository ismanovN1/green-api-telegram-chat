import { useEffect, useRef, useState } from 'react'
import type { GreenApiClient } from '../api/greenApi'
import { parseTextMessage, type ReceivedMessage } from '../api/notifications'

const RETRY_DELAY_MS = 5000

/**
 * Reads the instance's notification queue in a loop: receiveNotification
 * long-polls for the next notification, and every notification is deleted
 * once handled so the queue moves on — including ones the chat doesn't show.
 */
export function useNotificationPolling(
  client: GreenApiClient,
  onMessage: (received: ReceivedMessage) => void,
) {
  const [error, setError] = useState<string | null>(null)
  const onMessageRef = useRef(onMessage)

  useEffect(() => {
    onMessageRef.current = onMessage
  })

  useEffect(() => {
    const controller = new AbortController()
    const { signal } = controller

    async function poll() {
      while (!signal.aborted) {
        try {
          const notification = await client.receiveNotification(signal)
          setError(null)
          if (!notification) continue

          const received = parseTextMessage(notification.body)
          if (received) onMessageRef.current(received)
          await client.deleteNotification(notification.receiptId, signal)
        } catch (pollError) {
          if (signal.aborted) return
          setError(pollError instanceof Error ? pollError.message : 'Ошибка получения сообщений.')
          await wait(RETRY_DELAY_MS, signal)
        }
      }
    }

    void poll()
    return () => controller.abort()
  }, [client])

  return { error }
}

function wait(ms: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve) => {
    const timer = setTimeout(resolve, ms)
    signal.addEventListener('abort', () => {
      clearTimeout(timer)
      resolve()
    })
  })
}
