import { useMemo } from 'react'
import { createGreenApiClient } from '../api/greenApi'
import { useChats } from '../hooks/useChats'
import { useNotificationPolling } from '../hooks/useNotificationPolling'
import type { Credentials } from '../types'
import { ChatWindow } from './ChatWindow'
import { Sidebar } from './Sidebar'
import styles from './Messenger.module.css'

interface MessengerProps {
  credentials: Credentials
  onLogout: () => void
}

export function Messenger({ credentials, onLogout }: MessengerProps) {
  const client = useMemo(() => createGreenApiClient(credentials), [credentials])
  const { chats, activeChat, openChat, closeChat, receiveMessage, sendMessage } = useChats(
    client,
    credentials.idInstance,
  )
  const { error: pollingError } = useNotificationPolling(client, receiveMessage)

  return (
    <div className={`${styles.layout} ${activeChat ? styles.chatOpen : ''}`}>
      <Sidebar
        idInstance={credentials.idInstance}
        chats={chats}
        activeChatId={activeChat?.id ?? null}
        onOpenChat={openChat}
        onLogout={onLogout}
      />

      <main className={styles.main}>
        {pollingError && (
          <div className={styles.banner} role="status">
            Не удаётся получить новые сообщения: {pollingError} Повторяем попытку…
          </div>
        )}
        {activeChat ? (
          <ChatWindow chat={activeChat} onBack={closeChat} onSend={sendMessage} />
        ) : (
          <div className={styles.placeholder}>
            <span>Выберите чат или создайте новый</span>
          </div>
        )}
      </main>
    </div>
  )
}
