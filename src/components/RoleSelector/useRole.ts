import { createListCollection } from "@chakra-ui/react"

// коллекция всех ролей для селектора
export const roleVariants = createListCollection({
  items: [
    { label: "Frontend Developer", value: "frontend-developer" },
    { label: "Backend Developer", value: "backend-developer" },
    { label: "QA Engineer", value: "qa-engineer" },
    { label: "Designer", value: "designer" },
    { label: "Manager", value: "manager" },
    { label: "HR", value: "hr" },
  ],
})

// тип для роли пользователя
export type RoleVariant =
  | "frontend-developer"
  | "backend-developer"
  | "qa-engineer"
  | "designer"
  | "manager"
  | "hr"
