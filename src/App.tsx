import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Home from "./pages/Home/Home"
import "./App.css"
import Auth from "./pages/Auth/Auth"

import { storageLocalAPI } from "./LocalAPI"
import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "./app/hooks"
import { restoreUser, selectIsAuthenticated } from "./features/auth/authSlice"
import { ProtectedRoute } from "./components/RouteGuard/RouteGuard"
import PostPage from "./pages/Post/PostPage"
import { Profile } from "./pages/Profile/Profile"
import { ProfilesSet } from "./LocalAPI/setdata/profilesetLocalAPI"

// Определяем базовый путь для GitHub Pages
const basename = import.meta.env.NODE_ENV === 'production' ? '/it-lenta' : ''

export const App = () => {
  ProfilesSet();
  const dispatch = useAppDispatch()
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const [isInitialized, setIsInitialized] = useState(false)

  // инициализация приложения
  useEffect(() => {
    //сесия
    const userAuthSession = storageLocalAPI.getStorageData()?.auth
    if (userAuthSession?.isAuthenticated && userAuthSession.user) {
      dispatch(restoreUser({ nickname: userAuthSession.user }))
    }
    
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
    <BrowserRouter basename={basename}>
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
        <Route 
          path="/post/:id" 
          element={<PostPage />} 
        />
        
        {/* мой профиль */}
        <Route 
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        
        {/* профиль пользователя по username */}
        <Route 
          path="/:username"
          element={<Profile />}
        />

        {/* перенаправление с любых других роутов на главную */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
