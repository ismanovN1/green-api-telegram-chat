import { useState, type FormEvent } from 'react'
import { createGreenApiClient, defaultApiUrl, type InstanceState } from '../api/greenApi'
import type { Credentials } from '../types'
import { TelegramLogo } from './icons'
import styles from './LoginScreen.module.css'

const STATE_MESSAGES: Record<Exclude<InstanceState, 'authorized'>, string> = {
  notAuthorized: 'Инстанс не авторизован. Привяжите Telegram-аккаунт в личном кабинете GREEN-API.',
  blocked: 'Инстанс заблокирован.',
  sleepMode: 'Инстанс в спящем режиме. Откройте Telegram на телефоне и повторите попытку.',
  starting: 'Инстанс запускается. Повторите попытку через пару минут.',
  yellowCard: 'Отправка сообщений с инстанса временно ограничена.',
}

interface LoginScreenProps {
  onLogin: (credentials: Credentials) => void
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [idInstance, setIdInstance] = useState('')
  const [apiTokenInstance, setApiTokenInstance] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isChecking, setIsChecking] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const credentials: Credentials = {
      apiUrl: defaultApiUrl(idInstance),
      idInstance: idInstance.trim(),
      apiTokenInstance: apiTokenInstance.trim(),
    }

    setIsChecking(true)
    setError(null)
    try {
      const { stateInstance } = await createGreenApiClient(credentials).getStateInstance()
      if (stateInstance === 'authorized') {
        onLogin(credentials)
        return
      }
      setError(STATE_MESSAGES[stateInstance] ?? `Состояние инстанса: ${stateInstance}.`)
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Не удалось войти.')
    }
    setIsChecking(false)
  }

  return (
    <main className={styles.screen}>
      <form className={styles.card} onSubmit={handleSubmit}>
        <TelegramLogo className={styles.logo} />
        <h1 className={styles.title}>Telegram через GREEN-API</h1>
        <p className={styles.hint}>
          Введите idInstance и apiTokenInstance из{' '}
          <a href="https://console.green-api.com" target="_blank" rel="noreferrer">
            личного кабинета GREEN-API
          </a>
          .
        </p>

        <label className={styles.field}>
          <span>idInstance</span>
          <input
            value={idInstance}
            onChange={(event) => setIdInstance(event.target.value)}
            inputMode="numeric"
            autoComplete="username"
            placeholder="4100000000"
            required
          />
        </label>

        <label className={styles.field}>
          <span>apiTokenInstance</span>
          <input
            type="password"
            value={apiTokenInstance}
            onChange={(event) => setApiTokenInstance(event.target.value)}
            autoComplete="current-password"
            required
          />
        </label>

        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}

        <button className={styles.submit} type="submit" disabled={isChecking}>
          {isChecking ? 'Проверяем…' : 'Войти'}
        </button>
      </form>
    </main>
  )
}
