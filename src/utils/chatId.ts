/**
 * Converts what the user typed (a phone number like "+7 (900) 123-45-67" or a
 * Telegram chat id) into the chatId format GREEN-API expects for Telegram.
 * A leading minus is kept because Telegram group ids are negative.
 */
export function toChatId(input: string): string | null {
  const trimmed = input.trim()
  const digits = trimmed.replace(/\D/g, '')
  if (digits.length < 5 || digits.length > 20) return null
  return trimmed.startsWith('-') ? `-${digits}` : digits
}

/** Drops a "@c.us"-style suffix so the same chat always maps to one key. */
export function chatKey(chatId: string): string {
  return chatId.split('@')[0]
}
