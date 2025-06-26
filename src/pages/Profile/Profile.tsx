import { Stack } from "@chakra-ui/react"
import { useAppDispatch, useAppSelector } from "@/app/hooks"
import { useEffect } from "react";
import { useLocation, useParams } from 'react-router-dom';

import { getProfile, getProfileByNickname, selectProfile } from "@/features/profile/profileSlice"; // для получения профиля
import { selectUser } from "@/features/auth/authSlice"; // для получения пользователя
import { ProfileHeader } from "@/components/ProfileHeader/ProfileHeader";
import { PortfolioBlock } from "@/components/PortfolioBlock/PortfolioBlock";

import { HomeNavbar } from "@/components/Navbar/Navbar";

export const Profile = () => {

    const dispatch = useAppDispatch();
    const { username } = useParams(); // получаем username из URL
    const location = useLocation();

    const currentUser = useAppSelector(selectUser); // авторизованный пользователь
    const profileData = useAppSelector(selectProfile); // данные профиля для отображения
    
    // Определяем чей это профиль
    const isMyProfile = location.pathname === '/profile';
    const targetNickname = isMyProfile ? currentUser?.nickname : username;
    const isAuthor = isMyProfile || currentUser?.nickname === targetNickname;

    // Загружаем профиль при инициализации компонента
    useEffect(() => {
        if (isMyProfile && currentUser?.id) {
            // Если это мой профиль - загружаем по ID
            dispatch(getProfile(currentUser.id));
        } else if (username) {
            // Если это профиль другого пользователя - загружаем по nickname
            try {
                dispatch(getProfileByNickname(username));
            } catch (error) {
                console.error(`Ошибка загрузки профиля пользователя ${username}:`, error);
            }
        }
    }, [isMyProfile, currentUser?.id, username, dispatch]);

    return (
        <div>
            <HomeNavbar />

            <Stack>

                {/* Блок профиля */}
                <ProfileHeader />

                {/* Блок портфолио */}
                <PortfolioBlock 
                    userId={profileData.id} 
                    showActions={isAuthor}
                    title={isMyProfile ? "Мои проекты" : "Проекты"}
                />
            </Stack>
        </div>
    )
}