import type { Post } from "@/features/posts/postSlice";
import { storageLocalAPI } from "@/LocalAPI/storage/storageLocalAPI";

// получаем все посты
const getPosts = (): Post[] => {
  const data = storageLocalAPI.getStorageData();
  if (!data) return [];
  return data.posts;
};

// получаем пост по id
const getPostById = (id: string): Post | null => {
  const posts = getPosts();
  const post = posts.find(post => post.id === id);
  return post ?? null;
};

// получаем посты по автору
const getPostsByAuthor = (author: string): Post[] => {
  const posts = getPosts();
  return posts.filter(post => post.author === author);
};

// создаём новый пост
const createPost = (post: Post): boolean => {
  const posts = getPosts();
  
  // проверяем, что такого поста нет
  const existingPost = posts.find(p => p.id === post.id);
  if (existingPost) {
    console.log(`пост с id ${post.id} уже существует`);
    return false;
  }

  // добавляем новый пост
  posts.push(post);
  
  // получаем текущие данные для сохранения
  const currentData = storageLocalAPI.getStorageData();
  storageLocalAPI.saveStorageData(
    currentData?.users ?? [],
    currentData?.auth.isAuthenticated ?? false,
    currentData?.auth.user ?? "",
    posts
  );
  
  return true;
};

// обновляем пост
const updatePost = (updated: Post): boolean => {
  const posts = getPosts();
  const index = posts.findIndex(post => post.id === updated.id);
  
  if (index === -1) {
    console.log(`пост с id ${updated.id} не найден`);
    return false;
  }

  // обновляем пост
  posts[index] = updated;
  
  // получаем текущие данные для сохранения
  const currentData = storageLocalAPI.getStorageData();
  storageLocalAPI.saveStorageData(
    currentData?.users ?? [],
    currentData?.auth.isAuthenticated ?? false,
    currentData?.auth.user ?? "",
    posts
  );
  
  return true;
};

// удаляем пост
const deletePost = (id: string): boolean => {
  const posts = getPosts();
  const index = posts.findIndex(post => post.id === id);
  
  if (index === -1) {
    console.log(`пост с id ${id} не найден`);
    return false;
  }

  // удаляем пост
  posts.splice(index, 1);
  
  // получаем текущие данные для сохранения
  const currentData = storageLocalAPI.getStorageData();
  storageLocalAPI.saveStorageData(
    currentData?.users ?? [],
    currentData?.auth.isAuthenticated ?? false,
    currentData?.auth.user ?? "",
    posts
  );
  
  return true;
};

// экспорт всех функций
export const postLocalAPI = {
  getPosts,
  getPostById,
  getPostsByAuthor,
  createPost,
  updatePost,
  deletePost,
}; 