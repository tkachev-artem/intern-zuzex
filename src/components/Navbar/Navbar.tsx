'use client'

import { Link } from '@chakra-ui/react'
import { Tabs } from '@saas-ui/react'
import { Navbar } from '@saas-ui/react'
import './styles/Navbar.scss'
import DropdownMenu from '../DropdownMenu/DropdownMenu'
import { LuFileHeart } from "react-icons/lu";
import { LuRows3 } from "react-icons/lu";
import { PostDrawer } from '../PostForm/PostDrawer'

export const HomeNavbar = () => {
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
          <PostDrawer />
          <DropdownMenu />
        </Navbar.Item>

      </Navbar.Content>
    </Navbar.Root>
  )
}

export default HomeNavbar