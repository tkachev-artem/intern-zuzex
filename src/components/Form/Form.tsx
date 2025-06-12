'use client'

import { Heading, Stack, Center } from '@chakra-ui/react'
import { Alert, Card } from '@saas-ui/react'
import { Button } from '@saas-ui/react'

//импортируем компонент для формы
import { InputField } from '../InputField/InputField'
import { RoleSelect, type RoleVariant } from '../RoleSelector/RoleSelector'
import { setRole } from '@/features/registration/registrationSlice'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { selectErrors } from '@/features/registration/registrationSlice'

type InputField_Config = {
    label: string
    variant: 'outline' | 'subtle' | 'flushed' | undefined
    placeholder: string
    size: 'xs' | 'sm' | 'md' | 'lg'
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    error?: string | null
    status: 'error' | 'success' | 'warning' | 'info'
}

type FormProps = {
    title: string
    button_text: string
    input_fields?: InputField_Config[]
    button_action: (e: React.MouseEvent<HTMLButtonElement>) => void
    authError?: string | null

    auth_type: 'auth' | 'signup' | 'account' | 'role' | undefined
    handleAuthPage?: () => void
    handleSignupPage?: () => void
}

export const Form = ({ title, button_text, input_fields, button_action, auth_type, handleAuthPage, handleSignupPage, authError }: FormProps) => {

    const dispatch = useAppDispatch()
    const errors = useAppSelector(selectErrors)
    
    const handleRoleChange = (value: string) => {
        dispatch(setRole(value as RoleVariant))
    }

    return (
        <Center width="full" paddingTop="15vh">
            <Stack>
                <Card.Root size="lg" width="420px" padding="6" gap="4">
                    <Card.Header>
                        <Heading size="lg">{title}</Heading>
                    </Card.Header>

                    <Card.Body gap="2">
                        {input_fields?.map((field, index) => (
                            <InputField key={index} {...field} />
                        ))}

                        {auth_type === 'role' && (
                            <RoleSelect 
                                label="Роль"
                                placeholder="Выберите вашу роль"
                                onChange={handleRoleChange}
                                error={errors.role}
                                status="error"
                                error_title="Ошибка в выборе роли"
                            />
                        )}

                        {/* Отображаем ошибку аутентификации */}
                        {authError && (
                            <Stack gap={2} width="full">
                                <Alert status="error" title={authError} padding="2" alignItems="center"></Alert>
                            </Stack>
                        )}

                    </Card.Body>

                    <Card.Footer>
                        <Center width="full">
                            {auth_type === 'auth' && (
                                <>
                                    <Stack>
                                        <Button variant="surface" padding="4" onClick={button_action}>{button_text}</Button>
                                        <Button variant="plain" size="xs" padding="4" textDecoration="underline" onClick={handleSignupPage}>Ещё нет аккаунта?</Button>
                                    </Stack> 
                                </>
                            )}
                            {auth_type === 'signup' && (
                                <>
                                    <Stack>
                                        <Button variant="surface" padding="4" onClick={button_action}>{button_text}</Button>
                                        <Button variant="plain" size="xs" padding="4" textDecoration="underline" onClick={handleAuthPage}>Уже есть аккаунт?</Button>
                                    </Stack>
                                </>
                            )}
                            {auth_type === 'account' && (
                                <Stack>
                                    <Button variant="surface" padding="4" onClick={button_action}>{button_text}</Button>
                                </Stack>
                            )}
                            {auth_type === 'role' && (
                                <Stack>
                                    <Button variant="surface" padding="4" onClick={button_action}>{button_text}</Button>
                                </Stack>
                            )}
                        </Center>
                    </Card.Footer>
                </Card.Root>
            </Stack>
        </Center>
    )
}