import { createAppSlice } from "@/app/createAppSlice"
import type { PayloadAction } from "@reduxjs/toolkit"

// импортируем типы и валидаторы для ошибок
import type { ValidationErrors } from "@/components/ErrorMessage/ErrorMessage"
import { validators } from "@/components/ErrorMessage/ErrorMessage"

// импортируем функции для работы с localStorage
import { 
  authLocalAPI,
  type StoredUser 
} from "@/LocalAPI"

// тип для данных формы регистрации
type SignUpType = {
  /** Имя пользователя */
  name: string
  /** Фамилия пользователя */
  lastname: string
  /** Уникальный никнейм пользователя */
  nickname: string
  /** Email адрес пользователя */
  email: string
  /** Пароль пользователя */
  password: string
  /** Подтверждение пароля */
  confirmPassword: string
  /** Роль пользователя в системе */
  role: string
}

// тип для состояния регистрации
type RegistrationState = {
  /** Данные формы регистрации */
  form: SignUpType
  /** Ошибки валидации формы */
  errors: ValidationErrors
  /** Статус успешной регистрации */
  isRegistrationComplete: boolean
  /** Сообщение о результате регистрации */
  registrationMessage: string | null
}

// начальное состояние
const initialState: RegistrationState = {
  form: {
    name: "",
    lastname: "",
    nickname: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  },
  errors: {
    name: null,
    lastname: null,
    nickname: null,
    email: null,
    password: null,
    confirmPassword: null,
    role: null,
    formSecondStep: false,
    formThirdStep: false,
    formFourthStep: false,
  },
  isRegistrationComplete: false,
  registrationMessage: null,
}

// функция для генерации id пользователя
const generateUserId = (): string => {
  return `user_${Date.now().toString()}`
}

