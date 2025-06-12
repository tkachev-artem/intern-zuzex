//библиотеки redux

import { createAppSlice } from "@/app/createAppSlice"
import type { AuthErrors } from "@/components/ErrorMessage/authValidators"
import type { PayloadAction } from "@reduxjs/toolkit"

import { authValidators } from "@/components/ErrorMessage/authValidators"


//типы

type AuthType = {
    nickname: string
    password: string
}

type AuthState = { //форма авторизации
    form: AuthType
    errors: AuthErrors
}

const initialState: AuthState = {
    form: {
        nickname: "",
        password: "",
    },
    errors: {
        nickname: null,
        password: null,
        authError: null,
    },
}

const authSlice = createAppSlice({
    name: "auth",
    initialState,

    reducers: create => ({
        setNickname: create.reducer((state: AuthState, action: PayloadAction<string>) => {
            state.form.nickname = action.payload
        }),
        setPassword: create.reducer((state: AuthState, action: PayloadAction<string>) => {
            state.form.password = action.payload
        }),
        setErrors: create.reducer((state: AuthState, action: PayloadAction<AuthErrors>) => {
            state.errors = action.payload
        }),

        validateAuthForm: create.reducer((state: AuthState) => {
            state.errors.nickname = authValidators.validateNickname(state.form.nickname)
            state.errors.password = authValidators.validatePassword(state.form.password)
        }),
    }),

    selectors: {
        selectNickname: (state: AuthState) => state.form.nickname,
        selectPassword: (state: AuthState) => state.form.password,
        selectErrors: (state: AuthState) => state.errors,

        selectAuthForm: (state: AuthState) => state.form,
        selectNicknameError: (state: AuthState) => state.errors.nickname,
        selectPasswordError: (state: AuthState) => state.errors.password,
        selectAuthError: (state: AuthState) => state.errors.authError,
    }
})

export const { setNickname, setPassword, setErrors } = authSlice.actions //экспортируем действия
export const { selectNickname, selectPassword, selectErrors, selectAuthForm, selectNicknameError, selectPasswordError, selectAuthError } = authSlice.selectors //экспортируем селекторы

export { authSlice }
