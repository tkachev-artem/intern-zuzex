'use client'

import { useState } from 'react'
import { Stack } from '@chakra-ui/react'
import { Select, Alert } from '@saas-ui/react'
import { roleVariants, type RoleVariant } from './useRole'

// Пропсы компонента
type RoleSelectProps = {
    label: string
    placeholder: string
    onChange: (value: string) => void
    error?: string | null
    status?: 'error' | 'success' | 'warning' | 'info'
    error_title?: string
}

// Компонент
export const RoleSelect = ({ label, placeholder, onChange, error, status = 'error'}: RoleSelectProps) => {
    const [value, setValue] = useState<string[]>([])
    
    return (
        <Stack gap={2} width="full">
            <Select.Root
                collection={roleVariants}
                width="full"
                value={value}
                onValueChange={(e) => {
                    setValue(e.value)
                    onChange(e.value[0] || '')
                }}
            >
                <Select.Label>{label}</Select.Label>
                <Select.Trigger>
                    <Select.ValueText placeholder={placeholder} paddingLeft="12px" />
                </Select.Trigger>
                <Select.Content>
                    {roleVariants.items.map((role) => (
                        <Select.Item item={role} key={role.value} padding="2">
                            {role.label}
                        </Select.Item>
                    ))}
                </Select.Content>
            </Select.Root>
            
            {error && (
                <Stack gap={2} width="full">
                    <Alert status={status} title={error} padding="2" alignItems="center"></Alert>
                </Stack>
            )}
        </Stack>
    )
}

// Экспорт типа для использования в других компонентах
export type { RoleVariant }