'use client'

import { useState } from "react"
import { Stack } from "@chakra-ui/react"
import { Select } from "@saas-ui/react"
import { createListCollection } from '@chakra-ui/react'

const directions = createListCollection({
  items: [
    { label: 'Frontend', value: 'Фронтенд' },
    { label: 'Backend', value: 'Бекенд' },
    { label: 'QA', value: 'Тестирование' },
    { label: 'Design', value: 'Дизайн' },
    { label: 'Management', value: 'Менеджмент' },
    { label: 'Marketing', value: 'Маркетинг' },
  ],
})

type DirectionSelectProps = {
  label: string
  placeholder: string
  onChange: (value: string) => void
}

export const DirectionSelect = ({
  label,
  placeholder,
  onChange,
}: DirectionSelectProps) => {
  const [value, setValue] = useState<string[]>([])

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