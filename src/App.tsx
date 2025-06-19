import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home/Home"
import "./App.css"
import Auth from "./pages/Auth/Auth"

import { initializeDefaultUsers, loadFromStorage } from "./middleware/localStorageMiddleware"
import { useEffect } from "react"
import { useAppDispatch } from "./app/hooks"
import { restoreUser } from "./features/auth/authSlice"

export const App = () => {

  const dispatch = useAppDispatch()
  //тестовые пользователи для авторизации
  useEffect(() => {
    initializeDefaultUsers()
  }, [])

  // при загрузке берем данные пользователя для авторизации из локального хранилища
  useEffect(() => {
    const userAuthLS = loadFromStorage()?.auth
    if (userAuthLS?.isAuthenticated && userAuthLS.user) {
      dispatch(restoreUser({ nickname: userAuthLS.user })) 
    }
  }, [dispatch])

  return (
    <BrowserRouter> {/* маршруты через react router */}
      <Routes>
        {/* главная страница */}  
        <Route path="/" element={<Home />} />
        
        {/* страница авторизации и регистрации */}
        <Route path="/auth" element={<Auth />} />

      </Routes>
    </BrowserRouter>
  )
}
