// используем общий storage для пользователей
import type { StoredUser } from "@/LocalAPI/storage/storageLocalAPI";
import { storageLocalAPI } from "@/LocalAPI/storage/storageLocalAPI";
import type { Project } from "@/features/projects/projectSlice";

// функция получения всех пользователей (read)
const getUsers = (): StoredUser[] => {
  const data = storageLocalAPI.getStorageData();
  if (!data) return [];
  return data.users;
};

// функция получения пользователя по nickname (read)
const getUserByNickname = (nickname: string): StoredUser | null => {
  const users = getUsers();
  const user = users.find(user => user.nickname === nickname);
  return user ?? null;
};

// функция создания нового пользователя (create)
const createUser = (user: StoredUser): boolean => {
  const users = getUsers();
  
  // Проверяем, что такого пользователя нет
  const existingUser = users.find(u => u.nickname === user.nickname);
  if (existingUser) {
    console.log(`пользователь ${user.nickname} уже существует`);
    return false;
  }
  
  users.push(user);
  
  // Получаем текущие данные для сохранения
  const currentData = storageLocalAPI.getStorageData();
  storageLocalAPI.saveStorageData(
    users,
    currentData?.auth.isAuthenticated ?? false,
    currentData?.auth.user ?? "",
    currentData?.posts ?? [],
    currentData?.projects ?? []
  );
  
  return true;
};

// функция обновления пользователя (update)
const updateUser = (updated: StoredUser): boolean => {
  const users = getUsers();
  const index = users.findIndex(user => user.id === updated.id);
  
  if (index === -1) {
    console.log(`пользователь с id ${updated.id} не найден`);
    return false;
  }

  // Обновляем пользователя
  users[index] = updated;
  
  // Получаем текущие данные для сохранения
  const currentData = storageLocalAPI.getStorageData();
  storageLocalAPI.saveStorageData(
    users,
    currentData?.auth.isAuthenticated ?? false,
    currentData?.auth.user ?? "",
    currentData?.posts ?? [],
    currentData?.projects ?? []
  );
  
  return true;
};

// функция удаления пользователя (delete)
const deleteUser = (id: string): boolean => {
  const users = getUsers();
  const index = users.findIndex(user => user.id === id);
  
  if (index === -1) {
    console.log(`пользователь с id ${id} не найден`);
    return false;
  }

  // Удаляем пользователя
  users.splice(index, 1);
  
  // Получаем текущие данные для сохранения
  const currentData = storageLocalAPI.getStorageData();
  storageLocalAPI.saveStorageData(
    users,
    currentData?.auth.isAuthenticated ?? false,
    currentData?.auth.user ?? "",
    currentData?.posts ?? [],
    currentData?.projects ?? []
  );
  
  return true;
};

// функция проверки уникальности nickname
const isNicknameUnique = (nickname: string): boolean => {
  const users = getUsers();
  return !users.some(user => user.nickname === nickname);
};

// функция проверки уникальности email
const isEmailUnique = (email: string): boolean => {
  const users = getUsers();
  return !users.some(user => user.email === email);
};

// функция обновления даты последнего входа
const updateLastLogin = (nickname: string): boolean => {
  const users = getUsers();
  const userIndex = users.findIndex(user => user.nickname === nickname);
  
  if (userIndex === -1) {
    return false;
  }

  // Обновляем дату последнего входа
  users[userIndex].lastLoginAt = new Date().toISOString();
  
  // Получаем текущие данные для сохранения
  const currentData = storageLocalAPI.getStorageData();
  storageLocalAPI.saveStorageData(
    users,
    currentData?.auth.isAuthenticated ?? false,
    currentData?.auth.user ?? "",
    currentData?.posts ?? [],
    currentData?.projects ?? []
  );
  
  return true;
};

// функция создания тестовых пользователей
const createDefaultUsers = (): void => {
  const users = getUsers();
  
  // Если пользователей нет — создаём тестовых
  if (users.length === 0) {
    const defaultUsers: StoredUser[] = [
      {
        id: "user_001",
        nickname: "tkachevtech",
        firstName: "Ткачев",
        lastName: "Артём",
        password: "123456789A",
        role: "Frontend Developer",
        email: "tkachev@developer.com",
        createdAt: new Date().toISOString(),
        portfolio: [], // изначально у пользователя нет проектов
      },
    ];

    storageLocalAPI.saveStorageData(defaultUsers, false, "", [], []);
  }
};

// функция авторизации пользователя
const login = (nickname: string, password: string): boolean => {
  const user = getUserByNickname(nickname);
  
  // Проверяем, что пользователь существует и пароль верный
  if (!user || user.password !== password) {
    console.log(`неверные учетные данные для пользователя ${nickname}`);
    return false;
  }

  // Обновляем дату последнего входа
  updateLastLogin(nickname);

  // Получаем текущие данные
  const currentData = storageLocalAPI.getStorageData();
  
  // Сохраняем данные с обновленным статусом авторизации
  storageLocalAPI.saveStorageData(
    currentData?.users ?? [],
    true, // isAuthenticated = true
    nickname, // авторизованный пользователь
    currentData?.posts ?? [],
    currentData?.projects ?? []
  );

  console.log(`пользователь ${nickname} успешно авторизован`);
  return true;
};

// функция добавления проекта в портфолио пользователя
const addProjectToUserPortfolio = (userNickname: string, project: Project): boolean => {
  const users = getUsers();
  const userIndex = users.findIndex(user => user.nickname === userNickname);
  
  if (userIndex === -1) {
    console.log(`пользователь ${userNickname} не найден`);
    return false;
  }

  // Добавляем проект в портфолио пользователя
  users[userIndex].portfolio.push(project);
  
  // Получаем текущие данные для сохранения
  const currentData = storageLocalAPI.getStorageData();
  storageLocalAPI.saveStorageData(
    users,
    currentData?.auth.isAuthenticated ?? false,
    currentData?.auth.user ?? "",
    currentData?.posts ?? [],
    currentData?.projects ?? []
  );
  
  return true;
};

// функция удаления проекта из портфолио пользователя
const removeProjectFromUserPortfolio = (userNickname: string, projectId: string): boolean => {
  const users = getUsers();
  const userIndex = users.findIndex(user => user.nickname === userNickname);
  
  if (userIndex === -1) {
    console.log(`пользователь ${userNickname} не найден`);
    return false;
  }

  // Удаляем проект из портфолио пользователя
  users[userIndex].portfolio = users[userIndex].portfolio.filter(project => project.id !== projectId);
  
  // Получаем текущие данные для сохранения
  const currentData = storageLocalAPI.getStorageData();
  storageLocalAPI.saveStorageData(
    users,
    currentData?.auth.isAuthenticated ?? false,
    currentData?.auth.user ?? "",
    currentData?.posts ?? [],
    currentData?.projects ?? []
  );
  
  return true;
};

// экспорт функций
export const authLocalAPI = {
  getUsers,
  getUserByNickname,
  createUser,
  updateUser,
  deleteUser,
  isNicknameUnique,
  isEmailUnique,
  updateLastLogin,
  createDefaultUsers,
  login,
  addProjectToUserPortfolio,
  removeProjectFromUserPortfolio,
};