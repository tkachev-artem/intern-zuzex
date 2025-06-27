import { useEffect } from "react";
import { storageLocalAPI, type StoredUser } from "@/LocalAPI/storage/storageLocalAPI";

const defaultProfiles: StoredUser[] = [
  {
    id: "admin",
    nickname: "admin",
    firstName: "Админи",
    lastName: "Админов",
    password: "admin123",
    role: "Администратор",
    email: "admin@example.com",
    createdAt: new Date().toISOString(),
    description: "Администратор платформы",
    workplace: "",
    portfolio: []
  },
  {
    id: "tkachevtech",
    nickname: "tkachevtech", 
    firstName: "Артём",
    lastName: "Ткачев",
    password: "123456789A",
    role: "Frontend Developer",
    email: "artem.tkachev@example.com",
    createdAt: new Date().toISOString(),
    description: "Начинающий Frontend-разработчик. Изучаю React, TypeScript, Redux и современные технологии веб-разработки.",
    workplace: 'ИОТ ДГТУ "Школа Икс"',
    portfolio: [
      {
        "id": "1751025267394",
        "title": "Веб-сервис \"ИТ ЛЕНТА\"",
        "description": "Платформа для ИТ-специалистов: просмотр и создание постов, управление профилем и портфолио.",
        "links": [
          {
            "name": "github",
            "url": "https://github.com/tkachev-artem/it-lenta"
          }
        ]
      }
    ]
  }
];

// хук инициализации профилей в localStorage
export const ProfilesSet = () => {
  useEffect(() => {
    const data = storageLocalAPI.getStorageData();
    if (!data) {
      // если данных нет вообще — создаём с дефолтными профилями
      storageLocalAPI.saveStorageData(defaultProfiles, false, "", []);
      return;
    }

    // проверяем, какие дефолтные профили отсутствуют
    const existingUserIds = data.users.map(user => user.id);
    const missingDefaultProfiles = defaultProfiles.filter(
      defaultProfile => !existingUserIds.includes(defaultProfile.id)
    );

    // если есть недостающие дефолтные профили — добавляем их
    if (missingDefaultProfiles.length > 0) {
      const updatedUsers = [...data.users, ...missingDefaultProfiles];
      storageLocalAPI.saveStorageData(
        updatedUsers,
        data.auth.isAuthenticated,
        data.auth.user,
        data.posts
      );
    }
  }, []);
}; 