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
    <HStack gap="10" width="full">
      <Stack gap="2" width="full">
        <Field.Root required>
          <Field.Label>{label}</Field.Label>
          {/* если поле для пароля — показываем PasswordInput */}
          {type === "password" ? (
            <PasswordInput
              placeholder={placeholder}
              variant={variant}
              size="lg"
              onChange={onChange}
              visible={visible}
              onVisibleChange={setVisible}
              paddingLeft="12px"
            />
          ) : (
            // иначе обычный Input
            <Input
              placeholder={placeholder}
              variant={variant}
              size="lg"
              onChange={onChange}
              paddingLeft="12px"
            />
          )}
        </Field.Root>
        {/* если есть ошибка — показываем алерт */}
        {error && (
          <Stack gap={2} width="full">
            <Alert
              status={status}
              title={error}
              padding="2"
              alignItems="center"
            ></Alert>
          </Stack>
        )}
      </Stack>
    </HStack>
  )
}
