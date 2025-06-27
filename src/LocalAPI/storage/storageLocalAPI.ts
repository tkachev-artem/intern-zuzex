import type { Post } from "@/features/posts/postSlice"
import type { Project } from "@/features/projects/projectSlice"

// тип пользователя, который мы храним
export type StoredUser = {
  id: string
  nickname: string
  firstName: string
  lastName: string
  password: string
  role: string
  email: string
  createdAt: string
  lastLoginAt?: string // когда последний раз заходил (может быть пусто)
  description?: string // описание пользователя
  workplace?: string   // место работы
  portfolio: Project[] // портфолио проектов пользователя
}

// тип авторизации, который сохраняется
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
const STORAGE_KEY = "tkachevartem_storage";
const STORAGE_VERSION = "1.0.0";

// функция получения всех данных из localStorage (read)
const getStorageData = (): LocalStorageData | null => {

  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return null; // Если данных нет — возвращаем null
  }

  const parsed = JSON.parse(stored) as LocalStorageData;
  
  // Проверяем версию данных
  if (parsed.version !== STORAGE_VERSION) {
    console.warn(`несовместимая версия данных: ${parsed.version}`);
    return null;
  }

  return parsed;
};

// функция получения данных профиля по ID
const getProfile = (userID: string) : StoredUser => {
  const data = getStorageData();
  const user = data?.users.find(user => user.id === userID);
  if (!user) {
    throw new Error(`Пользователь ${userID} не найден`);
  }
  return user;
}

// функция получения данных профиля по nickname
const getProfileByNickname = (nickname: string) : StoredUser => {
  const data = getStorageData();
  const user = data?.users.find(user => user.nickname === nickname);
  if (!user) {
    throw new Error(`Пользователь ${nickname} не найден`);
  }
  return user;
}


// функция создания/сохранения данных в localStorage (create/update)
const saveStorageData = (
  users: StoredUser[],
  isAuthenticated = false,
  userNickname = "",
  posts: Post[] = []
): void => {
  // Формируем объект с данными для сохранения
  const data: LocalStorageData = {
    users,
    auth: {
      isAuthenticated,
      user: userNickname,
    },
    posts,
    lastUpdated: new Date().toISOString(),
    version: STORAGE_VERSION,
  };

  // Сохраняем данные в localStorage как JSON строку
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

// функция обновления конкретных данных (update)
const updateStorageData = (updates: Partial<LocalStorageData>): void => {
  // Получаем текущие данные
  const currentData = getStorageData();
  if (!currentData) {
    return; // Если данных нет — ничего не делаем
  }

  // Объединяем старые данные с новыми
  const updatedData = {
    ...currentData,
    ...updates,
    lastUpdated: new Date().toISOString(),
  };

  // Сохраняем обновлённые данные
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
};

// функция удаления всех данных из localStorage (delete)
const clearStorageData = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};

// экспорт функций
export const storageLocalAPI = {
  getStorageData,
  saveStorageData,
  updateStorageData,
  clearStorageData,
  getProfile,
  getProfileByNickname,
}; 