export type AuthErrors = {
  // валидация формы авторизации
  nickname: string | null
  password: string | null
  authError?: string | null
}

// паттерны валидации
const patternNickname = /^[a-zA-Z0-9]+$/

export const authValidators = {
  validateNickname: (nickname: string) => {
    if (!nickname.trim()) return "Никнейм не заполнен"
    if (!patternNickname.test(nickname))
      return "Никнейм должен содержать только латинские буквы и цифры"
    return null
  },

  validatePassword: (password: string) => {
    if (!password.trim()) return "Пароль не заполнен"
    return null
  },

  validateAuthForm: (nickname: string, password: string) => {
    const nicknameError = authValidators.validateNickname(nickname)
    const passwordError = authValidators.validatePassword(password)

    return { 
      nicknameError, 
      passwordError,
      authError: null // ошибка авторизации будет устанавливаться в Redux
    }
  },
}
