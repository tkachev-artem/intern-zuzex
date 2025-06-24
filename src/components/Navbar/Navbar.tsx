'use client'

import { Link, Button } from '@chakra-ui/react'
import { Tabs, Dialog } from '@saas-ui/react'
import { Navbar } from '@saas-ui/react'
import './styles/Navbar.scss'
import '../Dialog/Dialog.scss'
import DropdownMenu from '../DropdownMenu/DropdownMenu'
import { LuFileHeart, LuRows3, LuCirclePlus } from "react-icons/lu"
import { PostForm } from '../PostForm/PostForm'
import { useState } from 'react'

export const HomeNavbar = () => {
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
          <Tabs.Root defaultValue="feed" variant="plain"> {/* Лента и избранное */}
            <Tabs.List bg="bg.muted" rounded="l3" p="1" className="tabs-list"> 
              <Tabs.Trigger value="feed" className="tab-trigger" asChild> 
                <Link unstyled href="#feed"> {/* Лента */}
                  <LuRows3 size={20} />
                  Лента
                </Link>
              </Tabs.Trigger>
              <Tabs.Trigger value="favorites" className="tab-trigger" asChild> 
                <Link unstyled href="#favorites"> {/* Избранное */}
                  <LuFileHeart size={20} />
                  Избранное
                </Link>
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