'use client'

//импорты для поля ввода
import { HStack } from '@chakra-ui/react'
import { Field, Input } from '@saas-ui/react'

//ипорты для ошибки (alert)

import { Stack } from '@chakra-ui/react'
import { Alert } from '@saas-ui/react'

type InputFieldProps = {
    label: string
    variant: 'outline' | 'subtle' | 'flushed' | undefined
    placeholder: string
    size: 'xs' | 'sm' | 'md' | 'lg'
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    error?: string | null
    status: 'error' | 'success' | 'warning' | 'info'
}


export const InputField = ({ label, variant, placeholder, size, error, status, onChange }: InputFieldProps) => {
    return (
        <HStack gap="10" width="full">
            <Stack gap="2" width="full">
                <Field.Root required>
                    <Field.Label>{label}</Field.Label>
                    <Input placeholder={placeholder} variant={variant} size={size} onChange={onChange} paddingLeft="12px" />
                </Field.Root>
                {error && ( //если есть ошибка, то показываем alert
                    <Stack gap={2} width="full">
                        <Alert status={status} title={error} padding="2" alignItems="center"></Alert>
                    </Stack>
                )}
                </Stack>
        </HStack>
    )
}
