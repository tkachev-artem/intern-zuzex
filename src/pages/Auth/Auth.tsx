import { useState } from "react"

import SignUp from "@/components/AuthForm/signup/SignUp"
import Auth from "@/components/AuthForm/auth/Auth"

import "./styles/Auth.scss"

const AuthPage = () => {

  const AUTH_PAGES = {
    AUTH: 1,
    SIGNUP: 2
  }

  const [authPages, setAuthPages] = useState(AUTH_PAGES.AUTH) //отвечает за текущую страницу авторизации

  const handleAuthPage = () => {
    setAuthPages(AUTH_PAGES.AUTH)
  }

  const handleSignupPage = () => {
    setAuthPages(AUTH_PAGES.SIGNUP)
  }

  return (
    <>
      {authPages === AUTH_PAGES.AUTH && (
        <Auth handleAuthPage={handleAuthPage} handleSignupPage={handleSignupPage} />
      )}
      {authPages === AUTH_PAGES.SIGNUP && (
        <SignUp handleAuthPage={handleAuthPage} handleSignupPage={handleSignupPage}/>
      )}
    </>
  )
}

export default AuthPage