'use client'

import { useAppSelector } from '@/app/hooks';
import { HomeNavbar } from '@/components/Navbar/Navbar'
import PostCard from '@/components/PostCard/PostCard'

import {
  AppShell, 
  Page
} from '@saas-ui/react'
import { useParams } from 'react-router-dom';

const PostPage = () => {

    const posts = useAppSelector((state) => state.posts);
    const { id } = useParams();

    const post = posts.find((post) => post.id === id);

    if (!post) {
        return <div>Пост не найден</div>
    }

  return (
    <AppShell
        height="100vh"
        header={<HomeNavbar />}
      >
        <Page.Root>
            <Page.Body maxW="none" px="0" display="flex" justifyContent="center" alignItems="center" paddingTop="24px" paddingBottom="24px">
                <PostCard 
                    key={post.id} 
                    post={post} 
                    FullPostOpen={true}
                    //onEditPost={onEditPost}
                />
            </Page.Body>
        </Page.Root>
    </AppShell>

  )
}


export default PostPage
