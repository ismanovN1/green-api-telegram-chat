import { avatarColor, initials } from '../utils/format'
import styles from './Avatar.module.css'

interface AvatarProps {
  chatId: string
  name: string
  size?: number
}

export function Avatar({ chatId, name, size = 54 }: AvatarProps) {
  return (
    <div
      className={styles.avatar}
      style={{ width: size, height: size, fontSize: size * 0.38, background: avatarColor(chatId) }}
      aria-hidden
    >
      {initials(name)}
    </div>
  )
}
