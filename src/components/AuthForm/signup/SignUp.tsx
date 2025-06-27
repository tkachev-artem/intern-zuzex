import { useState } from "react"

//получим шаги регистрации из соответствующих компонентов
import { UserStep } from "./steps/UserStep"
import { AccountStep } from "./steps/AccountStep"
import { RoleStep } from "./steps/RoleStep"
import { SuccessStep } from "./steps/SuccessStep"
import { useAppSelector, useAppDispatch } from "@/app/hooks"
import {
  selectFormSecondStep,
  selectFormThirdStep,
  selectFormFourthStep,
  submitRegistration,
  validateForm,
  selectRole,
  selectRegistrationMessage,
  resetRegistrationForm,
} from "@/features/registration/registrationSlice"

type SignUpProps = {
  /** функция для перехода на страницу авторизации */
  handleAuthPage: () => void
  /** функция для перехода на страницу регистрации */
  handleSignupPage: () => void
}

const SIGNUP_STEPS = {
  /** шаг 1 - ввод фамилии, имени и почты */
  USER: 1,
  /** шаг 2 - ввод никнейма, пароля и подтверждения пароля */
  ACCOUNT: 2,
  /** шаг 3 - выбор роли */
  ROLE: 3,
  /** шаг 4 - показываем сообщение об успешной регистрации */
  SUCCESS: 4,
} as const

type SignupStepType = (typeof SIGNUP_STEPS)[keyof typeof SIGNUP_STEPS]

// компонент регистрации пользователя
const SignUp = ({ handleAuthPage, handleSignupPage }: SignUpProps) => {
  const dispatch = useAppDispatch()
  // текущий шаг регистрации
  const [signupStep, setSignupStep] = useState<SignupStepType>(SIGNUP_STEPS.USER)

  const isSecondStepValid = useAppSelector(selectFormSecondStep)
  const isThirdStepValid = useAppSelector(selectFormThirdStep)
  const isFourthStepValid = useAppSelector(selectFormFourthStep)
  const currentRole = useAppSelector(selectRole)
  const registrationMessage = useAppSelector(selectRegistrationMessage)

  // обработка шага с пользователем
  const handleUserStep = () => {
    dispatch(validateForm())
    if (isSecondStepValid) {
      setSignupStep(SIGNUP_STEPS.ACCOUNT)
    }
  }

  // обработка шага с аккаунтом
  const handleAccountStep = () => {
    dispatch(validateForm())
    if (isThirdStepValid) {
      setSignupStep(SIGNUP_STEPS.ROLE)
    }
  }

  // обработка шага с ролью
  const handleRoleStep = () => {
    dispatch(validateForm())
    if (currentRole.trim() !== "" && isFourthStepValid) {
      dispatch(submitRegistration())
      setSignupStep(SIGNUP_STEPS.SUCCESS)
    }
  }

  // обработка успешной регистрации
  const handleSuccessStep = () => {
    dispatch(resetRegistrationForm())
    handleAuthPage()
  }

  return (
    <>
      {/* шаг 1: ввод персональных данных */}
      {signupStep === SIGNUP_STEPS.USER && (
        <UserStep
          handleAuthPage={handleAuthPage}
          handleSignupPage={handleSignupPage}
          button_action={handleUserStep}
          button_text="Далее"
        />
      )}
      {/* шаг 2: создание аккаунта */}
      {signupStep === SIGNUP_STEPS.ACCOUNT && (
        <AccountStep button_action={handleAccountStep} button_text="Далее" />
      )}
      {/* шаг 3: выбор роли */}
      {signupStep === SIGNUP_STEPS.ROLE && (
        <RoleStep
          button_action={handleRoleStep}
          button_text="Завершить регистрацию"
        />
      )}
      {/* шаг 4: успешная регистрация */}
      {signupStep === SIGNUP_STEPS.SUCCESS && (
        <SuccessStep
          button_action={handleSuccessStep}
          button_text="Войти в аккаунт"
          message={registrationMessage}
        />
      )}
    </>
  )
}

export default SignUp
