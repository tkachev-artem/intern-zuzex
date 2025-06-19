
import { Form } from "@/components/Form/Form"
import { useAppDispatch, useAppSelector } from "@/app/hooks"
import {
  handleEmailChange,
  handleLastnameChange,
  handleNameChange,
} from "../hooks/useSignUp"
import { selectErrors } from "@/features/registration/registrationSlice"

type UserStepProps = {
  button_action: (e: React.MouseEvent<HTMLButtonElement>) => void
  button_text: string
  handleAuthPage: () => void
  handleSignupPage: () => void
}

export const UserStep = ({
  button_action,
  button_text,
  handleAuthPage,
  handleSignupPage,
}: UserStepProps) => {
  const dispatch = useAppDispatch()
  const errors = useAppSelector(selectErrors)

  const input_fields = [
    {
      label: "Имя",
      variant: "outline" as const,
      placeholder: "Введите ваше имя",
      onChange: handleNameChange(dispatch),
      error: errors.name,
      status: "error" as const,
      type: "text" as const,
    },
    {
      label: "Фамилия",
      variant: "outline" as const,
      placeholder: "Введите вашу фамилию",
      onChange: handleLastnameChange(dispatch),
      error: errors.lastname,
      status: "error" as const,
      type: "text" as const,
    },
    {
      label: "Email",
      variant: "outline" as const,
      placeholder: "Введите ваш email",
      onChange: handleEmailChange(dispatch),
      error: errors.email,
      status: "error" as const,
      type: "text" as const,
    },
  ]

  return (
    <Form
      title="Создание аккаунта"
      subtitle="Чтобы создать аккаунт, нужно ввести ваше имя, фамилию и почту"
      input_fields={input_fields}
      button_action={button_action}
      button_text={button_text}
      auth_type="signup"
      handleAuthPage={handleAuthPage}
      handleSignupPage={handleSignupPage}
    />
  )
}
