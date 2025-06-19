import { createAppSlice } from "@/app/createAppSlice"
import type { PayloadAction } from "@reduxjs/toolkit";

// типы постов
export type Post = {
    id: string;
    title: string;
    content: string;
    author: string;
    type: 'Контент' | 'Событие' | 'Вакансия';
    direction: string;
    likes: number;
    isLikedByUser: boolean;
    previewImage?: string;
}

const initialState: Post[] = [];

const savePostsToStorage = (posts: Post[]): void => { //сохранение постов в локальном хранилище
    try {
        localStorage.setItem('posts', JSON.stringify(posts));
    } catch (error) {
        console.error('Ошибка сохранения постов в localStorage:', error);
    }
}

const loadPostsFromStorage = (): Post[] => { //загрузка постов из локального хранилища
    try {
        const stored = localStorage.getItem('posts');
        return stored ? JSON.parse(stored) as Post[] : [];
    } catch (error) {
        console.error('Ошибка загрузки постов из локального хранилища:', error);    
        return [];
    }
}
const postSlice = createAppSlice({ //создание слайса постов
    name: "posts",
    initialState,

    reducers: create => ({
        makePost: create.reducer( //создание поста
            (state: Post[], action: PayloadAction<Post>) => {
                state.push(action.payload);
                savePostsToStorage(state);
            }
        ),
        toggleLike: create.reducer( //лайк поста
            (state: Post[], action: PayloadAction<string>) => {
                const post = state.find(p => p.id === action.payload);
                if (post) {
                    post.likes = post.isLikedByUser ? post.likes - 1 : post.likes + 1;
                    post.isLikedByUser = !post.isLikedByUser;
                    savePostsToStorage(state);
                }
            }
        ),
        loadPosts: create.reducer( //загрузка постов из локального хранилища
            (state: Post[]) => {
                const posts = loadPostsFromStorage();
                state.length = 0;
                state.push(...posts);
            }
        )
    }),
});

//фильтрация постов 
// по направлению
export const filterPostsByDirection = (state: Post[], direction: string) => {
    return state.filter(post => post.direction === direction);
}

// по типу
export const filterPostsByType = (state: Post[], type: string) => {
    return state.filter(post => post.type === type);
}

export const { makePost, toggleLike, loadPosts } = postSlice.actions;
export { postSlice };
export default postSlice.reducer;