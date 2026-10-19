import { useState, type FormEvent } from 'react'
import type { Chat } from '../types'
import { toChatId } from '../utils/chatId'
import { formatListTime } from '../utils/format'
import { Avatar } from './Avatar'
import { LogoutIcon, PlusIcon } from './icons'
import styles from './Sidebar.module.css'

interface SidebarProps {
  idInstance: string
  chats: Chat[]
  activeChatId: string | null
  onOpenChat: (chatId: string) => void
  onLogout: () => void
}

export function Sidebar({ idInstance, chats, activeChatId, onOpenChat, onLogout }: SidebarProps) {
  return (
    <aside className={styles.sidebar}>
      <header className={styles.header}>
        <div className={styles.account}>
          <span className={styles.accountTitle}>Чаты</span>
          <span className={styles.accountId}>Инстанс {idInstance}</span>
        </div>
        <button className={styles.iconButton} onClick={onLogout} title="Выйти" aria-label="Выйти">
          <LogoutIcon />
        </button>
      </header>

      <NewChatForm onCreate={onOpenChat} />

      {chats.length === 0 ? (
        <p className={styles.empty}>
          Чатов пока нет. Введите номер телефона или ID чата Telegram, чтобы начать переписку.
        </p>
      ) : (
        <ul className={styles.list}>
          {chats.map((chat) => (
            <li key={chat.id}>
              <ChatListItem
                chat={chat}
                isActive={chat.id === activeChatId}
                onSelect={() => onOpenChat(chat.id)}
              />
            </li>
          ))}
        </ul>
      )}
    </aside>
  )
}

function NewChatForm({ onCreate }: { onCreate: (chatId: string) => void }) {
  const [value, setValue] = useState('')
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const chatId = toChatId(value)
    if (!chatId) {
      setError('Введите номер в международном формате, например 79001234567')
      return
    }
    onCreate(chatId)
    setValue('')
    setError(null)
  }

  return (
    <form className={styles.newChat} onSubmit={handleSubmit}>
      <div className={styles.newChatRow}>
        <input
          className={styles.search}
          value={value}
          onChange={(event) => {
            setValue(event.target.value)
            setError(null)
          }}
          inputMode="tel"
          placeholder="Номер телефона или ID чата"
          aria-label="Номер телефона или ID чата"
          aria-invalid={error !== null}
        />
        <button className={styles.iconButton} type="submit" title="Новый чат" aria-label="Новый чат">
          <PlusIcon />
        </button>
      </div>
      {error && <p className={styles.formError}>{error}</p>}
    </form>
  )
}

interface ChatListItemProps {
  chat: Chat
  isActive: boolean
  onSelect: () => void
}

function ChatListItem({ chat, isActive, onSelect }: ChatListItemProps) {
  const lastMessage = chat.messages.at(-1)

  return (
    <button
      className={`${styles.chat} ${isActive ? styles.chatActive : ''}`}
      onClick={onSelect}
      aria-current={isActive}
    >
      <Avatar chatId={chat.id} name={chat.name} />
      <div className={styles.chatBody}>
        <div className={styles.chatRow}>
          <span className={styles.chatName}>{chat.name}</span>
          {lastMessage && (
            <span className={styles.chatTime}>{formatListTime(lastMessage.timestamp)}</span>
          )}
        </div>
        <div className={styles.chatRow}>
          <span className={styles.chatPreview}>
            {lastMessage ? (
              <>
                {lastMessage.outgoing && <span className={styles.chatPreviewSender}>Вы: </span>}
                {lastMessage.text}
              </>
            ) : (
              'Нет сообщений'
            )}
          </span>
          {chat.unreadCount > 0 && <span className={styles.badge}>{chat.unreadCount}</span>}
        </div>
      </div>
    </button>
  )
}
