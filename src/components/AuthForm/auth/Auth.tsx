import { useEffect } from 'react'
import { Form } from "@/components/Form/Form"
import { authValidators } from "@/components/ErrorMessage/authValidators"
import { useNavigate } from 'react-router-dom'

// redux хуки
import { useAppDispatch, useAppSelector } from "@/app/hooks"

// экшены и селекторы для авторизации
import {
  setNickname,
  setPassword,
  setErrors,
  loginUser,
  selectNickname,
  selectPassword,
  selectNicknameError,
  selectPasswordError,
  selectAuthError,
  selectIsAuthenticated,
  selectUser,
} from "@/features/auth/authSlice"

// типы для пропсов компонента
type AuthProps = {
  handleAuthPage: () => void
  handleSignupPage: () => void
}

// сам компонент авторизации
const Auth = ({ handleAuthPage, handleSignupPage }: AuthProps) => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  // получаем значения из redux store
  const nickname = useAppSelector(selectNickname)
  const password = useAppSelector(selectPassword)

  // получаем ошибки из redux store
  const nicknameError = useAppSelector(selectNicknameError)
  const passwordError = useAppSelector(selectPasswordError)
  const authError = useAppSelector(selectAuthError)

  // получаем состояние авторизации и пользователя
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const user = useAppSelector(selectUser)

  // функция для изменения никнейма и валидации
  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setNickname(e.target.value))

    // валидируем никнейм
    const nicknameValidationError = authValidators.validateNickname(
      e.target.value,
    )

    // обновляем ошибки в redux
    dispatch(
      setErrors({
        nickname: nicknameValidationError,
        password: passwordError,
        authError: null,
      }),
    )
  }

  // функция для изменения пароля и валидации
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setPassword(e.target.value))

    // валидируем пароль
    const passwordValidationError = authValidators.validatePassword(
      e.target.value,
    )

    // обновляем ошибки в redux
    dispatch(
      setErrors({
        nickname: nicknameError,
        password: passwordValidationError,
        authError: null,
      }),
    )
  }

  // функция для отправки формы авторизации
  const handleAuth = () => {
    // валидируем всю форму
    const validationResult = authValidators.validateAuthForm(nickname, password)

    // обновляем ошибки в redux
    dispatch(
      setErrors({
        nickname: validationResult.nicknameError,
        password: validationResult.passwordError,
        authError: validationResult.authError,
      }),
    )

    // если ошибок нет — пробуем залогиниться
    if (
      !validationResult.nicknameError &&
      !validationResult.passwordError
    ) {
      dispatch(loginUser())
    }
  }

  // если авторизация успешна — переходим на главную страницу
  useEffect(() => {
    if (isAuthenticated && user) {
      void navigate('/')
    }
  }, [isAuthenticated, user, navigate])

  // поля для формы (никнейм и пароль)
  const input_fields = [
    {
      label: "Имя пользователя",
      variant: "outline" as const,
      placeholder: "Введите ваш никнейм",
      size: "lg" as const,
      value: nickname,
      onChange: handleNicknameChange,
      error: nicknameError,
      status: "error" as const,
    },
    {
      label: "Пароль",
      variant: "outline" as const,
      placeholder: "Введите ваш пароль",
      size: "lg" as const,
      value: password,
      onChange: handlePasswordChange,
      error: passwordError,
      status: "error" as const,
      type: "password" as const,
    },
  ]

  // рендерим форму авторизации
  return (
    <Form
      title="Добро пожаловать"
      subtitle="Чтобы войти в систему, нужно ввести ваш никнейм и пароль"
      input_fields={input_fields}
      button_action={handleAuth}
      button_text="Войти"
      auth_type="auth"
      authError={authError}
      handleAuthPage={handleAuthPage}
      handleSignupPage={handleSignupPage}
    />
  )
}

export default Auth
