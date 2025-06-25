'use client'

import { HomeNavbar } from '@/components/Navbar/Navbar'
//import "./styles/Home.scss"
import Post from '@/components/Post/Post'

import {
  AppShell, 
  Page
} from '@saas-ui/react'

const Home = () => {
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
