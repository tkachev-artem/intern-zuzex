import type { RoleType } from "@/components/RoleSelector/Role"

export type RegistrationForm = { //форма регистрации
    name: string
    lastname: string
    nickname: string
    email: string
    password: string
    confirmPassword: string
    role: RoleType | "" //тип роли или пустая строка (иначе будет ошибка начального состояния)
}