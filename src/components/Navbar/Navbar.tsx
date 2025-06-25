'use client'

import { Button } from '@chakra-ui/react'
import { Tabs, Dialog } from '@saas-ui/react'
import { Navbar } from '@saas-ui/react'
import './styles/Navbar.scss'
import '../Dialog/Dialog.scss'
import DropdownMenu from '../DropdownMenu/DropdownMenu'
import { LuRows3, LuCirclePlus } from "react-icons/lu"
import { PostForm } from '../PostForm/PostForm'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

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
          <Tabs.Root variant="plain" defaultValue="/"> {/* Лента и избранное */}
            <Tabs.List bg="bg.muted" rounded="l3" p="1" className="tabs-list"> 
              <Tabs.Trigger value="/" className="tab-trigger" asChild> 
                <Button variant="ghost" size="lg" rounded="full" aria-label="Лента" onClick={() => void navigate('/')}> {/* Лента */}
                  <LuRows3 size={20} />
                  Лента
                </Button>

              </Tabs.Trigger>
              <Tabs.Indicator rounded="l2" />
            </Tabs.List>
          </Tabs.Root>
        </Navbar.Item>

        <Navbar.Item className="right-menu">
          <Button 
            variant="subtle" 
            size="lg" 
            rounded="full" 
            aria-label="Создать новый пост"
            onClick={handleOpenPostModal}
          >
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