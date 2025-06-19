// тут хуки и функции для работы с формой регистрации

import { useAppSelector } from "@/app/hooks"
import type { AppDispatch } from "@/app/store"
import {
  selectName,
  selectLastname,
  selectNickname,
  selectEmail,
  selectPassword,
  selectConfirmPassword,
  selectRole,
  selectErrors,
  setName,
  setLastname,
  setNickname,
  setEmail,
  setPassword,
  setConfirmPassword,
  setRole,
  selectFormValidateSuccessfully,
  submitRegistration,
} from "@/features/registration/registrationSlice"

import type { RoleVariant } from "@/components/RoleSelector/RoleSelector"
import type { ValidationErrors } from "@/components/ErrorMessage/ErrorMessage"

// тип для всех данных регистрации
type RegistrationData = {
  name: string
  lastname: string
  nickname: string
  email: string
  password: string
  confirmPassword: string
  role: RoleVariant
  errors: ValidationErrors
}

// хук чтобы получить все данные регистрации из redux
export const useRegistrationData = (): RegistrationData => {
  return {
    name: useAppSelector(selectName),
    lastname: useAppSelector(selectLastname),
    nickname: useAppSelector(selectNickname),
    email: useAppSelector(selectEmail),
    password: useAppSelector(selectPassword),
    confirmPassword: useAppSelector(selectConfirmPassword),
    role: useAppSelector(selectRole) as RoleVariant,
    errors: useAppSelector(selectErrors),
  }
}

// хук чтобы узнать, прошла ли форма валидацию
export const useValidateForm = (): boolean => {
  return useAppSelector(selectFormValidateSuccessfully)
}

// обработчик для поля "имя"
export const handleNameChange =
  (dispatch: AppDispatch) => (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setName(e.target.value))
  }

// обработчик для поля "фамилия"
export const handleLastnameChange =
  (dispatch: AppDispatch) => (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setLastname(e.target.value))
  }

// обработчик для поля "никнейм"
export const handleNicknameChange =
  (dispatch: AppDispatch) => (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setNickname(e.target.value))
  }

// обработчик для поля "email"
export const handleEmailChange =
  (dispatch: AppDispatch) => (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setEmail(e.target.value))
  }

// обработчик для поля "пароль"
export const handlePasswordChange =
  (dispatch: AppDispatch) => (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setPassword(e.target.value))
  }

// обработчик для поля "подтверждение пароля"
export const handleConfirmPasswordChange =
  (dispatch: AppDispatch) => (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setConfirmPassword(e.target.value))
  }

// обработчик для поля "роль"
export const handleRoleChange =
  (dispatch: AppDispatch) => (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setRole(e.target.value as RoleVariant))
  }

// обработчик для отправки формы (промежуточный этап)
export const handleSubmit =
  (
    dispatch: AppDispatch,
    data: ReturnType<typeof useRegistrationData>,
    isFormValid: boolean,
  ) =>
  (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!isFormValid) {
      // если форма не валидна, выводим ошибки
      console.log("ошибки в форме", data.errors)
    } else {
      // если всё ок, обновляем данные в redux
      dispatch(setName(data.name))
      dispatch(setLastname(data.lastname))
      dispatch(setNickname(data.nickname))
      dispatch(setEmail(data.email))
      dispatch(setPassword(data.password))
      dispatch(setConfirmPassword(data.confirmPassword))
      dispatch(setRole(data.role))
      console.log(data)
    }
  }

// обработчик для финальной отправки регистрации
export const handleRegistrationSubmit = (
  dispatch: AppDispatch,
  data: ReturnType<typeof useRegistrationData>,
  isFormValid: boolean,
): boolean => {
  console.log("состояние валидации формы:", isFormValid)
  console.log("текущие ошибки:", data.errors)
  console.log("данные формы:", {
    name: data.name,
    lastname: data.lastname,
    nickname: data.nickname,
    email: data.email,
    password: data.password,
    confirmPassword: data.confirmPassword,
    role: data.role,
  })

  if (!isFormValid) {
    console.log("ошибки в форме")
    return false
  } else {
    console.log("форма валидна")
    dispatch(submitRegistration())
    console.log("данные регистрации отправлены")
    return true
  }
}
