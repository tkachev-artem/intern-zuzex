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

// компонент формы
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
    <Center width="full" paddingTop={{
      base: "2vh",
      sm: "5vh", 
      md: "10vh",
      lg: "10vh"
    }}>
      <Stack width="full" maxWidth="500px" padding={{ base: "1", sm: "2", md: "4" }}>
        <Card.Root 
          size={{ base: "md", sm: "lg" }}
          width="full"
          padding={{ base: "4", sm: "6" }}
          gap="4"
          borderRadius={{ base: "lg", sm: "xl" }}
        >
          <Card.Header textAlign="center">
            <Heading 
              size={{ base: "lg", sm: "xl" }}
              marginBottom={{ base: "2", sm: "3" }}
            >
              {title}
            </Heading>
            <Card.Description 
              paddingLeft={{ base: "2", sm: "8", md: "10" }}
              paddingRight={{ base: "2", sm: "8", md: "10" }}
              fontSize={{ base: "sm", sm: "md" }}
              lineHeight={{ base: "1.4", sm: "1.5" }}
            >
              {subtitle}
            </Card.Description>
          </Card.Header>

          <Card.Body gap={{ base: "3", sm: "4" }}>
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
                  padding={{ base: "2", sm: "3" }}
                  alignItems="center"
                  fontSize={{ base: "sm", sm: "md" }}
                ></Alert>
              </Stack>
            )}
          </Card.Body>

          <Card.Footer paddingTop={{ base: "2", sm: "3" }}>
            <Center width="full">
              {/* если форма авторизации */}
              {auth_type === "auth" && (
                <Stack width="full" gap={{ base: "2", sm: "3" }}>
                  <Button
                    variant="surface"
                    padding={{ base: "3", sm: "4" }}
                    onClick={button_action}
                    width="full"
                    fontSize={{ base: "sm", sm: "md" }}
                    height={{ base: "10", sm: "12" }}
                  >
                    {button_text}
                  </Button>
                  <Button
                    variant="plain"
                    size={{ base: "sm", sm: "xs" }}
                    padding={{ base: "2", sm: "4" }}
                    textDecoration="underline"
                    onClick={handleSignupPage}
                    fontSize={{ base: "xs", sm: "sm" }}
                  >
                    Ещё нет аккаунта?
                  </Button>
                </Stack>
              )}
              {/* если форма регистрации */}
              {auth_type === "signup" && (
                <Stack width="full" gap={{ base: "2", sm: "3" }}>
                  <Button
                    variant="surface"
                    padding={{ base: "3", sm: "4" }}
                    onClick={button_action}
                    width="full"
                    fontSize={{ base: "sm", sm: "md" }}
                    height={{ base: "10", sm: "12" }}
                  >
                    {button_text}
                  </Button>
                  <Button
                    variant="plain"
                    size={{ base: "sm", sm: "xs" }}
                    padding={{ base: "2", sm: "4" }}
                    textDecoration="underline"
                    onClick={handleAuthPage}
                    fontSize={{ base: "xs", sm: "sm" }}
                  >
                    Уже есть аккаунт?
                  </Button>
                </Stack>
              )}
              {/* если форма для аккаунта */}
              {auth_type === "account" && (
                <Stack width="full">
                  <Button 
                    variant="surface" 
                    padding={{ base: "3", sm: "4" }} 
                    onClick={button_action}
                    width="full"
                    fontSize={{ base: "sm", sm: "md" }}
                    height={{ base: "10", sm: "12" }}
                  >
                    {button_text}
                  </Button>
                </Stack>
              )}
              {/* если форма для выбора роли */}
              {auth_type === "role" && (
                <Stack width="full">
                  <Button 
                    variant="surface" 
                    padding={{ base: "3", sm: "4" }} 
                    onClick={button_action}
                    width="full"
                    fontSize={{ base: "sm", sm: "md" }}
                    height={{ base: "10", sm: "12" }}
                  >
                    {button_text}
                  </Button>
                </Stack>
              )}
              {/* если форма успешной регистрации */}
              {auth_type === "success" && (
                <Stack width="full">
                  <Button 
                    variant="surface" 
                    padding={{ base: "3", sm: "4" }} 
                    onClick={button_action}
                    width="full"
                    fontSize={{ base: "sm", sm: "md" }}
                    height={{ base: "10", sm: "12" }}
                  >
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
