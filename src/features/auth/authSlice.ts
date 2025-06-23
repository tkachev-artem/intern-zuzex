import { createAppSlice } from "@/app/createAppSlice"
import type { AuthErrors } from "@/components/ErrorMessage/authValidators"
import type { PayloadAction } from "@reduxjs/toolkit"

// валидаторы для проверки формы
import { authValidators } from "@/components/ErrorMessage/authValidators"

// импорт для работы с localStorage
import { findUserByNickname } from "@/middleware"

// тип для состояния пользователя
type UserState = {
  isAuthenticated: boolean
  user: {
    id: string
    nickname: string
    role: string 
    token: string
  } | null
}

// тип для формы авторизации
type AuthFormState = {
  nickname: string
  password: string
}

// тип для всего состояния auth
type AuthState = {
  form: AuthFormState
  errors: AuthErrors
  userState: UserState
}

// начальное состояние
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
  userState: {
    isAuthenticated: false,
    user: null,
  },
}

const authSlice = createAppSlice({
  name: "auth",
  initialState,

  reducers: create => ({
    // меняем никнейм в форме
    setNickname: create.reducer(
      (state: AuthState, action: PayloadAction<string>) => {
        state.form.nickname = action.payload
      },
    ),

    // меняем пароль в форме
    setPassword: create.reducer(
      (state: AuthState, action: PayloadAction<string>) => {
        state.form.password = action.payload
      },
    ),

    // меняем ошибки валидации
    setErrors: create.reducer(
      (state: AuthState, action: PayloadAction<AuthErrors>) => {
        state.errors = action.payload
      },
    ),

    // валидируем форму
    validateAuthForm: create.reducer((state: AuthState) => {
      state.errors.nickname = authValidators.validateNickname(
        state.form.nickname,
      )
      state.errors.password = authValidators.validatePassword(
        state.form.password,
      )
    }),

    // логин пользователя через localStorage
    loginUser: create.reducer((state: AuthState) => {
      const storedUser = findUserByNickname(state.form.nickname)

      if (storedUser && storedUser.password === state.form.password) {
        state.userState.isAuthenticated = true
        state.userState.user = {
          id: storedUser.id,
          nickname: storedUser.nickname,
          role: storedUser.role,
          token: `localStorage_token_${Date.now().toString()}`,
        }

        // очищаем форму
        state.form.nickname = ""
        state.form.password = ""
        state.errors = {
          nickname: null,
          password: null,
          authError: null,
        }
      } else {
        state.errors.authError = "Пользователь не найден или неверный пароль"
      }
    }),

    // очищаем форму
    clearForm: create.reducer((state: AuthState) => {
      state.form.nickname = ""
      state.form.password = ""
      state.errors = {
        nickname: null,
        password: null,
        authError: null,
      }
    }),

    // логаут пользователя
    logout: create.reducer((state: AuthState) => {
      state.userState.isAuthenticated = false
      state.userState.user = null
      state.form.nickname = ""
      state.form.password = ""
      state.errors = {
        nickname: null,
        password: null,
        authError: null,
      }
    }),

    // восстановление пользователя из localStorage
    restoreUser: create.reducer(
      (state: AuthState, action: PayloadAction<{ nickname: string }>) => {
        const { nickname } = action.payload
        
        // ищем пользователя по нику
        const storedUser = findUserByNickname(nickname)
        
        if (storedUser) {
          state.userState.isAuthenticated = true
          state.userState.user = {
            id: storedUser.id,
            nickname: storedUser.nickname,
            role: storedUser.role,
            token: `restored_token_${Date.now().toString()}`,
          }
        } else {
          state.errors.authError = "Пользователь не найден"
        }
      }
    )
  }),

  // селекторы для получения данных из состояния
  selectors: {
    selectNickname: (state: AuthState) => state.form.nickname,
    selectPassword: (state: AuthState) => state.form.password,
    selectAuthForm: (state: AuthState) => state.form,

    selectErrors: (state: AuthState) => state.errors,
    selectNicknameError: (state: AuthState) => state.errors.nickname,
    selectPasswordError: (state: AuthState) => state.errors.password,
    selectAuthError: (state: AuthState) => state.errors.authError,

    selectUserState: (state: AuthState) => state.userState,
    selectIsAuthenticated: (state: AuthState) =>
      state.userState.isAuthenticated,
    selectUser: (state: AuthState) => state.userState.user,
    selectUserRole: (state: AuthState) => state.userState.user?.role,
    selectUserNickname: (state: AuthState) => state.userState.user?.nickname,
    selectUserToken: (state: AuthState) => state.userState.user?.token,
    selectUserId: (state: AuthState) => state.userState.user?.id,
  },
})

// экспортируем экшены
export const {
  setNickname,
  setPassword,
  setErrors,
  validateAuthForm,
  loginUser,
  clearForm,
  logout,
  restoreUser,
} = authSlice.actions

// экспортируем селекторы
export const {
  selectNickname,
  selectPassword,
  selectAuthForm,
  selectErrors,
  selectNicknameError,
  selectPasswordError,
  selectAuthError,
  selectUserState,
  selectIsAuthenticated,
  selectUser,
  selectUserRole,
  selectUserNickname,
  selectUserToken,
  selectUserId,
} = authSlice.selectors

// экспорт самого slice
export { authSlice }
export default authSlice.reducer