export const registrationSlice = createAppSlice({
  name: "registration",
  initialState,

  reducers: create => ({

    // меняем имя
    setName: create.reducer(
      (state: RegistrationState, action: PayloadAction<string>) => {
        state.form.name = action.payload
        const nameError = validators.validateName(action.payload)
        state.errors.name = nameError

        // обновляем валидацию второго шага
        state.errors.formSecondStep = validators.validateFormSecondStep(
          nameError ?? "",
          state.errors.lastname ?? "",
          state.errors.email ?? "",
          action.payload,
          state.form.lastname,
          state.form.email,
        )
      },
    ),

    // меняем фамилию
    setLastname: create.reducer(
      (state: RegistrationState, action: PayloadAction<string>) => {
        state.form.lastname = action.payload
        const lastnameError = validators.validateLastname(action.payload)
        state.errors.lastname = lastnameError

        // обновляем валидацию второго шага
        state.errors.formSecondStep = validators.validateFormSecondStep(
          state.errors.name ?? "",
          lastnameError ?? "",
          state.errors.email ?? "",
          state.form.name,
          action.payload,
          state.form.email,
        )
      },
    ),

    // меняем никнейм
    setNickname: create.reducer(
      (state: RegistrationState, action: PayloadAction<string>) => {
        state.form.nickname = action.payload
        let nicknameError = validators.validateNickname(action.payload)
        
        // если ник не уникален — ошибка
        if (!nicknameError && action.payload.trim()) {
          if (!authLocalAPI.isNicknameUnique(action.payload)) {
            nicknameError = "Никнейм уже занят"
          }
        }
        
        state.errors.nickname = nicknameError

        // обновляем валидацию третьего шага
        state.errors.formThirdStep = validators.validateFormThirdStep(
          nicknameError ?? "",
          state.errors.password ?? "",
          state.errors.confirmPassword ?? "",
          action.payload,
          state.form.password,
          state.form.confirmPassword,
        )
      },
    ),

    // меняем email
    setEmail: create.reducer(
      (state: RegistrationState, action: PayloadAction<string>) => {
        state.form.email = action.payload
        let emailError = validators.validateEmail(action.payload)
        
        // если email не уникален — ошибка
        if (!emailError && action.payload.trim()) {
          if (!authLocalAPI.isEmailUnique(action.payload)) {
            emailError = "Email уже занят"
          }
        }
        
        state.errors.email = emailError

        // обновляем валидацию второго шага
        state.errors.formSecondStep = validators.validateFormSecondStep(
          state.errors.name ?? "",
          state.errors.lastname ?? "",
          emailError ?? "",
          state.form.name,
          state.form.lastname,
          action.payload,
        )
      },
    ),

    // меняем пароль
    setPassword: create.reducer(
      (state: RegistrationState, action: PayloadAction<string>) => {
        state.form.password = action.payload
        const passwordError = validators.validatePassword(action.payload)
        state.errors.password = passwordError

        // обновляем ошибку подтверждения пароля
        const confirmPasswordError = validators.validateConfirmPassword(
          state.form.confirmPassword,
          action.payload,
        )
        state.errors.confirmPassword = confirmPasswordError

        // обновляем валидацию третьего шага
        state.errors.formThirdStep = validators.validateFormThirdStep(
          state.errors.nickname ?? "",
          passwordError ?? "",
          confirmPasswordError ?? "",
          state.form.nickname,
          action.payload,
          state.form.confirmPassword,
        )
      },
    ),

    // меняем подтверждение пароля
    setConfirmPassword: create.reducer(
      (state: RegistrationState, action: PayloadAction<string>) => {
        state.form.confirmPassword = action.payload
        const confirmPasswordError = validators.validateConfirmPassword(
          action.payload,
          state.form.password,
        )
        state.errors.confirmPassword = confirmPasswordError

        // обновляем валидацию третьего шага
        state.errors.formThirdStep = validators.validateFormThirdStep(
          state.errors.nickname ?? "",
          state.errors.password ?? "",
          confirmPasswordError ?? "",
          state.form.nickname,
          state.form.password,
          action.payload,
        )
      },
    ),

    // меняем роль
    setRole: create.reducer(
      (state: RegistrationState, action: PayloadAction<string>) => {
        state.form.role = action.payload
        const roleError = validators.validateRole(action.payload)
        state.errors.role = roleError

        // обновляем валидацию четвертого шага
        state.errors.formFourthStep = validators.validateFormFourthStep(
          roleError ?? "",
          action.payload,
        )
      },
    ),



    // валидируем всю форму
    validateForm: create.reducer((state: RegistrationState) => {
      state.errors.name = validators.validateName(state.form.name)
      state.errors.lastname = validators.validateLastname(state.form.lastname)
      state.errors.nickname = validators.validateNickname(state.form.nickname)
      state.errors.email = validators.validateEmail(state.form.email)
      state.errors.password = validators.validatePassword(state.form.password)
      state.errors.confirmPassword = validators.validateConfirmPassword(
        state.form.confirmPassword,
        state.form.password,
      )
      state.errors.role = validators.validateRole(state.form.role)

      state.errors.formSecondStep = validators.validateFormSecondStep(
        state.errors.name ?? "",
        state.errors.lastname ?? "",
        state.errors.email ?? "",
        state.form.name,
        state.form.lastname,
        state.form.email,
      )
      state.errors.formThirdStep = validators.validateFormThirdStep(
        state.errors.nickname ?? "",
        state.errors.password ?? "",
        state.errors.confirmPassword ?? "",
        state.form.nickname,
        state.form.password,
        state.form.confirmPassword,
      )
      state.errors.formFourthStep = validators.validateFormFourthStep(
        state.errors.role ?? "",
        state.form.role,
      )
    }),

    // отправка регистрации (добавляем пользователя)
    submitRegistration: create.reducer((state: RegistrationState) => {
      try {
        // если ник не уникален — ошибка
        if (!authLocalAPI.isNicknameUnique(state.form.nickname)) {
          state.registrationMessage = `Ошибка: никнейм ${state.form.nickname} уже занят`
          state.errors.nickname = "Никнейм уже занят"
          console.error("Ошибка регистрации: никнейм уже существует")
          return
        }

        // если email не уникален — ошибка
        if (!authLocalAPI.isEmailUnique(state.form.email)) {
          state.registrationMessage = `Ошибка: email ${state.form.email} уже занят`
          state.errors.email = "Email уже занят"
          console.error("Ошибка регистрации: email уже существует")
          return
        }

        // создаём нового пользователя
        const newUser: StoredUser = {
          id: generateUserId(),
          firstName: state.form.name,
          lastName: state.form.lastname,
          nickname: state.form.nickname,
          password: state.form.password,
          role: state.form.role,
          email: state.form.email,
          createdAt: new Date().toISOString(),
          portfolio: [], // изначально у пользователя нет проектов
        }

        // добавляем пользователя в localStorage
        const success = authLocalAPI.createUser(newUser)

        if (success) {
          state.isRegistrationComplete = true
          state.registrationMessage = `Пользователь ${state.form.nickname} успешно зарегистрирован!`

          console.log("Регистрация успешна:", {
            id: newUser.id,
            nickname: newUser.nickname,
            role: newUser.role,
            email: newUser.email,
            name: `${state.form.name} ${state.form.lastname}`,
          })
        } else {
          state.registrationMessage = `Ошибка: не удалось сохранить пользователя`
          console.error("Ошибка регистрации: не удалось сохранить")
        }
      } catch (error) {
        state.registrationMessage = "Произошла ошибка при регистрации"
        console.error("Ошибка при регистрации:", error)
      }
    }),

    // сброс формы регистрации к начальному состоянию
    resetRegistrationForm: create.reducer((state: RegistrationState) => {
      Object.assign(state, initialState)
    }),

    // очистка сообщения о регистрации
    clearRegistrationMessage: create.reducer((state: RegistrationState) => {
      state.registrationMessage = null
    })
  }),

  // селекторы для получения данных из состояния
  selectors: {

    selectName: (state: RegistrationState) => state.form.name,
    selectLastname: (state: RegistrationState) => state.form.lastname,
    selectNickname: (state: RegistrationState) => state.form.nickname,
    selectEmail: (state: RegistrationState) => state.form.email,
    selectPassword: (state: RegistrationState) => state.form.password,
    selectConfirmPassword: (state: RegistrationState) =>
      state.form.confirmPassword,
    selectRole: (state: RegistrationState) => state.form.role,
    selectErrors: (state: RegistrationState) => state.errors,
    selectForm: (state: RegistrationState) => state.form,
    selectUserInfo: (state: RegistrationState) => {
      return {
        name: state.form.name,
        lastname: state.form.lastname,
      }
    },

    // проверка, что форма полностью валидна
    selectFormValidateSuccessfully: (state: RegistrationState) => {
      const fieldErrors = [
        state.errors.name,
        state.errors.lastname,
        state.errors.nickname,
        state.errors.email,
        state.errors.password,
        state.errors.confirmPassword,
        state.errors.role,
      ]

      return (
        !fieldErrors.some(error => error !== null) &&
        state.form.name.trim() !== "" &&
        state.form.lastname.trim() !== "" &&
        state.form.nickname.trim() !== "" &&
        state.form.email.trim() !== "" &&
        state.form.password.trim() !== "" &&
        state.form.confirmPassword.trim() !== "" &&
        state.form.role.trim() !== ""
      )
    },

    selectFormSecondStep: (state: RegistrationState) => {
      return state.errors.formSecondStep
    },

    selectFormThirdStep: (state: RegistrationState) => {
      return state.errors.formThirdStep
    },

    selectFormFourthStep: (state: RegistrationState) => {
      return state.errors.formFourthStep
    },

    selectIsRegistrationComplete: (state: RegistrationState) =>
      state.isRegistrationComplete,

    selectRegistrationMessage: (state: RegistrationState) =>
      state.registrationMessage,
  },
})

// экспортируем экшены
export const {
  setName,
  setLastname,
  setNickname,
  setEmail,
  setPassword,
  setConfirmPassword,
  setRole,
  validateForm,
  submitRegistration,
  resetRegistrationForm,
  clearRegistrationMessage,
} = registrationSlice.actions

// экспортируем селекторы
export const {
  selectName,
  selectLastname,
  selectNickname,
  selectEmail,
  selectPassword,
  selectConfirmPassword,
  selectRole,
  selectForm,
  selectErrors,
  selectFormValidateSuccessfully,
  selectFormSecondStep,
  selectFormThirdStep,
  selectFormFourthStep,
  selectIsRegistrationComplete,
  selectRegistrationMessage,
  selectUserInfo, // получаем имя и фамилию пользователя
} = registrationSlice.selectors

export default registrationSlice.reducer
