"use client"

import { useState, useEffect } from "react"
import { Stack } from "@chakra-ui/react"
import { Select, Alert } from "@saas-ui/react"
import { roleVariants, type RoleVariant } from "./useRole"

type RoleSelectProps = {
  label: string
  placeholder: string
  value?: string
  onChange: (value: string) => void
  error?: string | null
  status?: "error" | "success" | "warning" | "info"
  error_title?: string
}

export const RoleSelect = ({
  label,
  placeholder,
  value: initialValue,
  onChange,
  error,
  status = "error",
}: RoleSelectProps) => {
  // локальное состояние выбранного значения
  const [value, setValue] = useState<string[]>(
    initialValue ? [initialValue] : []
  )

  // обновляем локальное состояние при изменении пропса
  useEffect(() => {
    if (initialValue) {
      setValue([initialValue])
    } else {
      setValue([])
    }
  }, [initialValue])

  return (
    <Stack gap={{ base: "1", sm: "2" }} width="full">
      <Select.Root
        collection={roleVariants}
        width="full"
        value={value}
        onValueChange={e => {
          setValue(e.value)
          onChange(e.value[0] || "")
        }}
        positioning={{ strategy: "fixed" }}
        size={{ base: "md", sm: "lg" }}
      >
        <Select.Label 
          fontSize={{ base: "sm", sm: "md" }}
          fontWeight={{ base: "medium", sm: "semibold" }}
        >
          {label}
        </Select.Label>
        <Select.Trigger 
          clearable
          height={{ base: "10", sm: "12" }}
          fontSize={{ base: "sm", sm: "md" }}
        >
          <Select.ValueText 
            placeholder={placeholder} 
            paddingLeft={{ base: "8px", sm: "12px" }}
            fontSize={{ base: "sm", sm: "md" }}
          />
        </Select.Trigger>
        <Select.Content 
          zIndex={10000}
          maxHeight={{ base: "200px", sm: "300px" }}
          borderRadius={{ base: "md", sm: "lg" }}
        >
          {roleVariants.items.map(role => (
            <Select.Item 
              item={role} 
              key={role.value} 
              padding={{ base: "2", sm: "3" }}
              fontSize={{ base: "sm", sm: "md" }}
              _hover={{
                backgroundColor: "gray.100",
                cursor: "pointer"
              }}
            >
              {role.label}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>

      {/* отображение ошибки, если есть */}
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
  )
}

// экспорт типа для использования в других компонентах
export type { RoleVariant }
