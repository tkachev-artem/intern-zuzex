// тут валидаторы и типы для ошибок валидации форм

import { validate } from "email-validator"

// тип для ошибок валидации формы регистрации
export type ValidationErrors = {
  name: string | null
  lastname: string | null
  nickname: string | null
  email: string | null
  password: string | null
  confirmPassword: string | null
  role: string | null
  formSecondStep: boolean
  formThirdStep: boolean
  formFourthStep: boolean
}

// регулярки для проверки полей
const patternName = /^\p{L}+$/u
const patternPassword = /^(?=.*[a-zA-Z])(?=.*[0-9])/
const patternNickname = /^[a-zA-Z0-9]+$/

// объект с функциями для валидации разных полей
export const validators = {
  // проверка имени
  validateName: (name: string) => {
    if (!name.trim()) return "Имя не заполнено"
    if (!patternName.test(name)) return "Имя должно содержать только буквы"
    return null
  },

  // проверка фамилии
  validateLastname: (lastname: string) => {
    if (!lastname.trim()) return "Фамилия не заполнена"
    if (!patternName.test(lastname))
      return "Фамилия должна содержать только буквы"
    return null
  },

  // проверка никнейма
  validateNickname: (nickname: string) => {
    if (!nickname.trim()) return "Никнейм не заполнен"
    if (!patternNickname.test(nickname))
      return "Никнейм должен содержать только латинские буквы и цифры"
    return null
  },

  // проверка email
  validateEmail: (email: string) => {
    if (!email.trim()) return "Email не заполнен"
    if (!validate(email)) return "Email некорректный"
    return null
  },

  // проверка пароля
  validatePassword: (password: string) => {
    if (!password.trim()) return "Пароль не заполнен"
    if (password.length < 8) return "Пароль должен быть не менее 8 символов"
    if (!patternPassword.test(password))
      return "Пароль должен содержать минимум одну букву и одну цифру"
    return null
  },

  // проверка подтверждения пароля
  validateConfirmPassword: (confirmPassword: string, password: string) => {
    if (!confirmPassword.trim()) return "Пароль не заполнен"
    if (confirmPassword !== password) return "Пароли не совпадают"
    return null
  },

  // проверка роли
  validateRole: (role: string) => {
    if (!role.trim()) return "Роль не выбрана"
    return null
  },

  // проверка всей формы (true если ошибок нет)
  validateForm: (errors: ValidationErrors) => {
    return Object.values(errors).every(error => 
      typeof error === 'boolean' ? error : error === null
    )
  },

  // проверка второго шага (имя, фамилия, email)
  validateFormSecondStep: (
    nameError: string,
    lastnameError: string,
    emailError: string,
    name: string,
    lastname: string,
    email: string,
  ) => {
    if (
      !nameError &&
      !lastnameError &&
      !emailError &&
      name.trim() !== "" &&
      lastname.trim() !== "" &&
      email.trim() !== ""
    ) {
      return true
    } else {
      return false
    }
  },

  // проверка третьего шага (никнейм, пароль, подтверждение пароля)
  validateFormThirdStep: (
    nicknameError: string,
    passwordError: string,
    confirmPasswordError: string,
    nickname: string,
    password: string,
    confirmPassword: string,
  ) => {
    if (
      !nicknameError &&
      !passwordError &&
      !confirmPasswordError &&
      nickname.trim() !== "" &&
      password.trim() !== "" &&
      confirmPassword.trim() !== ""
    ) {
      return true
    } else {
      return false
    }
  },

  // проверка четвертого шага (роль)
  validateFormFourthStep: (roleError: string, role: string) => {
    if (!roleError && role.trim() !== "") {
      return true
    } else {
      return false
    }
  },
}
