import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { useEffect, useState } from 'react';

import './Post.scss';
import '../Dialog/Dialog.scss';

import { PostCard } from '../PostCard/PostCard';
import { PostForm } from '../PostForm/PostForm';
import { Flex, useBreakpointValue } from '@chakra-ui/react';
import { Dialog } from '@saas-ui/react';
import { loadPosts, type Post } from '@/features/posts/postSlice';
import { FilterBar } from '../FilterBar';
import type { DirectionState } from '../FilterBar';

import { directions } from '../PostForm/collections/directions' // направления

// соответствие названий направлений и их значений
const directionValueMap: Record<keyof DirectionState, string> = {
  frontend: directions.items[0].value,
  backend: directions.items[1].value,
  qa: directions.items[2].value,
  design: directions.items[3].value,
  management: directions.items[4].value,
  marketing: directions.items[5].value,
};

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

// фильтрация постов по направлениям
const getFilteredPosts = (
  posts: Post[],
  direction: DirectionState
): Post[] => {
  const activeDirections = Object.keys(direction)
    .filter((key) => direction[key as keyof DirectionState])
    .map((key) => directionValueMap[key as keyof DirectionState]);

  if (activeDirections.length === 0) return posts;

  return posts.filter((post) => activeDirections.includes(post.direction));
};

const Post = () => {
  const [direction, setDirection] = useState<DirectionState>({
    frontend: false,
    backend: false,
    qa: false,
    design: false,
    management: false,
    marketing: false,
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  const posts = useAppSelector((state) => state.posts);
  const dispatch = useAppDispatch();

  // определяем размер экрана для адаптивности
  const isMobile = useBreakpointValue({ base: true, lg: false });

  useEffect(() => {
    dispatch(loadPosts());
  }, [dispatch]);

  const handleEditPost = (post: Post) => {
    setEditingPost(post);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingPost(null);
  };

  const filteredPosts = getFilteredPosts(posts, direction);

  return (
    <div className="post">
      {/* <button onClick={() => dispatch(loadPosts())}>Restore Post</button> (загрузка постов из локального хранилища по кнопке) */}

      {/* FilterBar для десктопа (фиксированный слева) */}
      {!isMobile && (
        <div className="filter-bar-container">
          <FilterBar direction={direction} setDirection={setDirection} />
        </div>
      )}
      
      <Flex 
        direction="column" 
        gap="4" 
        justify="center" 
        align="center" 
        paddingLeft={{ base: "0", lg: "144px" }}
      >
        {/* FilterBar для мобильных устройств (над постами) */}
        {isMobile && (
          <Flex width="100%" justify="center" marginBottom="4">
            <FilterBar direction={direction} setDirection={setDirection} />
          </Flex>
        )}

        {/* рендерим карточки для каждого поста и фильтруем по id от нового к старому */}
        {[...filteredPosts]
          .sort((a, b) => Number(b.id) - Number(a.id))
          .map(post => (
            <PostCard 
              key={post.id} 
              post={post} 
              onEditPost={handleEditPost}
            />
          ))}
      </Flex>

      {/* модальное окно для редактирования поста */}
      <EditPostModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        editingPost={editingPost}
      />

      {/* блок для отладки — показывает все посты в виде json */}
      {/* <div className="post__debug">
        <h4 className="post__debug-title">Redux Store:</h4>
        <pre className="post__debug-content">
          {JSON.stringify(posts, null, 2)}
        </pre>
      </div> */}
    </div>
  );
};

export default Post; 