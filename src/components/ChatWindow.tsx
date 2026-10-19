import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import type { Chat, ChatMessage } from '../types'
import { formatTime } from '../utils/format'
import { Avatar } from './Avatar'
import { BackIcon, CheckIcon, ClockIcon, ErrorIcon, SendIcon } from './icons'
import styles from './ChatWindow.module.css'

interface ChatWindowProps {
  chat: Chat
  onBack: () => void
  onSend: (chatId: string, text: string) => void
}

export function ChatWindow({ chat, onBack, onSend }: ChatWindowProps) {
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' })
  }, [chat.id, chat.messages.length])

  return (
    <section className={styles.window}>
      <header className={styles.header}>
        <button className={styles.back} onClick={onBack} aria-label="Назад к чатам">
          <BackIcon />
        </button>
        <Avatar chatId={chat.id} name={chat.name} size={42} />
        <div className={styles.title}>
          <span className={styles.name}>{chat.name}</span>
          <span className={styles.subtitle}>{chat.name === chat.id ? 'Telegram' : chat.id}</span>
        </div>
      </header>

      <div className={styles.messages}>
        <div className={styles.messagesInner}>
          {chat.messages.length === 0 && (
            <p className={styles.placeholder}>Напишите первое сообщение</p>
          )}
          {chat.messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          <div ref={endRef} />
        </div>
      </div>

      <Composer key={chat.id} onSend={(text) => onSend(chat.id, text)} />
    </section>
  )
}

function MessageBubble({ message }: { message: ChatMessage }) {
  return (
    <div className={`${styles.bubble} ${message.outgoing ? styles.outgoing : styles.incoming}`}>
      <span className={styles.text}>{message.text}</span>
      <span className={styles.meta}>
        {formatTime(message.timestamp)}
        {message.outgoing && <MessageStatusIcon status={message.status} />}
      </span>
    </div>
  )
}

function MessageStatusIcon({ status }: { status: ChatMessage['status'] }) {
  switch (status) {
    case 'pending':
      return <ClockIcon width={14} height={14} aria-label="Отправляется" />
    case 'sent':
      return <CheckIcon width={16} height={16} aria-label="Отправлено" />
    case 'failed':
      return <ErrorIcon className={styles.failed} width={14} height={14} aria-label="Не отправлено" />
  }
}

function Composer({ onSend }: { onSend: (text: string) => void }) {
  const [text, setText] = useState('')
  const canSend = text.trim().length > 0

  function send() {
    if (!canSend) return
    onSend(text.trim())
    setText('')
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    send()
  }

  // Enter sends, Shift+Enter adds a line break — as in Telegram.
  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault()
      send()
    }
  }

  return (
    <form className={styles.composer} onSubmit={handleSubmit}>
      <textarea
        className={styles.input}
        value={text}
        onChange={(event) => setText(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Сообщение"
        aria-label="Сообщение"
        rows={1}
        autoFocus
      />
      <button className={styles.send} type="submit" disabled={!canSend} aria-label="Отправить">
        <SendIcon />
      </button>
    </form>
  )
}
