// middleware для работы с постами
// функции для создания, редактирования, удаления и работы с лайками постов

import type { Middleware } from "@reduxjs/toolkit"
import type { RootState } from "@/app/store"
import type { Post } from "@/features/posts/postSlice"
import { loadFromStorage, saveToStorage } from "./localMiddleware"

// функция чтобы получить все посты из localStorage
export const loadPostsFromStorage = (): Post[] => {
  try {
    const data = loadFromStorage()
    return data?.posts ?? []
  } catch (error) {
    console.error("ошибка загрузки постов из localStorage:", error)
    return []
  }
}

// функция чтобы сохранить посты в localStorage
export const savePostsToStorage = (posts: Post[]): void => {
  try {
    const data = loadFromStorage()
    const users = data?.users ?? []
    const currentAuth = data?.auth ?? { isAuthenticated: false, user: "" }
    
    saveToStorage(users, currentAuth.isAuthenticated, currentAuth.user, posts)
  } catch (error) {
    console.error("ошибка сохранения постов в localStorage:", error)
  }
}

// функция чтобы добавить новый пост
export const addPostToStorage = (post: Post): boolean => {
  try {
    const posts = loadPostsFromStorage()
    
    // если пост с таким id уже есть — не добавляем
    if (posts.some(p => p.id === post.id)) {
      console.warn(`пост с id ${post.id} уже существует`)
      return false
    }

    posts.push(post)
    savePostsToStorage(posts)
    
    return true
  } catch (error) {
    console.error("ошибка добавления поста:", error)
    return false
  }
}

// функция чтобы обновить пост
export const updatePostInStorage = (updatedPost: Post): boolean => {
  try {
    const posts = loadPostsFromStorage()
    const postIndex = posts.findIndex(p => p.id === updatedPost.id)
    
    if (postIndex === -1) {
      console.warn(`пост с id ${updatedPost.id} не найден`)
      return false
    }

    posts[postIndex] = updatedPost
    savePostsToStorage(posts)
    
    return true
  } catch (error) {
    console.error("ошибка обновления поста:", error)
    return false
  }
}

// функция чтобы удалить пост по id
export const deletePostFromStorage = (postId: string): boolean => {
  try {
    const posts = loadPostsFromStorage()
    const postIndex = posts.findIndex(p => p.id === postId)
    
    if (postIndex === -1) {
      console.warn(`пост с id ${postId} не найден`)
      return false
    }

    posts.splice(postIndex, 1)
    savePostsToStorage(posts)
    
    return true
  } catch (error) {
    console.error("ошибка удаления поста:", error)
    return false
  }
}

// функция чтобы найти пост по id
export const findPostById = (postId: string): Post | null => {
  try {
    const posts = loadPostsFromStorage()
    return posts.find(post => post.id === postId) ?? null
  } catch (error) {
    console.error("ошибка поиска поста:", error)
    return null
  }
}

// функция чтобы получить посты конкретного автора
export const getPostsByAuthor = (author: string): Post[] => {
  try {
    const posts = loadPostsFromStorage()
    return posts.filter(post => post.author === author)
  } catch (error) {
    console.error("ошибка получения постов автора:", error)
    return []
  }
}

// middleware для redux — автоматически сохраняет посты в localStorage
export const postsMiddleware: Middleware<object, RootState> =
  store => next => action => {
    const result = next(action)
    const state = store.getState()

    if (typeof action === "object" && action !== null && "type" in action) {
      const typedAction = action as { type: string }

      // если действие связано с постами — сохраняем
      const importantPostActions = [
        "posts/makePost",
        "posts/editPost", 
        "posts/deletePost",
        "posts/likePostByUser"
      ]

      if (importantPostActions.includes(typedAction.type)) {
        const existingData = loadFromStorage()
        const users = existingData?.users ?? []
        const currentAuth = existingData?.auth ?? { isAuthenticated: false, user: "" }
        const posts = state.posts

        saveToStorage(users, currentAuth.isAuthenticated, currentAuth.user, posts)
      }
    }

    return result
  } 