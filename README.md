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

---

## Функциональность

### Тестовое задание 1 — Лента

- **Список постов** — аватар, имя автора, галочка верификации, обложка, заголовок, превью текст, счётчики лайков и комментариев
- **Курсорная пагинация** — следующая страница подгружается автоматически при достижении конца списка
- **Pull-to-refresh** — нативный `RefreshControl`
- **Платные посты** — `tier: "paid"` показывает размытую обложку с кнопкой «Отправить донат» вместо контента
- **Оптимистичные лайки** — мгновенное обновление UI с bounce-анимацией, откат при ошибке сети
- **Скелетоны загрузки** — shimmer-анимация при первом запросе
- **Состояние ошибки** — полноэкранный экран с иллюстрацией (SVG-маскот) и кнопкой «Повторить»
- **Тёмная / светлая тема** — следует системной цветовой схеме

### Тестовое задание 2 — Детальный экран + реалтайм

- **Фильтрация ленты** — сегментированный контрол «Все / Бесплатные / Платные»
- **Экран поста** — полный текст, обложка, автор, лайки/комментарии
- **Список комментариев** — курсорная пагинация, кнопка «Загрузить ещё»
- **Поле ввода комментария** — липнет над клавиатурой, мгновенно добавляет комментарий в кэш без перезагрузки
- **Лайк комментария** — оптимистичный, с анимацией (API не требуется)
- **Haptic feedback** — тактильный отклик при нажатии лайка
- **WebSocket** — подключается к `wss://k8s.mectest.ru/test-app/ws` при открытии поста:
  - `like_updated` → автоматически обновляет счётчик лайков
  - `comment_added` → автоматически подгружает новые комментарии

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

## Архитектура

```
app/
  _layout.tsx          # Корень: провайдеры (Tamagui, QueryClient, MobX, SafeArea)
  index.tsx            # Точка входа → FeedScreen
  post/[id].tsx        # Динамический роут → PostDetailScreen

src/
  api/
    client.ts          # Axios instance + Bearer-interceptor
    posts.ts           # Типизированные API-функции (getPosts, getPost, toggleLike, getComments, addComment)

  components/
    feed/
      PostCard.tsx         # Карточка поста в ленте
      PostCardSkeleton.tsx # Shimmer-скелетон
      LockedBadge.tsx      # Оверлей платного поста (блюр + кнопка доната)
      LikeButton.tsx       # Лайк-пилюля с анимацией и haptics
      CommentBadge.tsx     # Пилюля с счётчиком комментариев
      ExpandableText.tsx   # Текст «Показать ещё» с анимацией раскрытия
      FeedTabFilter.tsx    # Сегментированный контрол фильтрации
      FeedEmptyError.tsx   # Полноэкранная ошибка с маскотом
      FeedListFooter.tsx   # Спиннер в конце списка при загрузке
    post/
      CommentItem.tsx      # Строка комментария (аватар + текст + лайк)
      CommentInput.tsx     # Поле ввода + кнопка отправки
    ui/
      Avatar.tsx           # Аватар с fallback-инициалами
      VerifiedBadge.tsx    # Синяя галочка верификации
      MascotError.tsx      # SVG-маскот (аксолотль) для экрана ошибки

  hooks/
    useFeed.ts             # useInfiniteQuery для ленты с фильтром по tier
    useComments.ts         # useInfiniteQuery для комментариев поста
    usePostWebSocket.ts    # WebSocket-хук (like_updated / comment_added)

  screens/
    FeedScreen.tsx         # Лента: FlatList + табы + pull-to-refresh
    PostDetailScreen.tsx   # Детальный пост: контент + комментарии + ввод

  stores/
    AuthStore.ts           # UUID-токен: генерация + персистентность (SecureStore)
    FeedStore.ts           # Оптимистичные лайки: Map<postId, {isLiked, likesCount}>
    RootStore.ts           # Корневой стор + React Context + хелперы useAuthStore/useFeedStore

  types/
    api.ts                 # Все типы API (Post, Author, Comment, ответы)

tamagui.config.ts          # Дизайн-токены: цвета, отступы, радиусы, темы light/dark
```

### Разделение стейта

| Что | Где | Почему |
|---|---|---|
| Данные с сервера (посты, комментарии) | TanStack Query | Кэш, дедупликация, пагинация, инвалидация |
| Оптимистичные лайки | MobX FeedStore | Мгновенная реакция UI до ответа сервера |
| UUID-токен | MobX AuthStore | Доступен глобально без лишних перерендеров |
| Состояние ввода комментария | локальный useState | Изолированно в компоненте |

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
