'use client'

import { useAppSelector } from '@/app/hooks';
import { HomeNavbar } from '@/components/Navbar/Navbar'
import PostCard from '@/components/PostCard/PostCard'
import { PostForm } from '@/components/PostForm/PostForm';

import {
  AppShell, 
  Page
} from '@saas-ui/react'
import { Dialog } from '@saas-ui/react';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import type { Post } from '@/features/posts/postSlice';

// Модальное окно для редактирования поста
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
    const { id } = useParams();
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const [editingPost, setEditingPost] = useState<Post | null>(null);

    const post = posts.find((post) => post.id === id);

    if (!post) {
        return <div>Пост не найден</div>
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
            <Page.Body maxW="none" px="0" display="flex" justifyContent="center" paddingTop="24px" paddingBottom="24px" paddingLeft="24px" paddingRight="24px">
                <PostCard 
                    key={post.id} 
                    post={post} 
                    FullPostOpen={true}
                    onEditPost={handleEditPost}
                />
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
