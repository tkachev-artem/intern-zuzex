import { RoleEnum } from "@/components/RoleSelector/Role"
import { useAppDispatch, useAppSelector } from "@/app/hooks"
import { handleNameChange, handleLastnameChange, handleNicknameChange, handleEmailChange, handlePasswordChange, handleConfirmPasswordChange, handleRoleChange, useRegistrationData, useValidateForm, handleRegistrationSubmit } from "./useRegistration"
import { useState } from "react"
import "./styles/Registration.scss"


import { InputField } from "@/components/InputField/InputField"
import { 
    Card, 
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { selectFormFourthStep, selectFormSecondStep, selectFormThirdStep } from "@/features/registration/registrationSlice"

const Registration = () => {
    const dispatch = useAppDispatch()
    const { name, lastname, nickname, email, password, confirmPassword, role, errors } = useRegistrationData()

    const formSecondStep = useAppSelector(selectFormSecondStep)
    const formThirdStep = useAppSelector(selectFormThirdStep)
    const formFourthStep = useAppSelector(selectFormFourthStep)
    const isFormValid = useValidateForm();

    const REG_STEPS = {
        USER: 1,
        ACCOUNT: 2,
        ROLE: 3,
        SUCCESS: 4
    }

    const [currentStep, setCurrentStep] = useState(REG_STEPS.USER)

    // создадим обработку перехода на следующий этап
    const handleSecondStep = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        if (formSecondStep) {
            setCurrentStep(REG_STEPS.ACCOUNT)
        } else {
            console.log("Поля некорректны")
        }
    }

    const handleThirdStep = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        if (formThirdStep) {
            setCurrentStep(REG_STEPS.ROLE)
        } else {
            console.log("Поля некорректны")
        }
    }

    const handleFourthStep = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        if (formFourthStep) {
            // Создаем объект данных для отправки через dispatch
            const registrationData = { name, lastname, nickname, email, password, confirmPassword, role, errors }
            
            // Используем dispatch для отправки данных регистрации
            const isSubmitSuccessful = handleRegistrationSubmit(dispatch, registrationData, isFormValid)
            
            if (isSubmitSuccessful) {
                setCurrentStep(REG_STEPS.SUCCESS)
            }
        } else {
            console.log("Поля некорректны")
        }
    }

    //Получим ошибки из хранилища
    const nameError = errors.name
    const lastnameError = errors.lastname
    const nicknameError = errors.nickname
    const emailError = errors.email
    const passwordError = errors.password
    const confirmPasswordError = errors.confirmPassword
    const roleError = errors.role



    return (
        <div className="registration-page">
            <form>
                {currentStep === REG_STEPS.USER && (
                    <Card className="registration-container">
                        <CardHeader>
                            <CardTitle>Создание аккаунта</CardTitle>
                            <CardDescription>Давайте знакомиться! Напишите кто вы <br /> и укажите вашу почту</CardDescription>
                        </CardHeader>

                        <CardContent className="card-container">
                            <InputField text="Имя" type="text" placeholder="Иван" value={name} onChange={handleNameChange(dispatch)} error={nameError} />
                            <InputField text="Фамилия" type="text" placeholder="Иванов" value={lastname} onChange={handleLastnameChange(dispatch)} error={lastnameError} />
                            <InputField text="Email" type="email" placeholder="example@example.ru" value={email} onChange={handleEmailChange(dispatch)} error={emailError} />
                        </CardContent>

                        <CardFooter className="button-container"> 

                            {/* Для прехода на следующий этап ввода данных проверяем поля на корректность (handleSecondStep) */}
                            <Button className="button" variant="secondary" type="button" onClick={handleSecondStep}>Далее</Button>
                            
                            
                            <Button className="button" variant="link" type="button">Уже есть аккаунт?</Button>

                        </CardFooter>

                    </Card>
                )}

                {currentStep === REG_STEPS.ACCOUNT && (
                    <Card className="registration-container">
                        <CardHeader>
                            <CardTitle>Создание аккаунта</CardTitle>
                            <CardDescription>Эти данные будут использоваться для входа в аккаунт</CardDescription>
                        </CardHeader>

                        <CardContent className="card-container">
                            <InputField text="Никнейм" type="text" placeholder="nickname" value={nickname} onChange={handleNicknameChange(dispatch)} error={nicknameError} />
                            <InputField text="Пароль" type="password" placeholder="********" value={password} onChange={handlePasswordChange(dispatch)} error={passwordError} />
                            <InputField text="Подтверждение пароля" type="password" placeholder="********" value={confirmPassword} onChange={handleConfirmPasswordChange(dispatch)} error={confirmPasswordError} />
                        </CardContent>

                        <CardFooter className="button-container">
                            <Button className="button" variant="secondary" type="button" onClick={handleThirdStep}>Далее</Button>
                            <Button className="button" variant="link" type="button" onClick={() => { setCurrentStep(REG_STEPS.USER) }}>Назад</Button>
                        </CardFooter>
                    </Card>
                )}

                {currentStep === REG_STEPS.ROLE && (
                    <Card className="registration-container">
                        <CardHeader>
                            <CardTitle>Создание аккаунта</CardTitle>
                            <CardDescription>Выберите вашу роль, это последний этап</CardDescription>
                        </CardHeader>

                        <CardContent>
                        <select value={role} onChange={handleRoleChange(dispatch)}>
                        {Object.values(RoleEnum).map((role: RoleEnum) => (
                            <option key={role} value={role}>{role}</option>
                        ))}
                        {roleError && <p>{roleError}</p>}
                    </select>

                        </CardContent>

                        <CardFooter className="button-container">
                            <Button className="button" type="button" onClick={handleFourthStep}>Зарегистрироваться</Button>
                            <Button className="button" variant="link" type="button" onClick={() => { setCurrentStep(REG_STEPS.ACCOUNT) }}>Назад</Button>
                        </CardFooter>
                    </Card>
                )}

                {currentStep === REG_STEPS.SUCCESS && (
                    <Card className="registration-container">
                        <CardHeader>
                            <CardTitle>Создание аккаунта</CardTitle>
                            <CardDescription>Вы успешно зарегистрировались</CardDescription>
                        </CardHeader>

                        <CardContent>
                            <p>Ваш аккаунт успешно создан</p>
                        </CardContent>
                    </Card>
                )}
            </form>
        </div>
    )
}

export default Registration