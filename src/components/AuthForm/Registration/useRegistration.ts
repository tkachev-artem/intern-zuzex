import { useAppSelector } from "@/app/hooks"
import type { RoleType } from "@/components/RoleSelector/Role"
import type { AppDispatch } from "@/app/store"
import { selectName, selectLastname, selectNickname, selectEmail, selectPassword, selectConfirmPassword, selectRole, selectErrors, 
    setName, setLastname, setNickname, setEmail, setPassword, setConfirmPassword, setRole, selectFormValidateSuccessfully, submitRegistration } from "@/features/registration/registrationSlice"

// Экспортируемые селекторы данных
export const useRegistrationData = () => {
    return { //возвращаем данные из хранилища
        name: useAppSelector(selectName),
        lastname: useAppSelector(selectLastname),
        nickname: useAppSelector(selectNickname),
        email: useAppSelector(selectEmail),
        password: useAppSelector(selectPassword),
        confirmPassword: useAppSelector(selectConfirmPassword),
        role: useAppSelector(selectRole),
        errors: useAppSelector(selectErrors)
    }
}

export const useValidateForm = () => {
    return useAppSelector(selectFormValidateSuccessfully) //получаем состояние валидации формы
}

// Экспортируемые обработчики, dispatch: AppDispatch - это функция dispatch из store, иначе никак, потому что вызывать на верхнем уровне нельзя

export const handleNameChange = (dispatch: AppDispatch) => (e: React.ChangeEvent<HTMLInputElement>) => { //обработчик для имени
    dispatch(setName(e.target.value))
}

export const handleLastnameChange = (dispatch: AppDispatch) => (e: React.ChangeEvent<HTMLInputElement>) => { //обработчик для фамилии
    dispatch(setLastname(e.target.value))
}

export const handleNicknameChange = (dispatch: AppDispatch) => (e: React.ChangeEvent<HTMLInputElement>) => { //обработчик для никнейма
    dispatch(setNickname(e.target.value))
}

export const handleEmailChange = (dispatch: AppDispatch) => (e: React.ChangeEvent<HTMLInputElement>) => { //обработчик для email
    dispatch(setEmail(e.target.value))
}

export const handlePasswordChange = (dispatch: AppDispatch) => (e: React.ChangeEvent<HTMLInputElement>) => { //обработчик для пароля
    dispatch(setPassword(e.target.value))
}

export const handleConfirmPasswordChange = (dispatch: AppDispatch) => (e: React.ChangeEvent<HTMLInputElement>) => { //обработчик для подтверждения пароля
    dispatch(setConfirmPassword(e.target.value))
}

export const handleRoleChange = (dispatch: AppDispatch) => (e: React.ChangeEvent<HTMLSelectElement>) => { //обработчик для роли
    dispatch(setRole(e.target.value as RoleType))
}

export const handleSubmit = (dispatch: AppDispatch, data: ReturnType<typeof useRegistrationData>, isFormValid: boolean) => (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!isFormValid) { //если форма не валидна, то выводим ошибки
        console.log("Ошибки в форме", data.errors)
    } else {
        console.log("Ошибок нет") //отправляем данные в хранилище
        dispatch(setName(data.name))
        dispatch(setLastname(data.lastname))
        dispatch(setNickname(data.nickname))
        dispatch(setEmail(data.email))
        dispatch(setPassword(data.password))
        dispatch(setConfirmPassword(data.confirmPassword))
        dispatch(setRole(data.role as RoleType))
        console.log(data) 
    }
}

//финальный этап (отправка данных в хранилище)
export const handleRegistrationSubmit = (dispatch: AppDispatch, data: ReturnType<typeof useRegistrationData>, isFormValid: boolean) => {
    console.log("Состояние валидации формы:", isFormValid)
    console.log("Текущие ошибки:", data.errors)
    console.log("Данные формы:", {
        name: data.name,
        lastname: data.lastname,
        nickname: data.nickname,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        role: data.role
    })
    
    if (!isFormValid) {
        console.log("Ошибки в форме")
        return false
    } else {
        console.log("Форма валидна")
        
        dispatch(submitRegistration())
        
        console.log("Данные регистрации отправлены")
        
        return true
    }
}
