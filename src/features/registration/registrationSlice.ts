//Импортируем библиотеки для работы с redux

import { createAppSlice } from "@/app/createAppSlice" 
import type { PayloadAction } from "@reduxjs/toolkit"

//Импорты из компонентов
import type { RegistrationForm } from "@/components/AuthForm/Registration/registrationFormType"
import type { ValidationErrors } from "@/components/ErrorMessage/ErrorMessage"

//Создадим типы для состояния
import { validators } from "@/components/ErrorMessage/ErrorMessage"
import type { RoleType } from "@/components/RoleSelector/Role"

type RegistrationState = { //форма регистрации
    form: RegistrationForm
    errors: ValidationErrors
}

const initialState: RegistrationState = { //начальное состояние
    form: {
        name: "",
        lastname: "",
        nickname: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: ""
    },
    errors: {
        name: null,
        lastname: null,
        nickname: null,
        email: null,
        password: null,
        confirmPassword: null,
        role: null
    }
}

export const registrationSlice = createAppSlice({
    name: "registration",
    initialState,

    reducers: create => ({ //редюсеры, создадим редюсеры для каждого поля формы регистрации и обработаем ошибки 
        setName: create.reducer((state, action: PayloadAction<string>) => { //редюсер для имени 
            state.form.name = action.payload
            state.errors.name = validators.validateName(action.payload)
        }),
        setLastname: create.reducer((state, action: PayloadAction<string>) => { //редюсер для фамилии 
            state.form.lastname = action.payload
            state.errors.lastname = validators.validateLastname(action.payload)
        }),
        setNickname: create.reducer((state, action: PayloadAction<string>) => { //редюсер для никнейма 
            state.form.nickname = action.payload
            state.errors.nickname = validators.validateNickname(action.payload)
        }),
        setEmail: create.reducer((state, action: PayloadAction<string>) => { //редюсер для email 
            state.form.email = action.payload
            state.errors.email = validators.validateEmail(action.payload)
        }),
        setPassword: create.reducer((state, action: PayloadAction<string>) => { //редюсер для пароля 
            state.form.password = action.payload
            state.errors.password = validators.validatePassword(action.payload)
        }),
        setConfirmPassword: create.reducer((state, action: PayloadAction<string>) => { //редюсер для подтверждения пароля 
            state.form.confirmPassword = action.payload
            state.errors.confirmPassword = validators.validateConfirmPassword(action.payload, state.form.password)
        }),
        setRole: create.reducer((state, action: PayloadAction<RoleType>) => { //редюсер для роли 
            state.form.role = action.payload
            state.errors.role = validators.validateRole(action.payload)
        }),
        
        validateForm: create.reducer((state) => { //редюсер для валидации формы
            state.errors.name = validators.validateName(state.form.name)
            state.errors.lastname = validators.validateLastname(state.form.lastname)
            state.errors.nickname = validators.validateNickname(state.form.nickname)
            state.errors.email = validators.validateEmail(state.form.email)
            state.errors.password = validators.validatePassword(state.form.password)
            state.errors.confirmPassword = validators.validateConfirmPassword(state.form.confirmPassword, state.form.password)
            state.errors.role = validators.validateRole(state.form.role)
        })
    }),

    selectors: { //селекторы, получим данные из хранилища
        selectName: (state: RegistrationState) => state.form.name,
        selectLastname: (state: RegistrationState) => state.form.lastname,
        selectNickname: (state: RegistrationState) => state.form.nickname,
        selectEmail: (state: RegistrationState) => state.form.email,
        selectPassword: (state: RegistrationState) => state.form.password,
        selectConfirmPassword: (state: RegistrationState) => state.form.confirmPassword,
        selectRole: (state: RegistrationState) => state.form.role,
        selectErrors: (state: RegistrationState) => state.errors,

        selectFormValidateSuccessfully: (state) => { //селектор для валидации формы c встроенным условием
            return !Object.values(state.errors).some(error => error !== null) &&
                state.form.name.trim() !== "" &&
                state.form.lastname.trim() !== "" &&
                state.form.nickname.trim() !== "" &&
                state.form.email.trim() !== "" &&
                state.form.password.trim() !== "" &&
                state.form.confirmPassword.trim() !== "" &&
                state.form.role.trim() !== ""
        }
    }
})

export const { setName, setLastname, setNickname, setEmail, setPassword, setConfirmPassword, setRole, validateForm } = registrationSlice.actions //экспортируем действия
export const { selectName, selectLastname, selectNickname, selectEmail, selectPassword, selectConfirmPassword, 
    selectRole, selectErrors, selectFormValidateSuccessfully } = registrationSlice.selectors //экспортируем селекторы
