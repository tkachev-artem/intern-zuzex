'use client'

import { HomeNavbar } from '@/components/Navbar/Navbar'
import Post from '@/components/Post/Post'
import { AppShell, Page } from '@saas-ui/react'

import { PostsSet } from '@/LocalAPI/setdata/postsetLocalAPI' // набор постов для тестирования

const Home = () => {
  PostsSet();
  return (
    <AppShell
        height="100vh"
        header={<HomeNavbar />}
      >
        <Page.Root>
            <Page.Body maxW="none" px="0" paddingInline="24px">
                <Post />
            </Page.Body>
        </Page.Root>
    </AppShell>

  )
}


export default Home
