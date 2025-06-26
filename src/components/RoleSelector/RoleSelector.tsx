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
    console.log('RoleSelector - initialValue:', initialValue)
    if (initialValue) {
      setValue([initialValue])
    } else {
      setValue([])
    }
  }, [initialValue])

  return (
    <Stack gap={2} width="full">
      <Select.Root
        collection={roleVariants}
        width="full"
        value={value}
        onValueChange={e => {
          setValue(e.value)
          onChange(e.value[0] || "")
        }}
        positioning={{ strategy: "fixed" }}
      >
        <Select.Label>{label}</Select.Label>
        <Select.Trigger clearable>
          <Select.ValueText placeholder={placeholder} paddingLeft="12px" />
        </Select.Trigger>
        <Select.Content zIndex={10000}>
          {roleVariants.items.map(role => (
            <Select.Item item={role} key={role.value} padding="2">
              {role.label}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>

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
  )
}

// экспорт типа для использования в других компонентах
export type { RoleVariant }
