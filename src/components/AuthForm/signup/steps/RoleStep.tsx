
import { Form } from "@/components/Form/Form"

type RoleStepProps = {
  button_action: (e: React.MouseEvent<HTMLButtonElement>) => void
  button_text: string
}

export const RoleStep = ({ button_action, button_text }: RoleStepProps) => {
  return (
    <Form
      title="Выбор роли"
      subtitle="От выбора вашей роли зависит, какие функции будут доступны в системе"
      button_action={button_action}
      button_text={button_text}
      auth_type="role"
    />
  )
}
