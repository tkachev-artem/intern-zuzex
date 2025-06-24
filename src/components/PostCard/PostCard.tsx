'use client'

import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { likePostByUser, deletePost } from '@/features/posts/postSlice';
import type { Post } from '@/features/posts/postSlice'; 
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

import ReactMarkdown from 'react-markdown'

import './PostCard.scss'

import { Badge, HStack, Image, Text, Button } from '@chakra-ui/react'
import { Card, IconButton } from '@saas-ui/react'
import { LuAtSign, LuPencil, LuTrash2 } from 'react-icons/lu'
import { HiHeart } from 'react-icons/hi'
import { selectUserNickname } from '@/features/auth/authSlice';
import { selectUserId } from '@/features/auth/authSlice';
import { ConfirmationModal } from '../ConfirmationModal';



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
    onEditPost?: (post: Post) => void; // колбэк для редактирования поста
};

// компонент карточки поста
export const PostCard = ({ post, onEditPost }: PostCardProps) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const userNickname = useAppSelector(selectUserNickname); // строка или undefined/null
    const userId = useAppSelector(selectUserId); // строка или undefined/null
    
    // состояние для модального окна удаления
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    
    // проверяем, является ли текущий пользователь автором поста
    const isAuthor = userNickname && post.author === userNickname;

    // обработчик лайка
    const handleLike = () => {
        if (userId) {
            dispatch(likePostByUser({ postId: post.id, userId: userId }));
        }
    };

    // обработчик удаления поста
    const handleDelete = () => {
        dispatch(deletePost(post.id));
        setIsDeleteModalOpen(false);
    };

    // обработчик редактирования поста
    const handleEdit = () => {
        if (onEditPost) {
            onEditPost(post);
        }
    };

    // обработчик навигации к полному посту
    const handleNavigateToPost = () => {
        void navigate(`/post/${post.id}`);
    };

    // обработчик навигации к профилю автора
    const handleNavigateToAuthor = () => {
        void navigate(`/${post.author}`);
    };

    // обработчик открытия модального окна удаления
    const handleOpenDeleteModal = () => {
        setIsDeleteModalOpen(true);
    };

    // обработчик закрытия модального окна удаления
    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false);
    };

    return (
        <>
        <Card.Root overflow="hidden" className='card-root'>
            <Card.Header>
                    <HStack gap="2" justify="space-between" width="full">
                <HStack gap="2">
                    {/* тип поста */}
                            <Badge className='badge-tag' colorPalette="gray">{post.type}</Badge>
                    {/* направление поста */}
                            <Badge className='badge-tag' colorPalette={getColor(post.direction)}>{post.direction}</Badge>
                        </HStack>
                        
                        {/* кнопки редактирования и удаления для автора */}
                        {isAuthor && (
                            <HStack gap="1">
                                <IconButton
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleEdit}
                                    aria-label="Редактировать пост"
                                >
                                    <LuPencil size={16} />
                                </IconButton>
                                <IconButton
                                    variant="ghost"
                                    size="sm"
                                    colorScheme="red"
                                    onClick={handleOpenDeleteModal}
                                    aria-label="Удалить пост"
                                >
                                    <LuTrash2 size={16} />
                                </IconButton>
                            </HStack>
                        )}
                </HStack>
            </Card.Header>

            <Card.Body className='card-body'>
                {/* заголовок поста */}
                <Card.Title className="custom-title">
                    {post.title}
                </Card.Title>

                {/* описание поста (обрезаем если длинное) */}
                <Card.Description className="custom-description">
                    <ReactMarkdown>
                        {post.content.length > 500 ? post.content.slice(0, 500) + '...' : post.content}
                    </ReactMarkdown>

                    {post.content.length > 500 && (
                        <Button variant="outline" size="md" marginLeft={4} paddingInline={4} onClick={handleNavigateToPost}>
                            <Text textStyle="md">Читать далее</Text>
                        </Button>
                    )}
                </Card.Description>

                {/* если есть картинка — показываем её */}
                {post.previewImage && 
                <Image 
                    rounded="md"  
                    src={post.previewImage} 
                    alt="Изображение к посту"
                    w="100%"
                    h="350px"
                    fit="cover"
                />}
            </Card.Body>

            <Card.Footer className='card-footer'>
                {/* автор поста */}
                <Badge 
                    className='badge-tag' 
                    variant="solid" 
                    colorPalette={getPostAuthorColor(post, userNickname ?? '')}
                    cursor="pointer"
                    fontSize="1rem"
                    paddingInline="16px"
                    paddingTop="8px"
                    paddingBottom="8px"
                        onClick={handleNavigateToAuthor}
                >
                    <LuAtSign />
                    {post.author}
                </Badge>

                {/* кнопка лайка */}
                <IconButton variant="subtle" size="md" onClick={handleLike} className='like-button'>
                    <HiHeart color={post.likedBy.includes(userId ?? '') ? 'red' : 'gray'} size={20} />
                    <Text textStyle="md">{post.likes}</Text>
                </IconButton>
            </Card.Footer>
        </Card.Root>

            {/* модальное окно подтверждения удаления */}
            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={handleCloseDeleteModal}
                onConfirm={handleDelete}
                title="Подтверждение удаления"
                message={`Вы действительно хотите удалить пост "${post.title}"? Это действие нельзя отменить.`}
                confirmText="Удалить"
                cancelText="Отмена"
                variant="danger"
            />
        </>
    );
};

export default PostCard