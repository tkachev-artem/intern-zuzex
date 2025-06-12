import { createListCollection } from '@chakra-ui/react'

// Константа с данными ролей
export const roleVariants = createListCollection({
  items: [
    { label: 'Frontend Developer', value: 'frontend-developer' },
    { label: 'Backend Developer', value: 'backend-developer' },
    { label: 'QA Engineer', value: 'qa-engineer' },
    { label: 'Designer', value: 'designer' },
    { label: 'Manager', value: 'manager' },
    { label: 'HR', value: 'hr' },
  ],
})

// Тип для роли
export type RoleVariant = 'frontend-developer' | 'backend-developer' | 'qa-engineer' | 'designer' | 'manager' | 'hr' 