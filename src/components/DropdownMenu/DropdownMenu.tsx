'use client'

import { Avatar, IconButton, Menu } from '@saas-ui/react'

import './styles/DropdownMenu.scss'

import { useAppSelector } from '@/app/hooks'
import { logout, selectUserNickname } from '@/features/auth/authSlice'
import { useAppDispatch } from '@/app/hooks'
import { useNavigate } from 'react-router-dom'

export const DropdownMenu = () => {
  const dispatch = useAppDispatch()
  const userNickname = useAppSelector(selectUserNickname)
  const navigate = useNavigate()

  const handleMenu = (details: { value: string }) => {
    switch (details.value) {
      case 'profile':
        void navigate('/profile')
        break
      case 'settings':
        void navigate('/settings')
        break
      case 'logout':
        dispatch(logout())

        void navigate('/auth')
        break
    }
  }

  return (
    <Menu.Root onSelect={handleMenu}>
      <Menu.Trigger asChild>
        <IconButton variant="ghost" size="md" aria-label="User menu">
          <Avatar size="md" name={userNickname} />
        </IconButton>
      </Menu.Trigger>
      <Menu.Content className="dropdown-menu-content">
        <Menu.Item value="profile" className='text'>Профиль</Menu.Item>
        <Menu.Item value="logout" className='logout-text'>Выйти</Menu.Item>
      </Menu.Content>
    </Menu.Root>
  )
}

export default DropdownMenu