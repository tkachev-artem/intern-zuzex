'use client'

import { useState, useEffect } from 'react'
import { Button, Stack, Separator, Text } from '@chakra-ui/react'
import { Input, Textarea } from '@saas-ui/react'
import './PostForm.scss'
import { PhotoPreviewUpload } from './FileUpload'
import { PostTypeSelect } from './PostTypeSelect'
import { DirectionSelect } from './DirectionSelect'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { makePost, editPost, type Post } from '@/features/posts/postSlice'
import { selectUserNickname, selectIsAuthenticated } from '@/features/auth/authSlice'

// тип пропсов для компонента формы
type PostFormProps = {
  editingPost?: Post; // пост для редактирования (если передан)
  onPostUpdated?: () => void; // колбэк после успешного обновления/создания
}

// форма для создания нового поста или редактирования существующего
export const PostForm = ({ editingPost, onPostUpdated }: PostFormProps) => {
  // локальные состояния для полей формы
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [postType, setPostType] = useState('')
  const [direction, setDirection] = useState('')
  const [image, setImage] = useState<string | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(false)

  const dispatch = useAppDispatch()
  const userNickname = useAppSelector(selectUserNickname)
  const isAuthenticated = useAppSelector(selectIsAuthenticated)

  // режим редактирования или создания
  const isEditMode = !!editingPost

  // заполняем поля данными редактируемого поста
  useEffect(() => {
    if (editingPost) {
      setTitle(editingPost.title)
      setContent(editingPost.content)
      setPostType(editingPost.type)
      setDirection(editingPost.direction)
      setImage(editingPost.previewImage ?? undefined)
    }
  }, [editingPost])

  // обработчик отправки формы
  const handleSubmit = () => {
    //проверка на заполнение обязательных полей
    if (!title || !content) {
      console.log('ошибка: не заполнены обязательные поля');
      return;
    }
    
    //проверка на авторизацию
    if (!isAuthenticated || !userNickname) {
      console.log('ошибка: пользователь не авторизован');
      return;
    }

    //проверка на длину заголовка
    if (title.length > 100) {
      console.log('ошибка: заголовок слишком длинный (максимум 100 символов)');
      return;
    }

    //проверка на длину коннтента
    if (content.length > 20000) {
      console.log('ошибка: текст слишком длинный (максимум 20000 символов)');
      return;
    }
    
    if (editingPost) {
      // редактируем существующий пост
      const updatedPost: Post = {
        ...editingPost,
        title,
        content,
        type: (postType || 'Контент') as 'Контент' | 'Событие' | 'Вакансия',
        direction: direction || 'Frontend',
        previewImage: image ?? ''
      };

      dispatch(editPost(updatedPost));
      console.log('Пост успешно обновлён');
    } else {
    // создаём новый пост
      const newPost: Post = {
      id: Date.now().toString(),
      title,
      content,
      author: userNickname,
      type: (postType || 'Контент') as 'Контент' | 'Событие' | 'Вакансия',
      direction: direction || 'Frontend',
      likes: 0,
      likedBy: [],
      previewImage: image ?? ''
    };

    dispatch(makePost(newPost));
      console.log('Пост успешно создан');
    }
    
    // вызываем колбэк если передан
    onPostUpdated?.();
    
    // очищаем форму только при создании нового поста
    if (!isEditMode) {
    setTitle('');
    setContent('');
    setPostType('');
    setDirection('');
    setImage(undefined);
    }
  }

  // проверяем, все ли поля заполнены и пользователь авторизован
  const isFormValid = title && content && postType && direction && isAuthenticated && userNickname;

  return (
    <Stack>
      {/* поле для заголовка */}
      <Text className="form-label">Заголовок</Text>
      <Stack className="form-field">
        <Input 
          placeholder="Заголовок поста" 
          value={title}
          onChange={(e) => {
            if (e.target.value.length <= 100) {
              setTitle(e.target.value)
            }
          }}
          maxLength={100}
          size="md"
          className="form-input"
        />
        {/* отображаем количество символов в заголовке */}
        <Text className="form-counter">
          {title.length} / 100 символов
        </Text>
      </Stack>
      
      {/* поле для содержания */}
      <Text className="form-label">Содержание</Text>
      <Stack className="form-field">
        <Textarea 
          placeholder="Содержание поста (поддерживается Markdown)" 
          value={content}
          onChange={(e) => { 
            if (e.target.value.length <= 20000) {
              setContent(e.target.value)
            }
          }}
          rows={8}
          maxLength={20000}
          size="md"
          className="form-textarea"
        />
        {/* отображаем количество символов в содержании */}
        <Text className="form-counter">
          {content.length} / 20000 символов
        </Text>
      </Stack>


      {/* селекторы типа и направления в две колонки */}
      <Stack className="form-selectors">
        <Stack className="form-selector">
          <PostTypeSelect
            label="Тип поста"
            placeholder="Выберите тип поста"
            value={postType}
            onChange={setPostType}
          />
        </Stack>
        <Stack className="form-selector">
          <DirectionSelect
            label="Направление"
            placeholder="Выберите направление"
            value={direction}
            onChange={setDirection}
          />
        </Stack>
      </Stack>

      <Separator className="form-separator" />

      {/* компонент для загрузки и предпросмотра фото */}
      <PhotoPreviewUpload image={image} setImage={setImage} setIsLoading={setIsLoading} /> 

      {/* кнопка для создания/обновления поста */}
      <Stack className="form-submit">
        <Button 
          onClick={handleSubmit}
          colorScheme="blue"
          size="lg"
          width="full"
          disabled={!isFormValid || isLoading}
          loading={isLoading}
          loadingText={isEditMode ? "Сохранение..." : "Создание..."}
          className="form-button"
        >
          {isEditMode ? 'Сохранить изменения' : 'Создать пост'}
        </Button>
        
        {/* если пользователь не авторизован — показываем предупреждение */}
        {!isAuthenticated && (
          <Text className="form-warning">
            Для создания поста необходимо авторизоваться
          </Text>
        )}
      </Stack>
    </Stack>
  )
}