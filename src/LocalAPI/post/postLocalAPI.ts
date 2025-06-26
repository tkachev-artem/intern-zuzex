import type { Post } from "@/features/posts/postSlice";
import { storageLocalAPI } from "@/LocalAPI/storage/storageLocalAPI";

// функция получения всех постов (read)
const getPosts = (): Post[] => {
  const data = storageLocalAPI.getStorageData();
  if (!data) return [];
  return data.posts;
};

// функция получения поста по id (read)
const getPostById = (id: string): Post | null => {
  const posts = getPosts();
  const post = posts.find(post => post.id === id);
  return post ?? null;
};

// функция получения постов по автору (read)
const getPostsByAuthor = (author: string): Post[] => {
  const posts = getPosts();
  return posts.filter(post => post.author === author);
};

// функция создания нового поста (create)
const createPost = (post: Post): boolean => {
  const posts = getPosts();
  
  // Проверяем, что такого поста нет
  const existingPost = posts.find(p => p.id === post.id);
  if (existingPost) {
    console.log(`пост с id ${post.id} уже существует`);
    return false;
  }

  // Добавляем новый пост
  posts.push(post);
  
  // Получаем текущие данные для сохранения
  const currentData = storageLocalAPI.getStorageData();
  storageLocalAPI.saveStorageData(
    currentData?.users ?? [],
    currentData?.auth.isAuthenticated ?? false,
    currentData?.auth.user ?? "",
    posts
  );
  
  return true;
};

// функция обновления поста (update)
const updatePost = (updated: Post): boolean => {
  const posts = getPosts();
  const index = posts.findIndex(post => post.id === updated.id);
  
  if (index === -1) {
    console.log(`пост с id ${updated.id} не найден`);
    return false;
  }

  // Обновляем пост
  posts[index] = updated;
  
  // Получаем текущие данные для сохранения
  const currentData = storageLocalAPI.getStorageData();
  storageLocalAPI.saveStorageData(
    currentData?.users ?? [],
    currentData?.auth.isAuthenticated ?? false,
    currentData?.auth.user ?? "",
    posts
  );
  
  return true;
};

// функция удаления поста (delete)
const deletePost = (id: string): boolean => {
  const posts = getPosts();
  const index = posts.findIndex(post => post.id === id);
  
  if (index === -1) {
    console.log(`пост с id ${id} не найден`);
    return false;
  }

  // Удаляем пост
  posts.splice(index, 1);
  
  // Получаем текущие данные для сохранения
  const currentData = storageLocalAPI.getStorageData();
  storageLocalAPI.saveStorageData(
    currentData?.users ?? [],
    currentData?.auth.isAuthenticated ?? false,
    currentData?.auth.user ?? "",
    posts
  );
  
  return true;
};

// экспорт функций
export const postLocalAPI = {
  getPosts,
  getPostById,
  getPostsByAuthor,
  createPost,
  updatePost,
  deletePost,
}; 