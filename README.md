# Telegram-чат на GREEN-API

Тестовое задание на позицию «Фронтенд разработчик React» в GREEN-API.

Веб-интерфейс для отправки и получения текстовых сообщений Telegram через
[GREEN-API](https://green-api.com). Внешний вид повторяет Telegram Web.

## Возможности

- Вход по `idInstance` и `apiTokenInstance` из личного кабинета GREEN-API.
  Перед входом состояние инстанса проверяется методом `getStateInstance`.
- Создание чата по номеру телефона получателя (или ID чата Telegram).
- Отправка текстовых сообщений методом `SendMessage`.
- Получение входящих сообщений методом `ReceiveNotification` (long polling).
  Каждое уведомление после обработки удаляется методом `DeleteNotification`.
- Входящее сообщение от нового собеседника автоматически создаёт чат.
- Сообщения, отправленные с телефона, тоже попадают в чат.
- Статусы исходящих сообщений: отправляется, отправлено, ошибка.
- Счётчик непрочитанных и сортировка чатов по последнему сообщению.
- История чатов сохраняется в `localStorage`: `ReceiveNotification` выдаёт
  каждое уведомление только один раз.
- Адаптивная вёрстка (на телефоне список чатов и переписка — отдельные экраны)
  и тёмная тема по системной настройке.

## Запуск

Нужен Node.js 20.19+ или 22.12+.

```bash
npm install
npm run dev       # http://localhost:5173
```

Другие команды:

```bash
npm run build     # production-сборка в dist/
npm run preview   # просмотр сборки
npm test          # unit-тесты (Vitest)
npm run lint      # Oxlint
```

## Как проверить

1. Зарегистрируйтесь на [green-api.com](https://green-api.com), создайте
   Telegram-инстанс и авторизуйте его своим аккаунтом Telegram.
2. Откройте приложение и введите `idInstance` и `apiTokenInstance`.
   `apiUrl` подставляется автоматически по первым четырём цифрам `idInstance`.
   Если в личном кабинете указан другой адрес, исправьте его вручную.
3. Введите номер телефона получателя в международном формате, например
   `79001234567`, и нажмите «+».
4. Отправьте сообщение. Ответ собеседника появится в чате.

## Структура

```
src/
├── api/
│   ├── greenApi.ts           # HTTP-клиент GREEN-API
│   └── notifications.ts      # типы уведомлений, разбор текстовых сообщений
├── hooks/
│   ├── chatsReducer.ts       # состояние чатов (чистый reducer)
│   ├── useChats.ts           # чаты, отправка сообщений, сохранение истории
│   └── useNotificationPolling.ts  # цикл ReceiveNotification → DeleteNotification
├── components/               # LoginScreen, Messenger, Sidebar, ChatWindow, Avatar
├── utils/                    # chatId, форматирование, localStorage
└── App.tsx                   # вход / выход
```

Состояние чатов хранится в одном reducer'е. Его логика (дедупликация
сообщений, непрочитанные, подтверждение отправки) покрыта тестами отдельно
от React.

## Деплой

Workflow `.github/workflows/deploy.yml` собирает проект и публикует его на
GitHub Pages при каждом push в `main`. Чтобы включить деплой, откройте
**Settings → Pages → Source: GitHub Actions**.

## Стек

React 19, TypeScript, Vite, CSS Modules, Vitest. Сторонних UI-библиотек нет.
