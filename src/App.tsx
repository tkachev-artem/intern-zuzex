import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Home from "./pages/Home/Home"
import "./App.css"
import Auth from "./pages/Auth/Auth"

import { initializeDefaultUsers, loadFromStorage } from "./middleware"
import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "./app/hooks"
import { restoreUser, selectIsAuthenticated } from "./features/auth/authSlice"
import { ProtectedRoute } from "./components/RouteGuard/RouteGuard"

export const App = () => {
  const dispatch = useAppDispatch()
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const [isInitialized, setIsInitialized] = useState(false)

  // инициализация приложения
  useEffect(() => {
    // создаем тестовых пользователей если их нет
    initializeDefaultUsers()
    
    // восстанавливаем сессию пользователя из localStorage
    const userAuthLS = loadFromStorage()?.auth
    if (userAuthLS?.isAuthenticated && userAuthLS.user) {
      dispatch(restoreUser({ nickname: userAuthLS.user }))
    }
    
    // отмечаем что инициализация завершена
    setIsInitialized(true)
  }, [dispatch])

  // показываем загрузку пока идет инициализация
  if (!isInitialized) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px'
      }}>
        Загрузка...
      </div>
    )
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* защищенная главная страница - только для авторизованных */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } 
        />
        
        {/* страница авторизации - если уже авторизован, перенаправляем на главную */}
        <Route 
          path="/auth" 
          element={isAuthenticated ? <Navigate to="/" replace /> : <Auth />} 
        />

        {/* здесь должна быть страница с постом с полным текстом */}
        
        {/* профиль пользователя */}

        {/* перенаправление с любых других роутов на главную */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
