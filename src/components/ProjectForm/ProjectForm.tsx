'use client'

import { useState, useEffect } from 'react'
import { Button, Stack, Separator, Text } from '@chakra-ui/react'
import { Input, Textarea, Alert } from '@saas-ui/react'
import '../PostForm/PostForm.scss'
import { PhotoPreviewUpload } from '../PostForm/FileUpload'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import type { Project, ProjectLink } from '@/features/projects/projectSlice'
import { selectUserNickname, selectIsAuthenticated } from '@/features/auth/authSlice'
import { addProjectToPortfolio, updateProjectInPortfolio } from '@/features/profile/profileSlice'
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
  const [links, setLinks] = useState<ProjectLink[]>([
    { name: '', url: '' },
    { name: '', url: '' },
    { name: '', url: '' }
  ])
  const [image, setImage] = useState<string | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

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
      // заполняем 3 слота ссылок данными из проекта
      const projectLinks = [...editingProject.links]
      const newLinks: ProjectLink[] = [
        projectLinks[0] || { name: '', url: '' },
        projectLinks[1] || { name: '', url: '' },
        projectLinks[2] || { name: '', url: '' }
      ]
      setLinks(newLinks)
      setImage(editingProject.previewImage ?? undefined)
    }
  }, [editingProject])

  // обработчики изменения полей с очисткой ошибок
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= 100) {
      setTitle(e.target.value)
      if (errors.title) {
        setErrors(prev => ({ ...prev, title: '' }))
      }
    }
  }

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= 2000) {
      setDescription(e.target.value)
      if (errors.description) {
        setErrors(prev => ({ ...prev, description: '' }))
      }
    }
  }

  const handleLinkNameChange = (index: number, value: string) => {
    if (value.length <= 50) {
      const newLinks = links.map((link, i) => {
        if (i === index) {
          return { ...link, name: value }
        }
        return link
      })
      setLinks(newLinks)
    }
  }

  const handleLinkUrlChange = (index: number, value: string) => {
    if (value.length <= 200) {
      const newLinks = links.map((link, i) => {
        if (i === index) {
          return { ...link, url: value }
        }
        return link
      })
      setLinks(newLinks)
    }
  }

  // валидация формы
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!title.trim()) {
      newErrors.title = 'Название проекта обязательно для заполнения'
    }

    if (!description.trim()) {
      newErrors.description = 'Описание проекта обязательно для заполнения'
    }

    if (!isAuthenticated || !userNickname) {
      newErrors.auth = 'Необходимо авторизоваться для создания проекта'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // обработчик отправки формы
  const handleSubmit = () => {
    setIsLoading(true)
    
    // валидация формы
    if (!validateForm()) {
      setIsLoading(false)
      return
    }
    
    if (isEditMode) {
      // редактируем существующий проект
      const validLinks = links.filter(link => link.url.trim())

      const updatedProject: Project = {
        ...editingProject,
        title,
        description,
        links: validLinks,
        previewImage: image
      };

      // обновляем проект в портфолио пользователя
      dispatch(updateProjectInPortfolio(updatedProject));
      
      // также обновляем проект в портфолио пользователя в localStorage
      if (userNickname) {
        authLocalAPI.updateProjectInUserPortfolio(userNickname, updatedProject);
      }
    } else {
      // создаём новый проект
      const validLinks = links.filter(link => link.url.trim())

      const newProject: Project = {
        id: Date.now().toString(),
        title,
        description,
        links: validLinks,
        previewImage: image
      };

      // добавляем проект в портфолио текущего пользователя
      dispatch(addProjectToPortfolio(newProject));
      
      // также добавляем проект в портфолио пользователя в localStorage
      if (userNickname) {
        authLocalAPI.addProjectToUserPortfolio(userNickname, newProject);
      }
    }
    
    // вызываем колбэк если передан
    onProjectUpdated?.();
    
    // очищаем форму только при создании нового проекта
    if (!isEditMode) {
      setTitle('');
      setDescription('');
      setLinks([
        { name: '', url: '' },
        { name: '', url: '' },
        { name: '', url: '' }
      ]);
      setImage(undefined);
      setErrors({});
    }
    
    setIsLoading(false);
  }

  return (
    <Stack>
      {/* поле для заголовка */}
      <Text className="form-label">Название проекта *</Text>
      <Stack className="form-field">
        <Input 
          placeholder="Название вашего проекта" 
          value={title}
          onChange={handleTitleChange}
          maxLength={100}
          size="md"
          className="form-input"
        />
        {errors.title && (
          <Alert
            status="error"
            title={errors.title}
            padding="2"
            alignItems="center"
          />
        )}
        <Text className="form-counter">
          {title.length} / 100 символов
        </Text>
      </Stack>
      
      {/* поле для описания */}
      <Text className="form-label">Описание проекта *</Text>
      <Stack className="form-field">
        <Textarea 
          placeholder="Опишите ваш проект (поддерживается Markdown)" 
          value={description}
          onChange={handleDescriptionChange}
          rows={6}
          maxLength={2000}
          size="md"
          className="form-textarea"
        />
        {errors.description && (
          <Alert
            status="error"
            title={errors.description}
            padding="2"
            alignItems="center"
          />
        )}
        <Text className="form-counter">
          {description.length} / 2000 символов
        </Text>
      </Stack>

      {/* поле для ссылок */}
      <Text className="form-label">Ссылки на проект (до 3 ссылок)</Text>
      <Stack className="form-field" gap="3">
        {links.map((link, index) => (
          <Stack key={index} direction="row" gap="2">
            <Input 
              placeholder="Название ссылки"
              value={link.name}
              onChange={(e) => { handleLinkNameChange(index, e.target.value) }}
              maxLength={50}
              size="md"
              className="form-input"
              flex="1"
            />
            <Input 
              placeholder="https://..."
              value={link.url}
              onChange={(e) => { handleLinkUrlChange(index, e.target.value) }}
              maxLength={200}
              size="md"
              className="form-input"
              flex="2"
            />
          </Stack>
        ))}
      </Stack>

      <Separator className="form-separator" />

      {/* компонент для загрузки и предпросмотра фото */}
      <PhotoPreviewUpload image={image} setImage={setImage} setIsLoading={setIsLoading} /> 

      {/* общие ошибки формы */}
      {errors.auth && (
        <Alert
          status="error"
          title={errors.auth}
          padding="2"
          alignItems="center"
        />
      )}

      {/* кнопка для создания/обновления проекта */}
      <Stack className="form-submit">
        <Button 
          onClick={handleSubmit}
          colorScheme="blue"
          size="lg"
          width="full"
          disabled={isLoading || !isAuthenticated}
          loading={isLoading}
          loadingText={isEditMode ? "Сохранение..." : "Создание..."}
          className="form-button"
        >
          {isEditMode ? 'Сохранить изменения' : 'Создать проект'}
        </Button>
      </Stack>
    </Stack>
  )
}
