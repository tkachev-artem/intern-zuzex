// объединяем все LocalAPI и экспортируем основные функции
// основной файл для импорта LocalAPI в приложении

// экспортируем основные функции для работы с localStorage
export {
  // типы
  type StoredUser,
  type StoredAuth,
  type LocalStorageData,
  // функции
  storageLocalAPI
} from "./storage/storageLocalAPI"

// экспортируем функции для работы с пользователями
export {
  authLocalAPI
} from "./auth/authLocalAPI"

// экспортируем функции для работы с постами
export {
  postLocalAPI
} from "./post/postLocalAPI"

// экспортируем функции для работы с проектами
export {
  projectLocalAPI
} from "./projects/projectLocalAPI" 