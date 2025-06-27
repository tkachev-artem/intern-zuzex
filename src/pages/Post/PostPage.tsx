'use client'

import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { HomeNavbar } from '@/components/Navbar/Navbar'
import PostCard from '@/components/PostCard/PostCard'
import { PostForm } from '@/components/PostForm/PostForm';

import {
  AppShell, 
  Page
} from '@saas-ui/react'
import { Dialog } from '@saas-ui/react';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { loadPosts, type Post } from '@/features/posts/postSlice';
import { Box } from '@chakra-ui/react';

// модальное окно для редактирования поста
type EditPostModalProps = {
  isOpen: boolean;
  onClose: () => void;
  editingPost: Post | null;
};
  

const EditPostModal = ({ isOpen, onClose, editingPost }: EditPostModalProps) => {

  if (!editingPost) return null;

  const handlePostUpdated = () => {
    onClose();
  };

  return (
    <Dialog.Root open={isOpen}>
      <Dialog.Backdrop />
      <Dialog.Content className="dialog-modal">
        <Dialog.Header className="dialog-header">
          <Dialog.Title className="dialog-title">
            Редактирование поста
          </Dialog.Title>
          <Dialog.CloseButton onClick={onClose} />
        </Dialog.Header>
        <Dialog.Body className="dialog-body">
          <PostForm 
            editingPost={editingPost}
            onPostUpdated={handlePostUpdated}
          />
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

const PostPage = () => {
    const posts = useAppSelector((state) => state.posts);
    const dispatch = useAppDispatch();
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const [editingPost, setEditingPost] = useState<Post | null>(null);

    useEffect(() => {
        dispatch(loadPosts());
    }, [dispatch]);

    const location = useLocation();
    const postId = location.pathname.split('/').pop(); // получаем id поста из url

    const post = posts.find((post) => post.id === String(postId)); // ищем пост по id
    
    if (!post) {
        return (
            <AppShell height="100vh" header={<HomeNavbar />}>
                <Page.Root>
                                         <Page.Body 
                         maxW="none" 
                         px={{ base: "4", md: "6", lg: "8" }}
                         py={{ base: "4", md: "6" }}
                         paddingBottom={{ base: "20", md: "6" }}
                         display="flex" 
                         justifyContent="center"
                         alignItems="center"
                         minHeight="50vh"
                     >
                        <Box 
                            textAlign="center" 
                            fontSize={{ base: "lg", md: "xl" }}
                            color="gray.600"
                        >
                            Пост не найден
                        </Box>
                    </Page.Body>
                </Page.Root>
            </AppShell>
        );
    }

    const handleEditPost = (post: Post) => {
        setEditingPost(post);
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setEditingPost(null);
    };

  return (
    <>
    <AppShell
        height="100vh"
        header={<HomeNavbar />}
      >
        <Page.Root>
            <Page.Body 
                maxW="none" 
                px={{ base: "4", md: "6", lg: "8" }}
                py={{ base: "4", md: "6" }}
                paddingBottom={{ base: "20", md: "6" }}
                display="flex" 
                justifyContent="center"
                bg="gray.50"
            >
                <Box
                    width="100%"
                    maxWidth={{ base: "100%", md: "800px", lg: "900px" }}
                >
                    <PostCard 
                        key={post.id} 
                        post={post} 
                        FullPostOpen={true}
                        onEditPost={handleEditPost}
                    />
                </Box>
            </Page.Body>
        </Page.Root>
    </AppShell>

    {/* модальное окно для редактирования поста */}
    <EditPostModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        editingPost={editingPost}
    />
    </>
  )
}

export default PostPage
