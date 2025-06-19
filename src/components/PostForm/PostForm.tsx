'use client'

import { useState } from 'react'
import { Button, Stack, Separator } from '@chakra-ui/react'
import { Input, Textarea } from '@saas-ui/react'
import { PhotoPreviewUpload } from './FileUpload'
import { PostTypeSelect } from './PostTypeSelect'
import { DirectionSelect } from './DirectionSelect'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { makePost } from '@/features/posts/postSlice'
import { selectUserNickname, selectIsAuthenticated } from '@/features/auth/authSlice'

// форма для создания нового поста
export const PostForm = () => {
  // локальные состояния для полей формы
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [postType, setPostType] = useState('')
  const [direction, setDirection] = useState('')

  const dispatch = useAppDispatch()
  const userNickname = useAppSelector(selectUserNickname)
  const isAuthenticated = useAppSelector(selectIsAuthenticated)

  // обработчик отправки формы
  const handleSubmit = () => {
    // если не заполнены обязательные поля — не отправляем
    if (!title || !content) {
      console.log('Ошибка: Не заполнены обязательные поля');
      return;
    }
    
    // если пользователь не авторизован — не отправляем
    if (!isAuthenticated || !userNickname) {
      console.log('Ошибка: Пользователь не авторизован');
      return;
    }
    
    // создаём новый пост
    const newPost = {
      id: Date.now().toString(),
      title,
      content,
      author: userNickname,
      type: (postType || 'Контент') as 'Контент' | 'Событие' | 'Вакансия',
      direction: direction || 'Frontend',
      likes: 0,
      isLikedByUser: false,
      previewImage: ''
    };

    dispatch(makePost(newPost));
    
    // очищаем форму после создания поста
    setTitle('');
    setContent('');
    setPostType('');
    setDirection('');
  }

  // проверяем, все ли поля заполнены и пользователь авторизован
  const isFormValid = title && content && postType && direction && isAuthenticated && userNickname;

  return (
    <Stack gap={4} width="full">
      {/* отладочная информация по состоянию формы */}
      <Stack gap={1} fontSize="sm" color="gray.500" p={2} bg="gray.50" rounded="md">
        <div>Авторизован: {isAuthenticated ? 'Да' : 'Нет'}</div>
        <div>Пользователь: {userNickname ?? 'Не найден'}</div>
        <div>Заголовок: {title ? 'Заполнен' : 'Пустой'}</div>
        <div>Содержание: {content ? 'Заполнено' : 'Пустое'}</div>
        <div>Тип поста: {postType || 'Не выбран'}</div>
        <div>Направление: {direction || 'Не выбрано'}</div>
      </Stack>

      {/* поле для заголовка */}
      <Input 
        placeholder="Заголовок" 
        value={title}
        onChange={(e) => { setTitle(e.target.value) }}
      />
      
      {/* поле для содержания */}
      <Textarea 
        placeholder="Содержание" 
        value={content}
        onChange={(e) => { setContent(e.target.value) }}
        rows={6}
      />

      {/* селектор типа поста */}
      <PostTypeSelect
        label="Тип поста"
        placeholder="Выберите тип поста"
        onChange={setPostType}
      />

      {/* селектор направления */}
      <DirectionSelect
        label="Направление"
        placeholder="Выберите направление"
        onChange={setDirection}
      />

      <Separator />

      {/* компонент для загрузки и предпросмотра фото */}
      <PhotoPreviewUpload />

      {/* кнопка для создания поста */}
      <Button 
        onClick={handleSubmit}
        colorScheme="blue"
        size="lg"
        width="full"
        mt={4}
        disabled={!isFormValid}
      >
        Создать пост
      </Button>
      
      {/* если пользователь не авторизован — показываем предупреждение */}
      {!isAuthenticated && (
        <Stack gap={2} width="full">
          <div style={{ color: 'red', fontSize: '14px', textAlign: 'center' }}>
            Для создания поста необходимо авторизоваться
          </div>
        </Stack>
      )}
    </Stack>
  )
}