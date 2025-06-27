import { useEffect } from "react";
import { storageLocalAPI } from "@/LocalAPI/storage/storageLocalAPI";
import type { Post } from "@/features/posts/postSlice";

const defaultPosts: Post[] = [
  {
    id: "1",
    title: "2.0 Создание постов и их просмотр, а также фильтрация по направлениям",
    content: "В сервисе появилась возможность создавать посты, в которых можно описывать свои проекты, а также просматривать посты других пользователей. Также появилась возможность фильтровать посты по направлениям, а также ставить лайки.",
    author: "admin",
    type: "Контент",
    direction: "Тестирование",
    likes: 0,
    likedBy: [],
  },
  {
    id: "2",
    title: "3.0 Профили пользователей",
    content: "В сервисе появились профили, в которых отображается информация о пользователе и его проекты, также есть возможность добавить своё место работы и описание профиля. Переходите в профиль, нажав на автарку или посмотрите профиль другого пользователя, нажав на его никнейм.",
    author: "admin",
    type: "Контент",
    direction: "Тестирование",
    likes: 0,
    likedBy: [],
  },
  {
    id: "3",
    title: "Практика завершена. Что получилось изучить по фронтенду?",
    content: `Я, Ткачев Артём, в процессе прохождения практики изучил: основы Redux Toolkit, создавал слайсы и редьюсеры для управления глобальным состоянием, использовал селекторы для получения данных из хранилища. Создавал API-обертки для localStorage, типизировал и структурировал данные (пользователи, посты, проекты, авторизация, регистрация). Работал с localStorage, создавал API-обертки для localStorage, типизировал и структурировал данные (пользователи, посты, проекты, авторизация, регистрация). Улучшил навыки статической типизации, создания интерфейсов и типов для компонентов и данных. Создавал проверку пользовательского ввода в формах, валидацию email, паролей, обязательных полей, обработку ошибок валидации. Использовал компонентную библиотеку Saas-UI, создавал адаптивные интерфейсы, для стилизации использовал с SCSS. В результате получил практический опыт создания полнофункционального веб-приложения с современным стеком технологий и применением лучших практик фронтенд-разработки.`,
    author: "tkachevtech",
    type: "Контент",
    direction: "Фронтенд",
    likes: 0,
    likedBy: [],
  },
];

// хук инициализации постов в localStorage
export const PostsSet = () => {
  useEffect(() => {
    const data = storageLocalAPI.getStorageData();
    if (!data) {
      // если данных нет вообще — создаём с дефолтными постами
      storageLocalAPI.saveStorageData([], false, "", defaultPosts);
      return;
    }

    // проверяем, какие дефолтные посты отсутствуют
    const existingPostIds = data.posts.map(post => post.id);
    const missingDefaultPosts = defaultPosts.filter(
      defaultPost => !existingPostIds.includes(defaultPost.id)
    );

    // если есть недостающие дефолтные посты — добавляем их
    if (missingDefaultPosts.length > 0) {
      const updatedPosts = [...data.posts, ...missingDefaultPosts];
      storageLocalAPI.saveStorageData(
        data.users,
        data.auth.isAuthenticated,
        data.auth.user,
        updatedPosts
      );
    }
  }, []);
};