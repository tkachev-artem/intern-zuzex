import { createAppSlice } from "@/app/createAppSlice"
import type { PayloadAction } from "@reduxjs/toolkit";
import { postLocalAPI } from "@/LocalAPI";

// типы постов
export type Post = {
    id: string;
    title: string;
    content: string;
    author: string;
    type: 'Контент' | 'Событие' | 'Вакансия';
    direction: string;
    likes: number;
    likedBy: string[]; //здесь я заменил isLikedByUser на likedBy, это массив id пользователей, которые лайкнули пост
    previewImage?: string;
}

const initialState: Post[] = postLocalAPI.getPosts();

const postSlice = createAppSlice({ //создание слайса постов
    name: "posts",
    initialState,

    reducers: create => ({
        makePost: create.reducer( //создание поста
            (state: Post[], action: PayloadAction<Post>) => {
                state.push(action.payload);
                // Используем LocalAPI для сохранения
                postLocalAPI.createPost(action.payload);
            }
        ),
        //редьюсер для лайка поста по пользователю
        likePostByUser: create.reducer(
            (state: Post[], action: PayloadAction<{postId: string, userId: string}>) => {
                const { postId, userId } = action.payload;

                const post = state.find(p => p.id === postId);

                if (post) {
                    const likeIndex = post.likedBy.indexOf(userId);

                    if (likeIndex === -1) {
                        // добавляем лайк
                        post.likedBy.push(userId);
                        post.likes += 1;
                    } else {
                        // убираем лайк
                        post.likedBy.splice(likeIndex, 1);
                        post.likes -= 1;
                    }

                    // Используем LocalAPI для обновления
                    postLocalAPI.updatePost(post);
                }
            }
        ),

        // редьюсер для удаления поста
        deletePost: create.reducer(
            (state: Post[], action: PayloadAction<string>) => {
                const postId = action.payload;
                const postIndex = state.findIndex(post => post.id === postId);
                
                if (postIndex !== -1) {
                    state.splice(postIndex, 1);
                    // Используем LocalAPI для удаления
                    postLocalAPI.deletePost(postId);
                }
            }
        ),

        // редьюсер для редактирования поста
        editPost: create.reducer(
            (state: Post[], action: PayloadAction<Post>) => {
                const updatedPost = action.payload;
                const postIndex = state.findIndex(post => post.id === updatedPost.id);
                
                if (postIndex !== -1) {
                    state[postIndex] = updatedPost;
                    // Используем LocalAPI для обновления
                    postLocalAPI.updatePost(updatedPost);
                }
            }
        ),

        loadPosts: create.reducer( //загрузка постов из локального хранилища
            (state: Post[]) => {
                // Используем LocalAPI для загрузки
                const posts = postLocalAPI.getPosts();
                state.length = 0;
                state.push(...posts);
            }
        )
    }),
    
    // селекторы для удобного доступа к данным
    selectors: {
        // селектор для получения поста по id
        selectPostById: (state: Post[], postId: string) => {
            return state.find(post => post.id === postId);
        },
        // селектор для получения постов конкретного автора
        selectPostsByAuthor: (state: Post[], author: string) => {
            return state.filter(post => post.author === author);
        }
    }
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

export const { makePost, likePostByUser, deletePost, editPost, loadPosts } = postSlice.actions;
export const { selectPostById, selectPostsByAuthor } = postSlice.selectors;
export { postSlice };
export default postSlice.reducer;