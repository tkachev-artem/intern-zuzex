import { Form } from "@/components/Form/Form"
import { useAppDispatch, useAppSelector } from "@/app/hooks"
import { handleConfirmPasswordChange, handleNicknameChange, handlePasswordChange } from "../hooks/useSignUp"
import { selectErrors } from "@/features/registration/registrationSlice"

type AccountStepProps = {
    button_action: (e: React.MouseEvent<HTMLButtonElement>) => void
    button_text: string
}

export const AccountStep = ({ button_action, button_text }: AccountStepProps) => {
    const dispatch = useAppDispatch()
    const errors = useAppSelector(selectErrors)
    
    const input_fields = [
        {
            label: 'Имя пользователя',
            variant: 'outline' as const,
            placeholder: 'Придумайте имя пользователя',
            size: 'md' as const,
            onChange: handleNicknameChange(dispatch),
            error: errors.nickname,
            status: 'error' as const,
            error_title: 'Ошибка в имени пользователя'
        },
        {
            label: 'Пароль',
            variant: 'outline' as const,
            placeholder: 'Придумайте пароль',
            size: 'md' as const,
            onChange: handlePasswordChange(dispatch),
            error: errors.password,
            status: 'error' as const,
            error_title: 'Ошибка в пароле'
        },
        {
            label: 'Подтверждение пароля',
            variant: 'outline' as const,
            placeholder: 'Повторите пароль',
            size: 'md' as const,
            onChange: handleConfirmPasswordChange(dispatch),
            error: errors.confirmPassword,
            status: 'error' as const,
            error_title: 'Ошибка в подтверждении пароля'
        }
    ]

    return (
        <Form 
            title="Настройка аккаунта" 
            input_fields={input_fields}
            button_action={button_action}
            button_text={button_text}
            auth_type="account"
        />
    )
}