import type { Credentials } from '../types'
import type { Notification } from './notifications'

export type InstanceState =
  | 'authorized'
  | 'notAuthorized'
  | 'blocked'
  | 'sleepMode'
  | 'starting'
  | 'yellowCard'

type HttpMethod = 'GET' | 'POST' | 'DELETE'

interface RequestOptions {
  body?: unknown
  pathSuffix?: string
  query?: Record<string, string | number>
  signal?: AbortSignal
}

/** How long (seconds) receiveNotification keeps the connection open while the queue is empty. */
const RECEIVE_TIMEOUT_SECONDS = 20

export class GreenApiError extends Error {
  readonly status?: number

  constructor(message: string, status?: number) {
    super(message)
    this.name = 'GreenApiError'
    this.status = status
  }
}

/**
 * GREEN-API hosts every instance on a server named after the first four digits
 * of its idInstance, e.g. 4100123456 -> https://4100.api.green-api.com.
 */
export function defaultApiUrl(idInstance: string): string {
  const prefix = idInstance.trim().slice(0, 4)
  return /^\d{4}$/.test(prefix)
    ? `https://${prefix}.api.green-api.com`
    : 'https://api.green-api.com'
}

export function createGreenApiClient({ apiUrl, idInstance, apiTokenInstance }: Credentials) {
  const baseUrl = `${apiUrl.trim().replace(/\/+$/, '')}/waInstance${idInstance.trim()}`
  const token = apiTokenInstance.trim()

  async function request<T>(
    httpMethod: HttpMethod,
    apiMethod: string,
    { body, pathSuffix = '', query = {}, signal }: RequestOptions = {},
  ): Promise<T> {
    const url = new URL(`${baseUrl}/${apiMethod}/${token}${pathSuffix}`)
    for (const [key, value] of Object.entries(query)) {
      url.searchParams.set(key, String(value))
    }

    let response: Response
    try {
      response = await fetch(url, {
        method: httpMethod,
        headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
        body: body === undefined ? undefined : JSON.stringify(body),
        signal,
      })
    } catch (error) {
      if (signal?.aborted) throw error
      throw new GreenApiError('Не удалось связаться с GREEN-API. Проверьте apiUrl и подключение к сети.')
    }

    if (!response.ok) {
      throw new GreenApiError(describeHttpError(response.status), response.status)
    }

    const text = await response.text()
    return (text ? JSON.parse(text) : null) as T
  }

  return {
    getStateInstance: () =>
      request<{ stateInstance: InstanceState }>('GET', 'getStateInstance'),

    sendMessage: (chatId: string, message: string) =>
      request<{ idMessage: string }>('POST', 'sendMessage', { body: { chatId, message } }),

    /** Returns the oldest notification from the queue, or null when the queue is empty. */
    receiveNotification: (signal?: AbortSignal) =>
      request<Notification | null>('GET', 'receiveNotification', {
        query: { receiveTimeout: RECEIVE_TIMEOUT_SECONDS },
        signal,
      }),

    deleteNotification: (receiptId: number, signal?: AbortSignal) =>
      request<{ result: boolean }>('DELETE', 'deleteNotification', {
        pathSuffix: `/${receiptId}`,
        signal,
      }),
  }
}

export type GreenApiClient = ReturnType<typeof createGreenApiClient>

function describeHttpError(status: number): string {
  switch (status) {
    case 400:
      return 'Некорректный запрос. Проверьте номер получателя.'
    case 401:
    case 403:
      return 'Неверный idInstance или apiTokenInstance.'
    case 429:
      return 'Слишком много запросов. Попробуйте чуть позже.'
    case 466:
      return 'Превышен лимит тарифа GREEN-API.'
    default:
      return `Ошибка GREEN-API (HTTP ${status}).`
  }
}
