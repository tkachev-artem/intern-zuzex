import { createListCollection } from "@chakra-ui/react"

// коллекция всех ролей для селектора
export const roleVariants = createListCollection({
  items: [
    { label: "Frontend Developer", value: "Frontend Developer" },
    { label: "Backend Developer", value: "Backend Developer" },
    { label: "QA Engineer", value: "QA Engineer" },
    { label: "Designer", value: "Designer" },
    { label: "Manager", value: "Manager" },
    { label: "HR", value: "HR" },
  ],
})

// тип для роли пользователя
export type RoleVariant =
  | "Frontend Developer"
  | "Backend Developer"
  | "QA Engineer"
  | "Designer"
  | "Manager"
  | "HR"
