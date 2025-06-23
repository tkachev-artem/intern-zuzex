import { Navigate } from "react-router-dom"
import { useAppSelector } from "@/app/hooks"
import { selectIsAuthenticated } from "@/features/auth/authSlice"

// тип пропсов 
type RouteGuardProps = {
  children: React.ReactNode 
}

// компонент для защиты роутов - только для авторизованных пользователей
export const ProtectedRoute = ({ children }: RouteGuardProps) => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  
  // если не авторизован — перенаправляем на /auth
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />
  }
  
  // если авторизован — показываем защищенный контент (который настроен в app.tsx)
  return <>{children}</>
} 