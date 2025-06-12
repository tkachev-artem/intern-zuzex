//Импортируем библиотеки для работы с redux

import { createAppSlice } from "@/app/createAppSlice" 
import type { PayloadAction } from "@reduxjs/toolkit"

//Импорты из компонентов
import type { ValidationErrors } from "@/components/ErrorMessage/ErrorMessage"

//Создадим типы для состояния
import { validators } from "@/components/ErrorMessage/ErrorMessage"

// Определяем тип локально 
type SignUpType = {
    name: string
    lastname: string
    nickname: string
    email: string
    password: string
    confirmPassword: string
    role: string
}

type RegistrationState = { //форма регистрации
    form: SignUpType
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
        role: null,
        formSecondStep: false, // Инициализируем как false, так как поля пустые
        formThirdStep: false,
        formFourthStep: false
    }
}

export const registrationSlice = createAppSlice({
    name: "registration",
    initialState,

    reducers: create => ({ //редюсеры, создадим редюсеры для каждого поля формы регистрации и обработаем ошибки 
        setName: create.reducer((state: RegistrationState, action: PayloadAction<string>) => { //редюсер для имени 
            state.form.name = action.payload
            const nameError = validators.validateName(action.payload)
            state.errors.name = nameError
            // Обновляем валидацию второго этапа
            state.errors.formSecondStep = validators.validateFormSecondStep(
                nameError ?? "",
                state.errors.lastname ?? "",
                state.errors.email ?? "",
                action.payload,
                state.form.lastname,
                state.form.email
            )
        }),
        setLastname: create.reducer((state: RegistrationState, action: PayloadAction<string>) => { //редюсер для фамилии 
            state.form.lastname = action.payload
            const lastnameError = validators.validateLastname(action.payload)
            state.errors.lastname = lastnameError
            // Обновляем валидацию второго этапа
            state.errors.formSecondStep = validators.validateFormSecondStep(
                state.errors.name ?? "",
                lastnameError ?? "",
                state.errors.email ?? "",
                state.form.name,
                action.payload,
                state.form.email
            )
        }),
        setNickname: create.reducer((state: RegistrationState, action: PayloadAction<string>) => { //редюсер для никнейма 
            state.form.nickname = action.payload
            const nicknameError = validators.validateNickname(action.payload)
            state.errors.nickname = nicknameError
            // Обновляем валидацию третьего этапа
            state.errors.formThirdStep = validators.validateFormThirdStep(
                nicknameError ?? "",
                state.errors.password ?? "",
                state.errors.confirmPassword ?? "",
                action.payload,
                state.form.password,
                state.form.confirmPassword
            )
        }),
        setEmail: create.reducer((state: RegistrationState, action: PayloadAction<string>) => { //редюсер для email 
            state.form.email = action.payload
            const emailError = validators.validateEmail(action.payload)
            state.errors.email = emailError
            // Обновляем валидацию второго этапа
            state.errors.formSecondStep = validators.validateFormSecondStep(
                state.errors.name ?? "",
                state.errors.lastname ?? "",
                emailError ?? "",
                state.form.name,
                state.form.lastname,
                action.payload
            )
        }),
        setPassword: create.reducer((state: RegistrationState, action: PayloadAction<string>) => { //редюсер для пароля 
            state.form.password = action.payload
            const passwordError = validators.validatePassword(action.payload)
            state.errors.password = passwordError
            // Обновляем vallidation для confirmPassword тоже, так как пароль изменился
            const confirmPasswordError = validators.validateConfirmPassword(state.form.confirmPassword, action.payload)
            state.errors.confirmPassword = confirmPasswordError
            // Обновляем валидацию третьего этапа
            state.errors.formThirdStep = validators.validateFormThirdStep(
                state.errors.nickname ?? "",
                passwordError ?? "",
                confirmPasswordError ?? "",
                state.form.nickname,
                action.payload,
                state.form.confirmPassword
            )
        }),
        setConfirmPassword: create.reducer((state: RegistrationState, action: PayloadAction<string>) => { //редюсер для подтверждения пароля 
            state.form.confirmPassword = action.payload
            const confirmPasswordError = validators.validateConfirmPassword(action.payload, state.form.password)
            state.errors.confirmPassword = confirmPasswordError
            // Обновляем валидацию третьего этапа
            state.errors.formThirdStep = validators.validateFormThirdStep(
                state.errors.nickname ?? "",
                state.errors.password ?? "",
                confirmPasswordError ?? "",
                state.form.nickname,
                state.form.password,
                action.payload
            )
        }),
        setRole: create.reducer((state: RegistrationState, action: PayloadAction<string>) => { //редюсер для роли 
            state.form.role = action.payload
            const roleError = validators.validateRole(action.payload)
            state.errors.role = roleError
            // Обновляем валидацию четвертого этапа
            state.errors.formFourthStep = validators.validateFormFourthStep(
                roleError ?? "",
                action.payload
            )
        }),
        
        validateForm: create.reducer((state: RegistrationState) => { //редюсер для валидации формы
            state.errors.name = validators.validateName(state.form.name)
            state.errors.lastname = validators.validateLastname(state.form.lastname)
            state.errors.nickname = validators.validateNickname(state.form.nickname)
            state.errors.email = validators.validateEmail(state.form.email)
            state.errors.password = validators.validatePassword(state.form.password)
            state.errors.confirmPassword = validators.validateConfirmPassword(state.form.confirmPassword, state.form.password)
            state.errors.role = validators.validateRole(state.form.role)

            state.errors.formSecondStep = validators.validateFormSecondStep(
                state.errors.name ?? "",
                state.errors.lastname ?? "",
                state.errors.email ?? "",
                state.form.name,
                state.form.lastname,
                state.form.email
            )
            state.errors.formThirdStep = validators.validateFormThirdStep(
                state.errors.nickname ?? "",
                state.errors.password ?? "",
                state.errors.confirmPassword ?? "",
                state.form.nickname,
                state.form.password,
                state.form.confirmPassword
            )
            state.errors.formFourthStep = validators.validateFormFourthStep(
                state.errors.role ?? "",
                state.form.role
            )
        }),

        submitRegistration: create.reducer((state: RegistrationState) => { //редюсер для отправки данных регистрации
            // Здесь можно добавить логику для отправки данных на сервер
            // Например, установить статус загрузки, очистить ошибки и т.д.
            console.log("Отправка данных регистрации через Redux:", state.form)
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

        selectForm: (state: RegistrationState) => state.form,

        selectFormValidateSuccessfully: (state: RegistrationState) => { //селектор для валидации формы c встроенным условием
            // Проверяем только ошибки полей, исключая булевые поля этапов
            const fieldErrors = [
                state.errors.name,
                state.errors.lastname,
                state.errors.nickname,
                state.errors.email,
                state.errors.password,
                state.errors.confirmPassword,
                state.errors.role
            ]
            
            return !fieldErrors.some(error => error !== null) &&
                state.form.name.trim() !== "" &&
                state.form.lastname.trim() !== "" &&
                state.form.nickname.trim() !== "" &&
                state.form.email.trim() !== "" &&
                state.form.password.trim() !== "" &&
                state.form.confirmPassword.trim() !== "" &&
                state.form.role.trim() !== ""
        },

        selectFormSecondStep: (state: RegistrationState) => {
            return state.errors.formSecondStep
        },

        selectFormThirdStep: (state: RegistrationState) => {
            return state.errors.formThirdStep
        },

        selectFormFourthStep: (state: RegistrationState) => {
            return state.errors.formFourthStep
        }
    }
})

export const { setName, setLastname, setNickname, setEmail, setPassword, setConfirmPassword, setRole, validateForm, submitRegistration } = registrationSlice.actions //экспортируем действия
export const { selectName, selectLastname, selectNickname, selectEmail, selectPassword, selectConfirmPassword, 
    selectRole, selectForm, selectErrors, selectFormValidateSuccessfully, selectFormSecondStep, selectFormThirdStep, selectFormFourthStep } = registrationSlice.selectors //экспортируем селекторы
