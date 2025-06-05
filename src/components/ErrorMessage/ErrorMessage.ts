//Обработаем ошибки, данные из формы регистрации обязательно должно поступить в фиксированном формате

export type ValidationErrors = { //валидация формы регистрации
    name: string | null
    lastname: string | null
    nickname: string | null
    email: string | null
    password: string | null
    confirmPassword: string | null
    role: string | null
  }

// Создадим валидаторы для обработки ошибок

export const validators = {
    validateName: (name: string) => {
        if (!name.trim()) return "Имя не заполнено"
        return null
    },
    validateLastname: (lastname: string) => {
        if (!lastname.trim()) return "Фамилия не заполнена"
        return null
    },
    validateNickname: (nickname: string) => {
        if (!nickname.trim()) return "Никнейм не заполнен"
        return null
    },
    validateEmail: (email: string) => {
        if (!email.trim()) return "Email не заполнен"
        return null
    },
    validatePassword: (password: string) => {
        if (!password.trim()) return "Пароль не заполнен"
        return null
    },
    validateConfirmPassword: (confirmPassword: string) => {
        if (!confirmPassword.trim()) return "Пароль не заполнен"
        return null
    },
    validateRole: (role: string) => {
        if (!role.trim()) return "Роль не выбрана"
        return null
    },
    validateForm: (errors: ValidationErrors) => {
        return Object.values(errors).some(error => error !== null)
    }
}
