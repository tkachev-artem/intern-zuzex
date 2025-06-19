import { registrationSlice } from "@/features/registration/registrationSlice"
import { authSlice } from "@/features/auth/authSlice"
import { postSlice } from "@/features/posts/postSlice"

import type { Action, ThunkAction } from "@reduxjs/toolkit"
import { combineSlices, configureStore } from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/query"

// Middleware для автоматической синхронизации с localStorage
import { localStorageMiddleware } from "@/middleware/localStorageMiddleware"

const rootReducer = combineSlices(registrationSlice, authSlice, postSlice)

export type RootState = ReturnType<typeof rootReducer>

export const makeStore = (preloadedState?: Partial<RootState>) => {
  const store = configureStore({
    reducer: rootReducer,

    // Добавление middleware включает кеширование, инвалидацию, polling
    // и другие полезные функции RTK Query
    middleware: getDefaultMiddleware => {
      return getDefaultMiddleware().concat(localStorageMiddleware)
    },

    // Применяем предзагруженное состояние если оно передано
    ...(preloadedState && { preloadedState }),
  })

  // Настраиваем слушатели используя предоставленные по умолчанию
  // Опционально, но требуется для поведения `refetchOnFocus`/`refetchOnReconnect`
  setupListeners(store.dispatch)

  return store
}

export const store = makeStore()

export type AppStore = typeof store

export type AppDispatch = AppStore["dispatch"]

export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>
