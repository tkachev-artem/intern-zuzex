import { Button } from "@chakra-ui/react"
import { useAppDispatch, useAppSelector } from "@/app/hooks"
import { useEffect } from "react";
import { useLocation } from 'react-router-dom';

import { getProfile, addWorkplace, addDescription } from "@/features/profile/profileSlice"; // для получения профиля
import { selectUser } from "@/features/auth/authSlice"; // для получения пользователя
import { deleteProject, makeProject } from "@/features/projects/projectSlice";
import { ProfileHeader } from "@/components/ProfileHeader/ProfileHeader";
import { PortfolioBlock } from "@/components/PortfolioBlock/PortfolioBlock";

export const Profile = () => {

    const dispatch = useAppDispatch();

    const user = useAppSelector(selectUser);
    console.log("Авторизованный пользователь: ", user);

    // Загружаем профиль при инициализации компонента
    useEffect(() => {
        if (user?.id) {
            dispatch(getProfile(user.id));
        }
    }, [user?.id, dispatch]);

    const location = useLocation();

    const isMyProfile = location.pathname === '/profile';
    const profileNickname = isMyProfile ? user?.nickname : location.pathname.split('/').pop(); 
    const isAuthor = isMyProfile || user?.nickname === profileNickname;

    return (
        <div>
            <h1>Profile</h1>
            <ProfileHeader />

            {/* Блок портфолио */}
            <PortfolioBlock 
                userId={user?.id} 
                showActions={isAuthor}
                title="Мои проекты"
            />

            {/* Кнопки для тестирования */}
            <div style={{ padding: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <Button onClick={() => {
                    dispatch(makeProject({
                        id: `project_${Date.now().toString()}`,
                        title: "Тестовый проект",
                        description: "Описание тестового проекта для демонстрации портфолио",
                        links: ["https://github.com/test/project", "https://project-demo.com"],
                        previewImage: "https://i.pinimg.com/originals/19/89/44/198944ea9f57d70ea850fc868efbd4b6.jpg",
                    }));
                }}>
                    Создать проект
                </Button>

                <Button onClick={() => {
                        dispatch(deleteProject("1"));
                }}>
                    Удалить проект
                </Button>

                <Button onClick={() => {
                    dispatch(addWorkplace("Место работы"));
                    dispatch(addDescription("Описание профиля"));
                }}>
                    Добавить данные в профиль
                </Button>
            </div>
        </div>
    )
}