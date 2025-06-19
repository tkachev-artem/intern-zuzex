'use client'

import { useAppDispatch } from '@/app/hooks';
import { toggleLike } from '@/features/posts/postSlice';
import type { Post } from '@/features/posts/postSlice'; 
import type { FC } from 'react';

import './PostCard.scss'

import { Badge, HStack, Image, Text, Link } from '@chakra-ui/react'
import { Card, IconButton } from '@saas-ui/react'
import { HiAtSymbol } from 'react-icons/hi'
import { HiHeart } from 'react-icons/hi'

// тип для пропсов карточки поста
type PostCardProps = {
    post: Post;
};

// компонент карточки поста
export const PostCard: FC<PostCardProps> = ({ post }) => {
    const dispatch = useAppDispatch();

    // обработчик лайка
    const handleLike = () => {
        dispatch(toggleLike(post.id));
    };

    return (
        <Card.Root maxW="sm" overflow="hidden" className='card-root'>
            <Card.Header>
                <HStack gap="2">
                    {/* тип поста */}
                    <Badge className='badge' size="md" colorPalette="gray">{post.type}</Badge>
                    {/* направление поста */}
                    <Badge className='badge' size="md" colorPalette="green">{post.direction}</Badge>
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
                    <Badge variant="solid" size="md" colorPalette="green" className='badge'>
                        <HiAtSymbol />
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