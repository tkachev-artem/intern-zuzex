'use client'

import { Button, Drawer } from '@saas-ui/react'
import { LuCirclePlus } from 'react-icons/lu'
import { PostForm } from './PostForm'

export const PostDrawer = () => {
  return (
    <Drawer.Root>
      <Drawer.Backdrop />
      <Drawer.Trigger asChild>
        <Button variant="subtle" size="lg" rounded="full">
          <LuCirclePlus size={20} />
        </Button>
      </Drawer.Trigger>
      <Drawer.Content zIndex={9999}>
        <Drawer.Header>
          <Drawer.Title>Создать новый пост</Drawer.Title>
          <Drawer.CloseButton />
        </Drawer.Header>
        <Drawer.Body>
          <PostForm />
        </Drawer.Body>
        <Drawer.CloseTrigger />
      </Drawer.Content>
    </Drawer.Root>
  )
} 