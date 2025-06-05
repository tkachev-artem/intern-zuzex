import { RoleEnum } from "@/components/RoleSelector/Role"
import { useAppDispatch } from "@/app/hooks"
import { handleNameChange, handleLastnameChange, handleNicknameChange, handleEmailChange, handlePasswordChange, handleConfirmPasswordChange, handleRoleChange, useRegistrationData, handleSubmit, useValidateForm } from "./useRegistration"

const Registration = () => {
    const dispatch = useAppDispatch()
    const { name, lastname, nickname, email, password, confirmPassword, role, errors } = useRegistrationData()
    const isFormValid = useValidateForm();

    //Получим ошибки из хранилища
    const nameError = errors.name
    const lastnameError = errors.lastname
    const nicknameError = errors.nickname
    const emailError = errors.email
    const passwordError = errors.password
    const confirmPasswordError = errors.confirmPassword
    const roleError = errors.role

    const handleData = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        console.log("данные в форме такие:", name, lastname, nickname, email, password, confirmPassword, role)
    }

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        handleData(e);
        handleSubmit(dispatch, { name, lastname, nickname, email, password, confirmPassword, role, errors }, isFormValid)(e);
    };

    return (
        <div>
            <h1>Registration Form</h1>
            <form onSubmit={handleFormSubmit}>
                <div>
                    <label>Имя</label>
                    <input type="text" value={name} onChange={handleNameChange(dispatch)} />
                    {nameError && <p>{nameError}</p>}
                </div>
                <div>
                    <label>Фамилия</label>
                    <input type="text" value={lastname} onChange={handleLastnameChange(dispatch)} />
                    {lastnameError && <p>{lastnameError}</p>}
                </div>
                <div>
                    <label>Никнейм</label>
                    <input type="text" value={nickname} onChange={handleNicknameChange(dispatch)} />
                    {nicknameError && <p>{nicknameError}</p>}
                </div>
                <div>
                    <label>Email</label>
                    <input type="email" value={email} onChange={handleEmailChange(dispatch)} />
                    {emailError && <p>{emailError}</p>}
                </div>
                <div>
                    <label>Пароль</label>
                    <input type="password" value={password} onChange={handlePasswordChange(dispatch)} />
                    {passwordError && <p>{passwordError}</p>}
                </div>
                <div>
                    <label>Подтверждение пароля</label>
                    <input type="password" value={confirmPassword} onChange={handleConfirmPasswordChange(dispatch)} />
                    {confirmPasswordError && <p>{confirmPasswordError}</p>}
                </div>
                <div>
                    <label>Роль</label>
                    <select value={role} onChange={handleRoleChange(dispatch)}>
                        {Object.values(RoleEnum).map((role: RoleEnum) => (
                            <option key={role} value={role}>{role}</option>
                        ))}
                        {roleError && <p>{roleError}</p>}
                    </select>
                </div>
                <button type="submit">Зарегистрироваться</button>
            </form>
        </div>
    )
}

export default Registration