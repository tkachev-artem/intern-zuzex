'use client'

import { useState, useEffect } from 'react'
import { Button, Stack, Separator, Text } from '@chakra-ui/react'
import { Input, Textarea } from '@saas-ui/react'
import '../PostForm/PostForm.scss'
import { PhotoPreviewUpload } from '../PostForm/FileUpload'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { makeProject, type Project } from '@/features/projects/projectSlice'
import { selectUserNickname, selectIsAuthenticated } from '@/features/auth/authSlice'
import { addProjectToPortfolio } from '@/features/profile/profileSlice'
import { authLocalAPI } from '@/LocalAPI'

// тип пропсов для компонента формы
type ProjectFormProps = {
  editingProject?: Project; // проект для редактирования (если передан)
  onProjectUpdated?: () => void; // колбэк после успешного обновления/создания
}

// форма для создания нового проекта или редактирования существующего
export const ProjectForm = ({ editingProject, onProjectUpdated }: ProjectFormProps) => {
  // локальные состояния для полей формы
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [links, setLinks] = useState('')
  const [image, setImage] = useState<string | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(false)

  const dispatch = useAppDispatch()
  const userNickname = useAppSelector(selectUserNickname)
  const isAuthenticated = useAppSelector(selectIsAuthenticated)

  // режим редактирования или создания
  const isEditMode = !!editingProject

  // заполняем поля данными редактируемого проекта
  useEffect(() => {
    if (editingProject) {
      setTitle(editingProject.title)
      setDescription(editingProject.description ?? '')
      setLinks(editingProject.links.join('\n'))
      setImage(editingProject.previewImage ?? undefined)
    }
  }, [editingProject])

  // обработчик отправки формы
  const handleSubmit = () => {
    // проверка на заполнение обязательных полей
    if (!title || !description) {
      console.log('ошибка: не заполнены обязательные поля');
      return;
    }
    
    // проверка на авторизацию
    if (!isAuthenticated || !userNickname) {
      console.log('ошибка: пользователь не авторизован');
      return;
    }

    // проверка на длину заголовка
    if (title.length > 100) {
      console.log('ошибка: заголовок слишком длинный (максимум 100 символов)');
      return;
    }

    // проверка на длину описания
    if (description.length > 2000) {
      console.log('ошибка: описание слишком длинное (максимум 2000 символов)');
      return;
    }
    
    if (isEditMode) {
      // TODO: добавить редактирование проекта когда будет editProject action
      console.log('Редактирование проектов пока не реализовано');
    } else {
      // создаём новый проект
      const linksArray = links
        .split('\n')
        .map(link => link.trim())
        .filter(link => link.length > 0)

      const newProject: Project = {
        id: Date.now().toString(),
        title,
        description,
        links: linksArray,
        previewImage: image ?? ''
      };

      // Добавляем проект в общий массив проектов
      dispatch(makeProject(newProject));
      
      // Добавляем проект в портфолио текущего пользователя
      dispatch(addProjectToPortfolio(newProject));
      
      // Также добавляем проект в портфолио пользователя в localStorage
      authLocalAPI.addProjectToUserPortfolio(userNickname, newProject);
      
      console.log('Проект успешно создан');
    }
    
    // вызываем колбэк если передан
    onProjectUpdated?.();
    
    // очищаем форму только при создании нового проекта
    if (!isEditMode) {
      setTitle('');
      setDescription('');
      setLinks('');
      setImage(undefined);
    }
  }

  // проверяем, все ли поля заполнены и пользователь авторизован
  const isFormValid = title && description && isAuthenticated && userNickname;

  return (
    <Stack>
      {/* поле для заголовка */}
      <Text className="form-label">Название проекта</Text>
      <Stack className="form-field">
        <Input 
          placeholder="Название вашего проекта" 
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
      
      {/* поле для описания */}
      <Text className="form-label">Описание проекта</Text>
      <Stack className="form-field">
        <Textarea 
          placeholder="Опишите ваш проект (поддерживается Markdown)" 
          value={description}
          onChange={(e) => { 
            if (e.target.value.length <= 2000) {
              setDescription(e.target.value)
            }
          }}
          rows={6}
          maxLength={2000}
          size="md"
          className="form-textarea"
        />
        {/* отображаем количество символов в описании */}
        <Text className="form-counter">
          {description.length} / 2000 символов
        </Text>
      </Stack>

      {/* поле для ссылок */}
      <Text className="form-label">Ссылки на проект</Text>
      <Stack className="form-field">
        <Textarea 
          placeholder={`GitHub: https://github.com/username/project\nDemo: https://project-demo.com\nОдна ссылка на строку`}
          value={links}
          onChange={(e) => { 
            if (e.target.value.length <= 1000) {
              setLinks(e.target.value)
            }
          }}
          rows={4}
          maxLength={1000}
          size="md"
          className="form-textarea"
        />
        {/* отображаем количество символов в ссылках */}
        <Text className="form-counter">
          {links.length} / 1000 символов
        </Text>
      </Stack>

      <Separator className="form-separator" />

      {/* компонент для загрузки и предпросмотра фото */}
      <PhotoPreviewUpload image={image} setImage={setImage} setIsLoading={setIsLoading} /> 

      {/* кнопка для создания/обновления проекта */}
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
          {isEditMode ? 'Сохранить изменения' : 'Создать проект'}
        </Button>
        
        {/* если пользователь не авторизован — показываем предупреждение */}
        {!isAuthenticated && (
          <Text className="form-warning">
            Для создания проекта необходимо авторизоваться
          </Text>
        )}
      </Stack>
    </Stack>
  )
}
