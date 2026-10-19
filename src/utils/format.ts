const timeFormat = new Intl.DateTimeFormat('ru-RU', { hour: '2-digit', minute: '2-digit' })
const dateFormat = new Intl.DateTimeFormat('ru-RU', { day: '2-digit', month: '2-digit' })

export function formatTime(timestamp: number): string {
  return timeFormat.format(timestamp)
}

/** Time for today's messages, date for older ones — like the Telegram chat list. */
export function formatListTime(timestamp: number, now = Date.now()): string {
  const isToday = new Date(timestamp).toDateString() === new Date(now).toDateString()
  return isToday ? timeFormat.format(timestamp) : dateFormat.format(timestamp)
}

/** Two letters for the avatar; chats named by a number show its last two digits. */
export function initials(name: string): string {
  if (/^[\d\s()+-]+$/.test(name)) return name.replace(/\D/g, '').slice(-2)
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase()
}

const AVATAR_COLORS = ['#e17076', '#7bc862', '#65aadd', '#a695e7', '#ee7aae', '#6ec9cb', '#faa774']

/** Stable avatar color per chat, as Telegram does. */
export function avatarColor(chatId: string): string {
  let hash = 0
  for (const char of chatId) hash = (hash * 31 + char.charCodeAt(0)) | 0
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}
