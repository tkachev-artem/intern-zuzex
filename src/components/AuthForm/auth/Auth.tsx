import { Form } from "@/components/Form/Form"
import { authValidators } from "@/components/ErrorMessage/authValidators"
import { useAppDispatch, useAppSelector } from "@/app/hooks"
import { setNickname, setPassword, setErrors, selectNickname, selectPassword, selectAuthForm, selectNicknameError, selectPasswordError, selectAuthError } from "@/features/auth/authSlice"

type AuthProps = {
    handleAuthPage: () => void
    handleSignupPage: () => void
}

const Auth = ({ handleAuthPage, handleSignupPage }: AuthProps) => {
    const dispatch = useAppDispatch()
    
    const nickname = useAppSelector(selectNickname)
    const password = useAppSelector(selectPassword)

    const formData = useAppSelector(selectAuthForm)
    const nicknameError = useAppSelector(selectNicknameError)
    const passwordError = useAppSelector(selectPasswordError)
    const authError = useAppSelector(selectAuthError)

    //console.log(nicknameError, passwordError)

    const input_fields = [
        {
            label: 'Имя пользователя',
            variant: 'outline' as const,
            placeholder: 'Введите ваш никнейм',
            size: 'lg' as const,
            value: nickname,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                dispatch(setNickname(e.target.value))
                
                // Валидируем поле используя authValidators
                const nicknameValidationError = authValidators.validateNickname(e.target.value)
                dispatch(setErrors({
                    nickname: nicknameValidationError,
                    password: passwordError
                }))
            },
            error: nicknameError,
            status: 'error' as const,
        },
        {
            label: 'Пароль',
            variant: 'outline' as const,
            placeholder: 'Введите ваш пароль',
            size: 'lg' as const,
            value: password,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                dispatch(setPassword(e.target.value))
                
                // Валидируем поле используя authValidators
                const passwordValidationError = authValidators.validatePassword(e.target.value)
                dispatch(setErrors({
                    nickname: nicknameError,
                    password: passwordValidationError
                }))
            },
            error: passwordError,
            status: 'error' as const,
        }
    ]

    const handleAuth = () => {
        const validationResult = authValidators.validateAuthForm(nickname, password)
        
        dispatch(setErrors({
            nickname: validationResult.nicknameError,
            password: validationResult.passwordError,
            authError: validationResult.authError
        }))
        
        if (!validationResult.nicknameError && !validationResult.passwordError && !validationResult.authError) {
            dispatch(setNickname(nickname))
            dispatch(setPassword(password))

            console.log(formData)

        } else {
            console.log('Ошибки в форме:', validationResult)
        }
    }

    return (
        <Form 
            title="Авторизация" 
            input_fields={input_fields}
            button_action={handleAuth}
            button_text="Войти"
            auth_type="auth"
            authError={authError}
            handleAuthPage={handleAuthPage}
            handleSignupPage={handleSignupPage}
        />
    )
}

export default Auth