'use client'

import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { toggleLike } from '@/features/posts/postSlice';
import type { Post } from '@/features/posts/postSlice'; 
import type { FC } from 'react';

import './PostCard.scss'

import { Badge, HStack, Image, Text, Link } from '@chakra-ui/react'
import { Card, IconButton } from '@saas-ui/react'
import { LuAtSign } from 'react-icons/lu'
import { HiHeart } from 'react-icons/hi'
import { selectUserNickname } from '@/features/auth/authSlice';

// цвета для направления поста

const getColor = (direction: string) => {
    switch (direction) {
        case 'Фронтенд':
            return 'green';
        case 'Бэкенд':
            return 'blue';
        case 'Тестирование':
            return 'red';
        case 'Дизайн':
            return 'purple';
        case 'Менеджмент':
            return 'orange';
        case 'Маркетинг':
            return 'yellow';
        default:
            return 'gray';
    }
}

//указатель того, что пост создан пользователем

const isUserPost = (post: Post, userNickname: string) => {
    if (post.author === userNickname) {
        return true;
    }
    return false;
}

const getPostAuthorColor = (post: Post, userNickname: string) => {
    if (isUserPost(post, userNickname)) {
        return 'green';
    }
    return 'gray';
}


// тип для пропсов карточки поста
type PostCardProps = {
    post: Post;
};

// компонент карточки поста
export const PostCard: FC<PostCardProps> = ({ post }) => {
    const dispatch = useAppDispatch();
    const userNickname = useAppSelector(selectUserNickname); // строка или undefined/null
    // обработчик лайка
    const handleLike = () => {
        dispatch(toggleLike(post.id));
    };

    return (
        <Card.Root overflow="hidden" className='card-root'>
            <Card.Header>
                <HStack gap="2">
                    {/* тип поста */}
                    <Badge className='badge' size="md" colorPalette="gray">{post.type}</Badge>
                    {/* направление поста */}
                    <Badge className='badge' size="md" colorPalette={getColor(post.direction)}>{post.direction}</Badge>
                </HStack>
            </Card.Header>

            <Card.Body className='card-body'>
                {/* заголовок поста */}
                <Card.Title className="custom-title">
                    {post.title}
                </Card.Title>

                {/* описание поста (обрезаем если длинное) */}
                <Card.Description className="custom-description">
                    {post.content.length > 500 ? post.content.slice(0, 500) + '...' : post.content}
                </Card.Description>

                {/* если есть картинка — показываем её */}
                {post.previewImage && 
                <Image 
                    rounded="md"  
                    src={post.previewImage} 
                    alt="image"
                    h="200px"
                    fit="cover"                
                />}
            </Card.Body>

            <Card.Footer className='card-footer'>
                {/* автор поста */}
                <Link href={`/${post.author}`}>
                    <Badge variant="solid" size="md" colorPalette={getPostAuthorColor(post, userNickname ?? '')} className='badge'>
                        <LuAtSign />
                        {post.author} 
                    </Badge>
                </Link>

                {/* кнопка лайка */}
                <IconButton variant="subtle" size="md" onClick={handleLike} className='like-button'>
                    <HiHeart color={post.isLikedByUser ? 'red' : 'gray'} size={20} />
                    <Text textStyle="md">{post.likes}</Text>
                </IconButton>
            </Card.Footer>
        </Card.Root>
    );
};

export default PostCard