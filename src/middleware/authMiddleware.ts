// middleware для авторизации и работы с пользователями
// функции для регистрации, входа, проверки уникальности и инициализации

import type { Middleware } from "@reduxjs/toolkit"
import type { RootState } from "@/app/store"
import type { Post } from "@/features/posts/postSlice"
import { loadFromStorage, saveToStorage, type StoredUser } from "./localMiddleware"

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
    
    // сохраняем пользователей, авторизацию и посты
    const currentAuth = data?.auth ?? { isAuthenticated: false, user: "" }
    const currentPosts = data?.posts ?? []
    saveToStorage(users, currentAuth.isAuthenticated, currentAuth.user, currentPosts)
    
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
    saveToStorage(data.users, data.auth.isAuthenticated, data.auth.user, data.posts)
  } catch (error) {
    console.error("ошибка обновления времени входа:", error)
  }
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

    const defaultPosts: Post[] = []

    saveToStorage(defaultUsers, false, "", defaultPosts)
  }
}

// middleware для redux — автоматически сохраняет авторизацию в localStorage
export const authMiddleware: Middleware<object, RootState> =
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
        const posts = existingData?.posts ?? []
        const isAuthenticated = state.auth.userState.isAuthenticated
        const userNickname = state.auth.userState.user?.nickname ?? ""

        saveToStorage(users, isAuthenticated, userNickname, posts)

        // если это логин — обновляем дату последнего входа
        if (typedAction.type === "auth/loginUser" && isAuthenticated) {
          updateUserLastLogin(userNickname)
        }
      }
    }

    return result
  } 