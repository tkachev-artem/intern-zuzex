import { Stack, Box, Container } from "@chakra-ui/react"
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
    
    // определяем чей это профиль
    const isMyProfile = location.pathname === '/profile';
    const targetNickname = isMyProfile ? currentUser?.nickname : username;
    const isAuthor = isMyProfile || currentUser?.nickname === targetNickname;

    // загружаем профиль при инициализации компонента
    useEffect(() => {
        if (isMyProfile && currentUser?.id) {
            // если это мой профиль - загружаем по ID
            dispatch(getProfile(currentUser.id));
        } else if (username) {
            // если это профиль другого пользователя - загружаем по nickname
            try {
                dispatch(getProfileByNickname(username));
            } catch (error) {
                console.error(`Ошибка загрузки профиля пользователя ${username}:`, error);
            }
        }
    }, [isMyProfile, currentUser?.id, username, dispatch]);

    return (
        <Box minHeight="100vh" bg="gray.50">
            <HomeNavbar />

            <Container 
                maxWidth={{ base: "100%", md: "container.md", lg: "container.lg" }}
                paddingX={{ base: "4", md: "6", lg: "8" }}
                paddingY="6"
            >
                <Stack 
                    gap={{ base: "6", md: "8" }}
                    align="center"
                    width="100%"
                >
                    {/* блок профиля */}
                    <Box width="100%" maxWidth="800px">
                        <ProfileHeader />
                    </Box>

                    {/* блок портфолио */}
                    <Box width="100%" maxWidth="800px">
                        <PortfolioBlock 
                            userId={profileData.id} 
                            showActions={isAuthor}
                            title={isMyProfile ? "Мои проекты" : "Проекты"}
                        />
                    </Box>
                </Stack>
            </Container>
        </Box>
    )
}