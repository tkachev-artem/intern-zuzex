'use client'

import { useState, useEffect } from 'react'
import { Button, Stack, Separator, Text } from '@chakra-ui/react'
import { Input, Textarea, Alert } from '@saas-ui/react'
import '../PostForm/PostForm.scss'
import { RoleSelect } from '../RoleSelector/RoleSelector'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { selectProfile, updateProfile } from '@/features/profile/profileSlice'
import { authLocalAPI } from '@/LocalAPI/auth/authLocalAPI'

// тип пропсов для компонента формы редактирования профиля
type ProfileEditFormProps = {
  onProfileUpdated?: () => void; // колбэк после успешного обновления
}

// форма для редактирования профиля
export const ProfileEditForm = ({ onProfileUpdated }: ProfileEditFormProps) => {
  // локальные состояния для полей формы
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [nickname, setNickname] = useState('')
  const [role, setRole] = useState('')
  const [description, setDescription] = useState('')
  const [workplace, setWorkplace] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const dispatch = useAppDispatch()
  const profile = useAppSelector(selectProfile)

  // заполняем поля данными текущего профиля
  useEffect(() => {
    console.log('ProfileEditForm - profile:', profile)
    console.log('ProfileEditForm - profile.role:', profile.role)
    setFirstName(profile.firstName)
    setLastName(profile.lastName)
    setNickname(profile.nickname)
    setRole(profile.role)
    setDescription(profile.description ?? '')
    setWorkplace(profile.workplace ?? '')
  }, [profile])

  // упрощенные обработчики для полей
  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFirstName(e.target.value)
    if (errors.firstName) {
      setErrors(prev => ({ ...prev, firstName: '' }))
    }
  }

  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLastName(e.target.value)
    if (errors.lastName) {
      setErrors(prev => ({ ...prev, lastName: '' }))
    }
  }

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value)
    if (errors.nickname) {
      setErrors(prev => ({ ...prev, nickname: '' }))
    }
  }

  const handleRoleChange = (value: string) => {
    setRole(value)
    if (errors.role) {
      setErrors(prev => ({ ...prev, role: '' }))
    }
  }

  const handleWorkplaceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWorkplace(e.target.value)
    if (errors.workplace) {
      setErrors(prev => ({ ...prev, workplace: '' }))
    }
  }

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value)
    if (errors.description) {
      setErrors(prev => ({ ...prev, description: '' }))
    }
  }

  // исправленная логика валидации формы
  const isFormValid = firstName.trim() && lastName.trim() && nickname.trim() && role.trim()

  // проверка уникальности никнейма
  const checkNicknameUniqueness = () => {
    if (nickname === profile.nickname) {
      return true
    }

    // проверяем уникальность через authLocalAPI
    const existingUser = authLocalAPI.getUserByNickname(nickname)
    if (existingUser) {
      setErrors(prev => ({
        ...prev,
        nickname: 'Этот никнейм уже занят'
      }))
      return false
    }
    
    return true
  }

  // обработчик отправки формы
  const handleSubmit = () => {
    setIsLoading(true)
    
    // валидация формы
    if (!isFormValid) {
      setIsLoading(false)
      return
    }

    // проверка уникальности никнейма
    if (!checkNicknameUniqueness()) {
      setIsLoading(false)
      return
    }

    // обновляем профиль через Redux
    dispatch(updateProfile({
      firstName,
      lastName,
      nickname,
      role,
      description,
      workplace
    }))
    
    // вызываем колбэк если передан
    onProfileUpdated?.()
    
    setIsLoading(false)
  }

  return (
    <Stack>
      {/* поля для имени и фамилии в две колонки */}
      <Stack className="form-selectors">
        <Stack className="form-selector">
          <Text className="form-label">Имя *</Text>
          <Stack className="form-field">
            <Input 
              placeholder="Ваше имя" 
              value={firstName}
              onChange={handleFirstNameChange}
              maxLength={50}
              size="md"
              className="form-input"
            />
            {errors.firstName && (
              <Alert
                status="error"
                title={errors.firstName}
                padding="2"
                alignItems="center"
              />
            )}
            <Text className="form-counter">
              {firstName.length} / 50 символов
            </Text>
          </Stack>
        </Stack>
        
        <Stack className="form-selector">
          <Text className="form-label">Фамилия *</Text>
          <Stack className="form-field">
            <Input 
              placeholder="Ваша фамилия" 
              value={lastName}
              onChange={handleLastNameChange}
              maxLength={50}
              size="md"
              className="form-input"
            />
            {errors.lastName && (
              <Alert
                status="error"
                title={errors.lastName}
                padding="2"
                alignItems="center"
              />
            )}
            <Text className="form-counter">
              {lastName.length} / 50 символов
            </Text>
          </Stack>
        </Stack>
      </Stack>

      {/* поле для никнейма */}
      <Text className="form-label">Никнейм *</Text>
      <Stack className="form-field">
        <Input 
          placeholder="Ваш никнейм" 
          value={nickname}
          onChange={handleNicknameChange}
          maxLength={30}
          size="md"
          className="form-input"
        />
        {errors.nickname && (
          <Alert
            status="error"
            title={errors.nickname}
            padding="2"
            alignItems="center"
          />
        )}
        <Text className="form-counter">
          {nickname.length} / 30 символов
        </Text>
      </Stack>

      {/* поле для роли */}
      <RoleSelect
        label="Роль"
        placeholder="Выберите вашу роль"
        value={role}
        onChange={handleRoleChange}
        error={errors.role}
      />

      {/* поле для места работы */}
      <Text className="form-label">Место работы</Text>
      <Stack className="form-field">
        <Input 
          placeholder="Где вы работаете" 
          value={workplace}
          onChange={handleWorkplaceChange}
          maxLength={100}
          size="md"
          className="form-input"
        />
        {errors.workplace && (
          <Alert
            status="error"
            title={errors.workplace}
            padding="2"
            alignItems="center"
          />
        )}
        <Text className="form-counter">
          {workplace.length} / 100 символов
        </Text>
      </Stack>

      {/* поле для описания */}
      <Text className="form-label">Описание</Text>
      <Stack className="form-field">
        <Textarea 
          placeholder="Расскажите о себе" 
          value={description}
          onChange={handleDescriptionChange}
          rows={4}
          maxLength={500}
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
          {description.length} / 500 символов
        </Text>
      </Stack>

      <Separator className="form-separator" />

      {/* кнопка для сохранения изменений */}
      <Stack className="form-submit">
        <Button 
          onClick={handleSubmit}
          colorScheme="blue"
          size="lg"
          width="full"
          disabled={!isFormValid || isLoading}
          loading={isLoading}
          loadingText="Сохранение..."
          className="form-button"
        >
          Сохранить изменения
        </Button>
      </Stack>
    </Stack>
  )
}
