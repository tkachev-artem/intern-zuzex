// объединение всех middleware и экспорт основных функций
// главный файл для импорта middleware в приложении

import { authMiddleware } from "./authMiddleware"
import { postsMiddleware } from "./postsMiddleware"

// объединяем все middleware в массив
export const storageMiddlewares = [authMiddleware, postsMiddleware]

// экспортируем основные функции для работы с localStorage
export {
  // базовые функции
  loadFromStorage,
  saveToStorage,
  clearStorage,
  
  // типы
  type StoredUser,
  type StoredAuth,
  type LocalStorageData
} from "./localMiddleware"

// экспортируем функции для работы с пользователями
export {
  addUser,
  findUserByNickname,
  isNicknameUnique,
  isEmailUnique,
  updateUserLastLogin,
  initializeDefaultUsers
} from "./authMiddleware"

// экспортируем функции для работы с постами
export {
  loadPostsFromStorage,
  savePostsToStorage,
  addPostToStorage,
  updatePostInStorage,
  deletePostFromStorage,
  findPostById,
  getPostsByAuthor
} from "./postsMiddleware"

// экспортируем отдельные middleware (если нужно использовать по отдельности)
export { authMiddleware } from "./authMiddleware"
export { postsMiddleware } from "./postsMiddleware" 