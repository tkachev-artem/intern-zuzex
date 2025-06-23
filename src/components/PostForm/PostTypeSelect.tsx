'use client'

import { useState, useEffect } from "react"
import { Stack } from "@chakra-ui/react"
import { Select } from "@saas-ui/react"
import { createListCollection } from '@chakra-ui/react'

const postTypes = createListCollection({ //доступные типы постов (из справочника, пока доступен только "контент")
  items: [
    { label: 'Контент', value: 'Контент' },
  ],
})

type PostTypeSelectProps = {
  label: string
  placeholder: string
  value?: string // добавляем пропс value для контроля состояния извне
  onChange: (value: string) => void
}

export const PostTypeSelect = ({
  label,
  placeholder,
  value: externalValue,
  onChange,
}: PostTypeSelectProps) => {

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
        collection={postTypes}
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
        <Select.Content zIndex={10000}> {/* zIndex для того чтобы был над другими элементами, иначе не отображается */}  
          {postTypes.items.map((type) => (
            <Select.Item item={type} key={type.value} padding="2">
              {type.label}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>
    </Stack>
  )
} 