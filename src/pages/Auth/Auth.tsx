import "./styles/Auth.scss"
import Registration from "@/components/AuthForm/Registration/Registration"

const Auth = () => {
  return (
    <div className="auth_container">
      <div className="auth_title">Auth</div>
      <Registration />
    </div>
  )
}

export default Auth