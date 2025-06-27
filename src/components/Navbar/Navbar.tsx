'use client'

import { Button } from '@chakra-ui/react'
import { Dialog } from '@saas-ui/react'
import { Navbar } from '@saas-ui/react'
import './styles/Navbar.scss'
import '../Dialog/Dialog.scss'
import DropdownMenu from '../DropdownMenu/DropdownMenu'
import { LuCirclePlus } from "react-icons/lu"
import { PostForm } from '../PostForm/PostForm'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaReact } from "react-icons/fa"
import { SiRedux } from "react-icons/si"

export const HomeNavbar = () => {
  const navigate = useNavigate();
  const [isPostModalOpen, setModalOpen] = useState(false);

  const handleOpenPostModal = () => { // открываем модальное окно для создания поста
    setModalOpen(true);
  };

  const handleClosePostModal = () => { // закрываем модальное окно для создания поста
    setModalOpen(false);
  };

  return (
    <Navbar.Root className="navbar-root">
      <Navbar.Content className="navbar-content">
        <Navbar.Item className="navbar-tabs">
          <Button variant="ghost" size="lg" aria-label="Главная" onClick={() => void navigate('/')}> {/* Лента */}
              <FaReact size={24}/>
              <SiRedux size={24}/>
              ИТ ЛЕНТА 
            </Button>
        </Navbar.Item>

        <Navbar.Item className="right-menu">
          <Button 
            variant="subtle" 
            size="lg" 
            rounded="full" 
            aria-label="Создать новый пост"
            onClick={handleOpenPostModal}
            paddingInline="20px"

          >
            Создать пост
            <LuCirclePlus size={20} />
          </Button>
          <DropdownMenu />
        </Navbar.Item>

      </Navbar.Content>

      <Dialog.Root open={isPostModalOpen}>
        <Dialog.Backdrop />
        <Dialog.Content className="dialog-modal">
          <Dialog.Header className="dialog-header">
            <Dialog.Title className="dialog-title">
              Создать новый пост
            </Dialog.Title>
            <Dialog.CloseButton onClick={handleClosePostModal} />
          </Dialog.Header>
          <Dialog.Body className="dialog-body">
            <PostForm onPostUpdated={handleClosePostModal} />
          </Dialog.Body>
        </Dialog.Content>
      </Dialog.Root>
    </Navbar.Root>
  )
}

export default HomeNavbar