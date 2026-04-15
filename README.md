# Mecenate — Test Assignment

React Native приложение для платформы Mecenate (аналог Patreon / Boosty).  
Реализованы оба тестовых задания.

---

## Стек

| Слой | Технология |
|---|---|
| Фреймворк | React Native + **Expo SDK 54** |
| Язык | TypeScript (strict mode) |
| Роутинг | **expo-router v6** (file-based) |
| Серверный стейт | **TanStack Query v5** (infinite pagination, mutations) |
| Клиентский стейт | **MobX 6** (оптимистичные лайки) |
| UI / Design System | **Tamagui 1.x** (токены, темы, анимации) |
| Анимации | **react-native-reanimated 4** |
| HTTP | Axios (interceptor с Bearer-токеном) |
| WebSocket | Native WebSocket API |
| Авторизация | UUID v4, генерируется при первом запуске, хранится в SecureStore |
| Haptics | expo-haptics |
| Архитектура | **Feature-Sliced Design (FSD)** |

---

## Функциональность

### Тестовое задание 1 — Лента

- **Список постов** — аватар, имя автора, галочка верификации, обложка, заголовок, превью текст, счётчики лайков и комментариев
- **Курсорная пагинация** — следующая страница подгружается автоматически при достижении конца списка
- **Pull-to-refresh** — нативный `RefreshControl`
- **Платные посты** — `tier: "paid"` показывает размытую обложку с кнопкой «Отправить донат» вместо контента
- **Оптимистичные лайки** — мгновенное обновление UI с bounce-анимацией, откат при ошибке сети
- **Скелетоны загрузки** — shimmer-анимация при первом запросе
- **Состояние ошибки** — полноэкранный экран с SVG-маскотом и кнопкой «Повторить»
- **Тёмная / светлая тема** — следует системной цветовой схеме

### Тестовое задание 2 — Детальный экран + реалтайм

- **Фильтрация ленты** — сегментированный контрол «Все / Бесплатные / Платные»
- **Экран поста** — полный текст, обложка, автор, лайки/комментарии
- **Список комментариев** — курсорная пагинация, кнопка «Загрузить ещё»
- **Поле ввода комментария** — липнет над клавиатурой, мгновенно добавляет комментарий в кэш без перезагрузки
- **Лайк комментария** — оптимистичный UI (API не требуется)
- **Haptic feedback** — тактильный отклик на лайк поста, лайк комментария, переключение табов, отправку комментария, кнопку «Повторить»
- **WebSocket** — подключается при открытии поста, `like_updated` обновляет счётчик лайков, `comment_added` подгружает новые комментарии

---

## Запуск

### Требования

- Node.js 18+
- [Expo Go](https://expo.dev/go) на iOS или Android

### Установка

```bash
npm install --legacy-peer-deps
```

### Запуск

```bash
npx expo start
```

Отсканировать QR-код в приложении Expo Go.

---

## Архитектура — Feature-Sliced Design

Проект организован по методологии [Feature-Sliced Design](https://feature-sliced.design/).  
Каждый слой может импортировать только из слоёв **ниже** себя.

```
app/                        # expo-router: роуты и провайдеры
  _layout.tsx               # Tamagui + QueryClient + MobX + SafeArea
  index.tsx                 # → pages/feed
  post/[id].tsx             # → pages/post-detail

src/
  shared/                   # Переиспользуемое, без бизнес-логики
    api/                    # Axios instance + Bearer-interceptor
    config/                 # Tamagui токены и темы (light/dark)
    types/                  # Все API-типы (Post, Author, Comment…)
    ui/                     # Avatar, VerifiedBadge, CommentBadge,
                            # ExpandableText, MascotError

  entities/                 # Бизнес-сущности
    auth/                   # AuthStore — UUID-токен (SecureStore)
    post/                   # API постов, usePostWebSocket
    comment/                # API комментариев, useComments,
                            # CommentItem, CommentInput

  features/                 # Пользовательские действия
    like-post/              # FeedStore (оптимистичные лайки), LikeButton
    feed-filter/            # FeedTabFilter (Все / Бесплатные / Платные)
    locked-post/            # LockedBadge (блюр + кнопка доната)

  widgets/                  # Самодостаточные крупные блоки
    post-card/              # PostCard, PostCardSkeleton
    feed-list/              # useFeed, FeedListFooter, FeedEmptyError

  pages/                    # Экраны (оркестрируют виджеты и фичи)
    feed/                   # FeedScreen
    post-detail/            # PostDetailScreen

  app-layer/                # FSD app-слой (не expo-router)
    providers/              # RootStore — объединяет AuthStore + FeedStore
```

### Алиасы

| Алиас | Путь |
|---|---|
| `@shared/...` | `src/shared/...` |
| `@entities/...` | `src/entities/...` |
| `@features/...` | `src/features/...` |
| `@widgets/...` | `src/widgets/...` |
| `@pages/...` | `src/pages/...` |
| `@app-layer/...` | `src/app-layer/...` |

### Разделение стейта

| Что | Где | Почему |
|---|---|---|
| Данные с сервера (посты, комментарии) | TanStack Query | Кэш, дедупликация, пагинация, инвалидация |
| Оптимистичные лайки | MobX FeedStore | Мгновенная реакция UI до ответа сервера |
| UUID-токен | MobX AuthStore | Глобальный доступ без лишних перерендеров |
| Состояние ввода комментария | локальный `useState` | Изолировано в компоненте |

---

## API

Base URL: `https://k8s.mectest.ru/test-app`

| Метод | Путь | Описание |
|---|---|---|
| GET | `/posts?limit&cursor&tier` | Лента с пагинацией и фильтром |
| GET | `/posts/:id` | Один пост |
| POST | `/posts/:id/like` | Переключить лайк |
| GET | `/posts/:id/comments?limit&cursor` | Комментарии с пагинацией |
| POST | `/posts/:id/comments` | Добавить комментарий |
| WS | `/ws?token=&postId=` | Реалтайм-события поста |

Auth: `Authorization: Bearer <UUID>`
