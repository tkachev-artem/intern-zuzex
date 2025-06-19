# 🚀 React Redux TypeScript Project

Простое приложение для изучения работы с Redux, TypeScript и localStorage middleware.

## 📁 Структура проекта

```
src/
├── api/                    # API слой
│   ├── auth/              # API для авторизации
│   └── uniquedata/        # API для уникальных данных
├── app/                   # Настройка Redux store
│   ├── store.ts           # Конфигурация store
│   ├── hooks.ts           # Типизированные Redux hooks
│   └── createAppSlice.ts  # Утилита для создания slice
├── components/            # React компоненты
│   ├── AuthForm/          # Компоненты авторизации
│   ├── ErrorMessage/      # Валидация и ошибки
│   ├── Form/              # Переиспользуемые формы
│   ├── Navigation/        # Навигация
│   └── LocalStorageDemo.tsx # Демо localStorage
├── features/              # Redux slices (бизнес-логика)
│   ├── auth/              # Slice авторизации
│   └── registration/      # Slice регистрации
├── middleware/            # Redux middleware
│   └── localStorageMiddleware.ts # Автосохранение в localStorage
└── pages/                 # Страницы приложения
    ├── Auth/              # Страница авторизации
    └── Home/              # Главная страница
```

## 🏗️ Архитектура приложения

### Redux Store
- **Централизованное хранилище состояния** - все данные приложения в одном месте
- **Predictable state management** - состояние изменяется только через actions
- **TypeScript поддержка** - типизация на всех уровнях

### Middleware Pattern
- **localStorage middleware** - автоматически сохраняет изменения
- **Перехват actions** - middleware видит все экшены между dispatch и reducer
- **Побочные эффекты** - логирование, сохранение данных, синхронизация

### Component Architecture
```
Pages (роутинг)
  ↓
Containers (бизнес-логика + Redux)
  ↓
UI Components (презентационные компоненты)
```

## 🔄 Поток данных

1. **User Action** → Пользователь взаимодействует с UI
2. **Dispatch Action** → Компонент отправляет action
3. **Middleware** → Middleware перехватывает action
4. **Reducer** → Reducer обновляет состояние
5. **State Update** → Компоненты перерендериваются
6. **Side Effects** → Middleware выполняет побочные эффекты

## 🛠️ Основные концепции

### Redux Slice
```typescript
// Современный способ создания Redux логики
const authSlice = createAppSlice({
  name: "auth",
  initialState,
  reducers: {
    // Синхронные actions
    setNickname: (state, action) => {
      state.form.nickname = action.payload
    }
  }
})
```

### Middleware
```typescript
// Перехватывает все actions
const middleware = store => next => action => {
  // Логика ДО выполнения action
  const result = next(action) // Выполняем action
  // Логика ПОСЛЕ выполнения action
  return result
}
```

### TypeScript Integration
```typescript
// Типизированные hooks
const dispatch = useAppDispatch()
const user = useAppSelector(selectUser)

// Типизированные actions
dispatch(setNickname("username"))
```

## 🚀 Запуск проекта

```bash
# Установка зависимостей
npm install

# Запуск в dev режиме
npm run dev

# Сборка для продакшена
npm run build
```

## 📚 Ключевые файлы для изучения

1. **`src/middleware/localStorageMiddleware.ts`** - пример middleware
2. **`src/features/auth/authSlice.ts`** - современный Redux slice
3. **`src/app/store.ts`** - конфигурация store
4. **`src/components/AuthForm/auth/Auth.tsx`** - компонент с Redux

## 🎯 Что изучать дальше

### Beginner Level
- Основы Redux (actions, reducers, store)
- React hooks (useState, useEffect)
- TypeScript basics

### Intermediate Level  
- Redux Toolkit (createSlice, createAsyncThunk)
- Middleware patterns
- Component composition

### Advanced Level
- Performance optimization (memoization)
- Advanced TypeScript patterns
- Testing Redux applications

## 🔧 Инструменты разработки

- **Vite** - быстрый bundler
- **TypeScript** - типизация
- **ESLint** - линтинг кода
- **Prettier** - форматирование

## 📝 Соглашения по коду

1. **Именование**: camelCase для переменных, PascalCase для компонентов
2. **Комментарии**: базовые комментарии на русском языке
3. **Структура**: один компонент = один файл
4. **Экспорты**: default export для компонентов, named export для утилит

## 🤝 Следующие шаги

1. Изучите как работает middleware
2. Добавьте новые features через Redux Toolkit
3. Исследуйте TypeScript типизацию
4. Попробуйте добавить тестирование
