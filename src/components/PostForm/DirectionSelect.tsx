'use client'

import { useState, useEffect } from "react"
import { Stack } from "@chakra-ui/react"
import { Select } from "@saas-ui/react"
import { directions } from './collections/directions' // направления

type DirectionSelectProps = {
  label: string
  placeholder: string
  value?: string // пропс value для контроля состояния извне
  onChange: (value: string) => void
}

export const DirectionSelect = ({
  label,
  placeholder,
  value: externalValue,
  onChange,
}: DirectionSelectProps) => {
  const [value, setValue] = useState<string[]>([])

  // синхронизируем внутреннее состояние с внешним значением
  useEffect(() => {
    if (externalValue) {
      setValue([externalValue])
    } else {
      setValue([])
    }
  }, [externalValue])

  return (
    <Stack gap={2} width="full">
      <Select.Root
        collection={directions} 
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
          {directions.items.map((direction) => (
            <Select.Item item={direction} key={direction.value} padding="2">
              {direction.label}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>
    </Stack>
  )
} 