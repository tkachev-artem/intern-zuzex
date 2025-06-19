// этот файл нужен чтобы работать с localStorage (браузерное хранилище)
// тут функции для сохранения, получения и удаления пользователей и авторизации

import type { Middleware } from "@reduxjs/toolkit"
import type { RootState } from "@/app/store"

// === ТИПЫ ===

// тип пользователя, который мы храним
export type StoredUser = {
  id: string
  nickname: string
  password: string
  role: string
  email: string
  createdAt: string
  lastLoginAt?: string // когда последний раз заходил (может быть пусто)
}

// тип авторизации, который мы храним
export type StoredAuth = {
  isAuthenticated: boolean // залогинен или нет
  user: string // никнейм залогиненного пользователя
}

// структура всех данных, которые мы храним
type LocalStorageData = {
  users: StoredUser[] // все пользователи
  auth: StoredAuth    // авторизация
  lastUpdated: string // когда последний раз меняли
  version: string     // версия данных
}

// === КОНСТАНТЫ ===

// ключ для localStorage
const STORAGE_KEY = "zuzex_users_storage"
const STORAGE_VERSION = "1.0.0"

// === ОСНОВНЫЕ ФУНКЦИИ ===

// функция чтобы получить все данные из localStorage
export const loadFromStorage = (): LocalStorageData | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return null // если ничего нет — возвращаем null

    const parsed = JSON.parse(stored) as LocalStorageData
    
    // если версия не совпадает — возвращаем null
    if (parsed.version !== STORAGE_VERSION) {
      console.warn(`несовместимая версия данных: ${parsed.version}`)
      return null
    }

    return parsed
  } catch (error) {
    console.error("ошибка загрузки из localStorage:", error)
    return null
  }
}

// функция чтобы сохранить данные в localStorage
export const saveToStorage = (
  users: StoredUser[],
  isAuthenticated = false,
  userNickname = "",
): void => {
  try {
    const data: LocalStorageData = {
      users,
      auth: {
        isAuthenticated,
        user: userNickname,
      },
      lastUpdated: new Date().toISOString(),
      version: STORAGE_VERSION,
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.error("ошибка сохранения в localStorage:", error)
  }
}

// функция чтобы удалить все данные из localStorage
export const clearStorage = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error("ошибка очистки localStorage:", error)
  }
}

// === ФУНКЦИИ ДЛЯ РАБОТЫ С ПОЛЬЗОВАТЕЛЯМИ ===

// функция чтобы добавить нового пользователя
export const addUser = (user: StoredUser): boolean => {
  try {
    const data = loadFromStorage()
    const users = data?.users ?? []

    // если такой ник уже есть — не добавляем
    if (users.some(u => u.nickname === user.nickname)) {
      console.warn(`пользователь ${user.nickname} уже существует`)
      return false
    }

    users.push(user)
    
    // сохраняем пользователей и авторизацию
    const currentAuth = data?.auth ?? { isAuthenticated: false, user: "" }
    saveToStorage(users, currentAuth.isAuthenticated, currentAuth.user)
    
    return true
  } catch (error) {
    console.error("ошибка добавления пользователя:", error)
    return false
  }
}

// функция чтобы найти пользователя по нику
export const findUserByNickname = (nickname: string): StoredUser | null => {
  try {
    const data = loadFromStorage()
    if (!data) return null

    // ищем пользователя с нужным ником
    return data.users.find(user => user.nickname === nickname) ?? null
  } catch (error) {
    console.error("ошибка поиска пользователя:", error)
    return null
  }
}

// функция чтобы проверить, что ник свободен
export const isNicknameUnique = (nickname: string): boolean => {
  try {
    const data = loadFromStorage()
    if (!data) return true

    return !data.users.some(user => user.nickname === nickname)
  } catch (error) {
    console.error("ошибка проверки ника:", error)
    return true
  }
}

// функция чтобы проверить, что email свободен
export const isEmailUnique = (email: string): boolean => {
  try {
    const data = loadFromStorage()
    if (!data) return true

    return !data.users.some(user => user.email === email)
  } catch (error) {
    console.error("ошибка проверки email:", error)
    return true
  }
}

// функция чтобы обновить дату последнего входа пользователя
export const updateUserLastLogin = (nickname: string): void => {
  try {
    const data = loadFromStorage()
    if (!data) return

    const userIndex = data.users.findIndex(user => user.nickname === nickname)
    if (userIndex === -1) return

    data.users[userIndex].lastLoginAt = new Date().toISOString()
    
    // сохраняем обновлённые данные
    saveToStorage(data.users, data.auth.isAuthenticated, data.auth.user)
  } catch (error) {
    console.error("ошибка обновления времени входа:", error)
  }
}

// middleware для redux — автоматически сохраняет авторизацию в localStorage
export const localStorageMiddleware: Middleware<object, RootState> =
  store => next => action => {
    const result = next(action)
    const state = store.getState()

    if (typeof action === "object" && action !== null && "type" in action) {
      const typedAction = action as { type: string }

      // если действие связано с логином, логаутом или регистрацией — сохраняем
      const importantAuthActions = [
        "auth/loginUser",
        "auth/logout",
        "auth/registerUserToStorage"
      ]
      if (importantAuthActions.includes(typedAction.type)) {
        const existingData = loadFromStorage()
        const users = existingData?.users ?? []
        const isAuthenticated = state.auth.userState.isAuthenticated
        const userNickname = state.auth.userState.user?.nickname ?? ""

        saveToStorage(users, isAuthenticated, userNickname)

        // если это логин — обновляем дату последнего входа
        if (typedAction.type === "auth/loginUser" && isAuthenticated) {
          updateUserLastLogin(userNickname)
        }
      }
    }

    return result
  }

// функция чтобы создать тестовых пользователей при первом запуске
export const initializeDefaultUsers = (): void => {
  const existingData = loadFromStorage()

  // если пользователей нет — создаём трёх тестовых
  if (!existingData || existingData.users.length === 0) {
    const defaultUsers: StoredUser[] = [
      {
        id: "user_001",
        nickname: "tkachevtech",
        password: "123456789A",
        role: "Frontend Developer",
        email: "tkachev@example.com",
        createdAt: new Date().toISOString(),
      },
      {
        id: "user_002",
        nickname: "hrmanager", 
        password: "hrpass123",
        role: "HR",
        email: "hr@example.com",
        createdAt: new Date().toISOString(),
      },
      {
        id: "user_003",
        nickname: "designer",
        password: "design123",
        role: "UI/UX Designer",
        email: "design@example.com",
        createdAt: new Date().toISOString(),
      },
    ]

    saveToStorage(defaultUsers)
  }
}
