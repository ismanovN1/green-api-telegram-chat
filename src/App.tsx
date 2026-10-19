import { useState } from 'react'
import { LoginScreen } from './components/LoginScreen'
import { Messenger } from './components/Messenger'
import type { Credentials } from './types'
import { readJson, removeItem, writeJson } from './utils/storage'

const CREDENTIALS_KEY = 'green-api-credentials'

export default function App() {
  const [credentials, setCredentials] = useState(() => readJson<Credentials>(CREDENTIALS_KEY))

  function handleLogin(newCredentials: Credentials) {
    writeJson(CREDENTIALS_KEY, newCredentials)
    setCredentials(newCredentials)
  }

  function handleLogout() {
    removeItem(CREDENTIALS_KEY)
    setCredentials(null)
  }

  if (!credentials) return <LoginScreen onLogin={handleLogin} />

  return <Messenger key={credentials.idInstance} credentials={credentials} onLogout={handleLogout} />
}
