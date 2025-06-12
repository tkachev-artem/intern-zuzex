import { useState } from "react"

//получим шаги регистрации из соответствующих компонентов
import { UserStep } from "./steps/UserStep"
import { AccountStep } from "./steps/AccountStep"
import { RoleStep } from "./steps/RoleStep"
import { SuccessStep } from "./steps/SuccessStep"
import { useAppSelector, useAppDispatch } from "@/app/hooks"
import { selectFormSecondStep, selectFormThirdStep, selectFormFourthStep, submitRegistration, selectForm, validateForm, selectRole } from "@/features/registration/registrationSlice"


type SignUpProps = {
    handleAuthPage: () => void
    handleSignupPage: () => void
}

const SignUp = ({ handleAuthPage, handleSignupPage }: SignUpProps) => {
    const dispatch = useAppDispatch()

    const SIGNUP_STEPS = { //шаги регистрации
        USER: 1, //шаг 1 - ввод фамилии, имени и почты
        ACCOUNT: 2, //шаг 2 - ввод никнейма, пароля и подтверждения пароля  
        ROLE: 3, //шаг 3 - выбор роли
        SUCCESS: 4 //шаг 4 - показываем сообщение об успешной регистрации
    }

    const [signupStep, setSignupStep] = useState(SIGNUP_STEPS.USER) //отвечает за текущий шаг регистрации

    //получение состояния валидации из хранилища
    const isSecondStepValid = useAppSelector(selectFormSecondStep)
    const isThirdStepValid = useAppSelector(selectFormThirdStep)  
    const isFourthStepValid = useAppSelector(selectFormFourthStep)

    const formData = useAppSelector(selectForm)
    const currentRole = useAppSelector(selectRole)

    //обработчики перехода на следующий шаг

    const handleUserStep = () => {
        dispatch(validateForm()) //прогонка валидации, выдает ошибки, если на кнопку нажал, а данные не валидны

        if (isSecondStepValid) {
            setSignupStep(SIGNUP_STEPS.ACCOUNT)
        } else {
            console.log('Ошибки в форме')
        }
    }

    const handleAccountStep = () => {
        dispatch(validateForm()) //прогонка валидации, выдает ошибки, если на кнопку нажал, а данные не валидны

        if (isThirdStepValid) {
            setSignupStep(SIGNUP_STEPS.ROLE)
        } else {
            console.log('Ошибки в форме')
        }
    }

    const handleRoleStep = () => {
        dispatch(validateForm()) //прогонка валидации, выдает ошибки, если на кнопку нажал, а данные не валидны
        
        // проверка роли
        if (currentRole.trim() !== "" && isFourthStepValid) {
            dispatch(submitRegistration())

            console.log(formData)

            setSignupStep(SIGNUP_STEPS.SUCCESS)
        } else {
            console.log('Ошибки в форме: роль не выбрана или другие ошибки')
        }
    }

    const handleSuccessStep = () => {
        setSignupStep(SIGNUP_STEPS.SUCCESS)
    }

    return (
        <>
            {signupStep === SIGNUP_STEPS.USER && (
                <UserStep handleAuthPage={handleAuthPage} handleSignupPage={handleSignupPage} button_action={handleUserStep} button_text="Далее" />
            )}
            {signupStep === SIGNUP_STEPS.ACCOUNT && (
                <AccountStep button_action={handleAccountStep} button_text="Далее" />
            )}
            {signupStep === SIGNUP_STEPS.ROLE && (
                <RoleStep button_action={handleRoleStep} button_text="Завершить" />
            )}
            {signupStep === SIGNUP_STEPS.SUCCESS && (
                <SuccessStep button_action={handleSuccessStep} button_text="Готово" />
            )}
        </>
    )
}

export default SignUp