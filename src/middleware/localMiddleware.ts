// базовые функции для работы с localStorage
// общие типы и утилиты, которые используются в других middleware

import type { Post } from "@/features/posts/postSlice"

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
export type LocalStorageData = {
  users: StoredUser[] // все пользователи
  auth: StoredAuth    // авторизация
  posts: Post[]       // все посты
  lastUpdated: string // когда последний раз меняли
  version: string     // версия данных
}

// ключ для localStorage
export const STORAGE_KEY = "zuzex_users_storage"
export const STORAGE_VERSION = "1.0.0"

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
  posts: Post[] = []
): void => {
  try {
    const data: LocalStorageData = {
      users,
      auth: {
        isAuthenticated,
        user: userNickname,
      },
      posts,
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