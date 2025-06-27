"use client"

// импортируем нужные компоненты для поля ввода
import { HStack, Stack } from "@chakra-ui/react"
import { Field, Input, PasswordInput, Alert } from "@saas-ui/react"
import { useState } from "react"

// тип для пропсов поля ввода
type InputFieldProps = {
  label: string // название поля
  variant: "outline" | "subtle" | "flushed" | undefined // стиль поля
  placeholder: string // подсказка внутри поля
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void // обработчик изменения
  error?: string | null // текст ошибки
  status: "error" | "success" | "warning" | "info" // статус для алерта
  type?: "text" | "password" // тип поля (текст или пароль)
}

// компонент поля ввода
export const InputField = ({
  label,
  variant,
  placeholder,
  error,
  status,
  onChange,
  type = "text"
}: InputFieldProps) => {
  const [visible, setVisible] = useState(false) // состояние для показа/скрытия пароля

  return (
    <HStack gap={{ base: "2", sm: "4", md: "6" }} width="full">
      <Stack gap={{ base: "1", sm: "2" }} width="full">
        <Field.Root required>
          <Field.Label 
            fontSize={{ base: "sm", sm: "md" }}
            fontWeight={{ base: "medium", sm: "semibold" }}
          >
            {label}
          </Field.Label>
          {/* если поле для пароля — показываем PasswordInput */}
          {type === "password" ? (
            <PasswordInput
              placeholder={placeholder}
              variant={variant}
              size={{ base: "md", sm: "lg" }}
              onChange={onChange}
              visible={visible}
              onVisibleChange={setVisible}
              paddingLeft={{ base: "8px", sm: "12px" }}
              height={{ base: "10", sm: "12" }}
              fontSize={{ base: "sm", sm: "md" }}
            />
          ) : (
            // иначе обычный Input
            <Input
              placeholder={placeholder}
              variant={variant}
              size={{ base: "md", sm: "lg" }}
              onChange={onChange}
              paddingLeft={{ base: "8px", sm: "12px" }}
              height={{ base: "10", sm: "12" }}
              fontSize={{ base: "sm", sm: "md" }}
            />
          )}
        </Field.Root>
        {/* если есть ошибка — показываем алерт */}
        {error && (
          <Stack gap={{ base: "1", sm: "2" }} width="full">
            <Alert
              status={status}
              title={error}
              padding={{ base: "2", sm: "3" }}
              alignItems="center"
              fontSize={{ base: "xs", sm: "sm" }}
              borderRadius={{ base: "md", sm: "lg" }}
            ></Alert>
          </Stack>
        )}
      </Stack>
    </HStack>
  )
}
