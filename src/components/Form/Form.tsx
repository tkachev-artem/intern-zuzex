"use client"

import { Heading, Stack, Center } from "@chakra-ui/react"
import { Alert, Card } from "@saas-ui/react"
import { Button } from "@saas-ui/react"

// импортируем компонент для поля ввода
import { InputField } from "../InputField/InputField"
import { RoleSelect, type RoleVariant } from "../RoleSelector/RoleSelector"
import { setRole } from "@/features/registration/registrationSlice"
import { useAppDispatch, useAppSelector } from "@/app/hooks"
import { selectErrors } from "@/features/registration/registrationSlice"

// тип для одного поля ввода
type InputField_Config = {
  label: string
  variant: "outline" | "subtle" | "flushed" | undefined
  placeholder: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: string | null
  status: "error" | "success" | "warning" | "info"
  type?: "text" | "password"
}

// тип для пропсов формы
type FormProps = {
  title: string // заголовок
  subtitle: string // подзаголовок
  button_text: string // текст на кнопке
  input_fields?: InputField_Config[] // поля ввода
  button_action: (e: React.MouseEvent<HTMLButtonElement>) => void // обработчик кнопки
  authError?: string | null // ошибка авторизации
  auth_type: "auth" | "signup" | "account" | "role" | "success" | undefined // тип формы
  handleAuthPage?: () => void // обработчик перехода на страницу авторизации
  handleSignupPage?: () => void // обработчик перехода на страницу регистрации
}

// сам компонент формы
export const Form = ({
  title,
  subtitle,
  button_text,
  input_fields,
  button_action,
  auth_type,
  handleAuthPage,
  handleSignupPage,
  authError,
}: FormProps) => {
  const dispatch = useAppDispatch()
  const errors = useAppSelector(selectErrors)

  // обработчик для выбора роли
  const handleRoleChange = (value: string) => {
    dispatch(setRole(value as RoleVariant))
  }

  return (
    <Center width="full" paddingTop="15vh">
      <Stack>
        <Card.Root size="lg" width="420px" padding="6" gap="4">
          <Card.Header textAlign="center">
            <Heading size="xl">{title}</Heading>
            <Card.Description paddingLeft="40px" paddingRight="40px">
              {subtitle}
            </Card.Description>
          </Card.Header>

          <Card.Body gap="4">
            {/* рендерим все поля ввода */}
            {input_fields?.map((field, index) => (
              <InputField key={index} {...field} />
            ))}

            {/* если форма для выбора роли — показываем селектор роли */}
            {auth_type === "role" && (
              <RoleSelect
                label="Роль"
                placeholder="Выберите вашу роль"
                onChange={handleRoleChange}
                error={errors.role}
                status="error"
                error_title="Ошибка в выборе роли"
              />
            )}

            {/* если есть ошибка — показываем алерт */}
            {authError && (
              <Stack gap={2} width="full">
                <Alert
                  status="error"
                  title={authError}
                  padding="2"
                  alignItems="center"
                ></Alert>
              </Stack>
            )}
          </Card.Body>

          <Card.Footer paddingTop="2">
            <Center width="full">
              {/* если форма авторизации */}
              {auth_type === "auth" && (
                <Stack>
                  <Button
                    variant="surface"
                    padding="4"
                    onClick={button_action}
                  >
                    {button_text}
                  </Button>
                  <Button
                    variant="plain"
                    size="xs"
                    padding="4"
                    textDecoration="underline"
                    onClick={handleSignupPage}
                  >
                    Ещё нет аккаунта?
                  </Button>
                </Stack>
              )}
              {/* если форма регистрации */}
              {auth_type === "signup" && (
                <Stack>
                  <Button
                    variant="surface"
                    padding="4"
                    onClick={button_action}
                  >
                    {button_text}
                  </Button>
                  <Button
                    variant="plain"
                    size="xs"
                    padding="4"
                    textDecoration="underline"
                    onClick={handleAuthPage}
                  >
                    Уже есть аккаунт?
                  </Button>
                </Stack>
              )}
              {/* если форма для аккаунта */}
              {auth_type === "account" && (
                <Stack>
                  <Button variant="surface" padding="4" onClick={button_action}>
                    {button_text}
                  </Button>
                </Stack>
              )}
              {/* если форма для выбора роли */}
              {auth_type === "role" && (
                <Stack>
                  <Button variant="surface" padding="4" onClick={button_action}>
                    {button_text}
                  </Button>
                </Stack>
              )}
              {/* если форма успешной регистрации */}
              {auth_type === "success" && (
                <Stack>
                  <Button variant="surface" padding="4" onClick={button_action}>
                    {button_text}
                  </Button>
                </Stack>
              )}
            </Center>
          </Card.Footer>
        </Card.Root>
      </Stack>
    </Center>
  )
}
