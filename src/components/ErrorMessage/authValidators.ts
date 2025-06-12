//import { getUniqueNickname } from "@/api/uniquedata/uniquedataApi";

import { getAuthData } from "@/api/auth/authApi";


export type AuthErrors = { //валидация формы авторизации
    nickname: string | null
    password: string | null
    authError?: string | null
}

//Паттерны

const patternNickname = /^[a-zA-Z0-9]+$/;

export const authValidators = {
    validateNickname: (nickname: string) => {
        if (!nickname.trim()) return "Никнейм не заполнен"
        if (!patternNickname.test(nickname)) return "Никнейм должен содержать только латинские буквы и цифры"
        return null
    },

    validatePassword: (password: string) => {
        if (!password.trim()) return "Пароль не заполнен"
        return null
    },

    validateAuthForm: (nickname: string, password: string) => {
        const nicknameError = authValidators.validateNickname(nickname)
        const passwordError = authValidators.validatePassword(password)
        
        console.log('Validation results:', { nicknameError, passwordError })
        
        if (!nicknameError && !passwordError && !getAuthData(nickname, password)) {
            console.log('Auth failed - user not found')
            return { nicknameError, passwordError, authError: "Неверный никнейм или пароль" }
        }

        console.log('Validation passed')
        return { nicknameError, passwordError }
    },
}