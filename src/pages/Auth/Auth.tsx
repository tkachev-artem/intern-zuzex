import { useState } from "react"

import SignUp from "@/components/AuthForm/signup/SignUp"
import Auth from "@/components/AuthForm/auth/Auth"
import Dither from "@/components/Dither/Dither"

import "./styles/Auth.scss"

const AuthPage = () => {
  const AUTH_PAGES = {
    AUTH: 1,
    SIGNUP: 2,
  }

  // отвечает за текущую страницу авторизации
  const [authPages, setAuthPages] = useState(AUTH_PAGES.AUTH)

  const handleAuthPage = () => {
    setAuthPages(AUTH_PAGES.AUTH)
  }

  const handleSignupPage = () => {
    setAuthPages(AUTH_PAGES.SIGNUP)
  }

  return (
    <div className="auth_container">
      <div className="auth_background">
        <Dither
          waveColor={[0.5, 0.5, 0.5]}
          disableAnimation={false}
          enableMouseInteraction={false}
          colorNum={4}
          waveAmplitude={0.3}
          waveFrequency={3}
          waveSpeed={0.05}
        />
      </div>

      <div className="auth_component">
        {authPages === AUTH_PAGES.AUTH && (
          <Auth
            handleAuthPage={handleAuthPage}
            handleSignupPage={handleSignupPage}
          />
        )}
        {authPages === AUTH_PAGES.SIGNUP && (
          <SignUp
            handleAuthPage={handleAuthPage}
            handleSignupPage={handleSignupPage}
          />
        )}
      </div>
    </div>
  )
}

export default AuthPage
