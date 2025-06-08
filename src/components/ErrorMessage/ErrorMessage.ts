import { getUniqueNickname, getUniqueEmail } from '@/api/uniquedata/uniquedataApi';
import { validate } from 'email-validator';  

//Обработаем ошибки, данные из формы регистрации обязательно должно поступить в фиксированном формате

export type ValidationErrors = { //валидация формы регистрации
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

//Паттерны

const patternName = /^\p{L}+$/u;
const patternPassword = /^(?=.*[a-zA-Z])(?=.*[0-9])/;
const patternNickname = /^[a-zA-Z0-9]+$/;

// Создадим валидаторы для обработки ошибок

export const validators = {
    validateName: (name: string) => {
        if (!name.trim()) return "Имя не заполнено"
        if (!patternName.test(name)) return "Имя должно содержать только буквы"
        return null
    },
    validateLastname: (lastname: string) => {
        if (!lastname.trim()) return "Фамилия не заполнена"
        if (!patternName.test(lastname)) return "Фамилия должна содержать только буквы"
        return null
    },
    validateNickname: (nickname: string) => {
        if (!nickname.trim()) return "Никнейм не заполнен"
        if (getUniqueNickname(nickname)) return "Никнейм уже занят"
        if (!patternNickname.test(nickname)) return "Никнейм должен содержать только латинские буквы и цифры"
        return null
    },
    validateEmail: (email: string) => {
        if (!email.trim()) return "Email не заполнен"
        //if ((!email.includes("@") && !email.includes(".")) || !email.includes("@") || !email.includes(".")) return "Email некорректный" (лучше используем библиотеку email-validator, чем регулярки)
        if (!validate(email)) return "Email некорректный"
        if (getUniqueEmail(email)) return "Email уже занят"
        return null
    },
    validatePassword: (password: string) => {
        if (!password.trim()) return "Пароль не заполнен"
        if (password.length < 8) return "Пароль должен быть не менее 8 символов"
        if (!patternPassword.test(password)) return "Пароль должен содержать минимум одну букву и одну цифру"
        return null
    },
    validateConfirmPassword: (confirmPassword: string, password: string) => {
        if (!confirmPassword.trim()) return "Пароль не заполнен"
        if (confirmPassword !== password) return "Пароли не совпадают"
        return null
    },
    validateRole: (role: string) => {
        if (!role.trim()) return "Роль не выбрана"
        return null
    },
    validateForm: (errors: ValidationErrors) => {
        return Object.values(errors).some(error => error !== null)
    },
    validateFormSecondStep: (nameError: string, lastnameError: string, emailError: string, name: string, lastname: string, email: string) => {
        if (!nameError && !lastnameError && !emailError && name.trim() !== "" && lastname.trim() !== "" && email.trim() !== "") {
            return true
        } else {
            return false
        }
    },

    validateFormThirdStep: (nicknameError: string, passwordError: string, confirmPasswordError: string, nickname: string, password: string, confirmPassword: string) => {
        if (!nicknameError && !passwordError && !confirmPasswordError &&  nickname.trim() !== "" && password.trim() !== "" && confirmPassword.trim() !== "") {
            return true
        } else {
            return false
        }
    },
    validateFormFourthStep: (roleError: string, role: string) => {
        if (!roleError &&  role.trim() !== "") {
            return true
        } else {
            return false
        }
    }
}
