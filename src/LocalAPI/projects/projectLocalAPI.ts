import type { Project } from "@/features/projects/projectSlice";
import { storageLocalAPI } from "@/LocalAPI/storage/storageLocalAPI";

// получаем все проекты из портфолио всех пользователей
const getProjects = (): Project[] => {
    const data = storageLocalAPI.getStorageData();
    if (!data) return [];
    
    // собираем все проекты из портфолио всех пользователей
    const allProjects: Project[] = [];
    data.users.forEach(user => {
        allProjects.push(...user.portfolio);
    });
    
    return allProjects;
}

// получаем проекты конкретного пользователя
const getProjectsByUser = (userNickname: string): Project[] => {
    const data = storageLocalAPI.getStorageData();
    if (!data) return [];
    
    const user = data.users.find(u => u.nickname === userNickname);
    return user?.portfolio ?? [];
}

// создаём проект в портфолио пользователя
const createProject = (project: Project, userNickname?: string): void => {
    if (!userNickname) {
        console.log('Для создания проекта необходимо указать пользователя');
        return;
    }

    const data = storageLocalAPI.getStorageData();
    if (!data) return;

    const userIndex = data.users.findIndex(u => u.nickname === userNickname);
    if (userIndex === -1) {
        console.log(`Пользователь ${userNickname} не найден`);
        return;
    }

    // добавляем проект в портфолио пользователя
    data.users[userIndex].portfolio.push(project);

    storageLocalAPI.saveStorageData(
        data.users,
        data.auth.isAuthenticated,
        data.auth.user,
        data.posts
    );
}

// обновляем проект в портфолио пользователя
const updateProject = (updated: Project, userNickname?: string): void => {
    const data = storageLocalAPI.getStorageData();
    if (!data) return;

    // если пользователь не указан, ищем проект во всех портфолио
    if (!userNickname) {
        for (const user of data.users) {
            const projectIndex = user.portfolio.findIndex(p => p.id === updated.id);
            if (projectIndex !== -1) {
                user.portfolio[projectIndex] = updated;
                storageLocalAPI.saveStorageData(
                    data.users,
                    data.auth.isAuthenticated,
                    data.auth.user,
                    data.posts
                );
                return;
            }
        }
        console.log(`Проект с id ${updated.id} не найден`);
        return;
    }

    // если пользователь указан, ищем только в его портфолио
    const userIndex = data.users.findIndex(u => u.nickname === userNickname);
    if (userIndex === -1) {
        console.log(`Пользователь ${userNickname} не найден`);
        return;
    }

    const projectIndex = data.users[userIndex].portfolio.findIndex(p => p.id === updated.id);
    if (projectIndex !== -1) {
        data.users[userIndex].portfolio[projectIndex] = updated;
        storageLocalAPI.saveStorageData(
            data.users,
            data.auth.isAuthenticated,
            data.auth.user,
            data.posts
        );
    } else {
        console.log(`Проект с id ${updated.id} не найден в портфолио пользователя ${userNickname}`);
    }
}

// удаляем проект из портфолио пользователя
const deleteProject = (id: string, userNickname?: string): void => {
    const data = storageLocalAPI.getStorageData();
    if (!data) return;

    // если пользователь не указан, ищем проект во всех портфолио
    if (!userNickname) {
        for (const user of data.users) {
            const projectIndex = user.portfolio.findIndex(p => p.id === id);
            if (projectIndex !== -1) {
                user.portfolio.splice(projectIndex, 1);
                storageLocalAPI.saveStorageData(
                    data.users,
                    data.auth.isAuthenticated,
                    data.auth.user,
                    data.posts
                );
                return;
            }
        }
        console.log(`Проект с id ${id} не найден`);
        return;
    }

    // если пользователь указан, ищем только в его портфолио
    const userIndex = data.users.findIndex(u => u.nickname === userNickname);
    if (userIndex === -1) {
        console.log(`Пользователь ${userNickname} не найден`);
        return;
    }

    const projectIndex = data.users[userIndex].portfolio.findIndex(p => p.id === id);
    if (projectIndex !== -1) {
        data.users[userIndex].portfolio.splice(projectIndex, 1);
        storageLocalAPI.saveStorageData(
            data.users,
            data.auth.isAuthenticated,
            data.auth.user,
            data.posts
        );
    } else {
        console.log(`Проект с id ${id} не найден в портфолио пользователя ${userNickname}`);
    }
};

// экспорт всех функций
export const projectLocalAPI = { 
    getProjects, 
    getProjectsByUser, 
    createProject, 
    updateProject, 
    deleteProject 
};