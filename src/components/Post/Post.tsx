import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { useEffect, useState } from 'react';

import './Post.scss';

import { PostCard } from '../PostCard/PostCard';
import { PostForm } from '../PostForm/PostForm';
import { Flex, Button, Stack } from '@chakra-ui/react';
import { loadPosts, type Post } from '@/features/posts/postSlice';
import { FilterBar } from '../FilterBar';
import type { DirectionState } from '../FilterBar';

import { directions } from '../PostForm/collections/directions'; // направления

// компонент модального окна для редактирования поста
type EditPostModalProps = {
  isOpen: boolean;
  onClose: () => void;
  editingPost: Post | null;
}

const EditPostModal = ({ isOpen, onClose, editingPost }: EditPostModalProps) => {
  if (!isOpen || !editingPost) return null;

  // обработчик успешного обновления поста
  const handlePostUpdated = () => {
    onClose(); // закрываем модальное окно после обновления
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => { e.stopPropagation(); }}>
        <Stack gap={4} p={6}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', margin: 0 }}>
              Редактирование поста
            </h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ✕
            </Button>
          </div>
          
          {/* форма редактирования поста */}
          <PostForm 
            editingPost={editingPost}
            onPostUpdated={handlePostUpdated}
          />
        </Stack>
      </div>
    </div>
  );
};

// компонент для отображения всех постов
const Post = () => {

  // состояние для фильтрации постов
  const [direction, setDirection] = useState<DirectionState>({
    frontend: false,
    backend: false,
    qa: false,
    design: false,
    management: false,
    marketing: false,
  });

  // состояние для модального окна редактирования
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  // получаем все посты из redux store
  const posts = useAppSelector((state) => state.posts);
  const dispatch = useAppDispatch();

  // при загрузке компонента загружаем посты из localStorage
  useEffect(() => {
    dispatch(loadPosts());
  }, [dispatch]);

  // обработчик редактирования поста
  const handleEditPost = (post: Post) => {
    setEditingPost(post);
    setIsEditModalOpen(true);
  };

  // обработчик закрытия модального окна редактирования
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingPost(null);
  };

  //функция для фильтрации постов, direction - название направления, posts - массив постов
  const getFilterByDirection = (posts: Post[], direction: DirectionState) => {   
    // соответствие названий направлений и их значений в direction
    const directionRatio = { //соответствие названий направлений и их значений
      frontend: directions.items[0].value, //Фронтенд
      backend: directions.items[1].value, //Бэкенд
      qa: directions.items[2].value, //Тестирование
      design: directions.items[3].value, //Дизайн
      management: directions.items[4].value, //Менеджмент
      marketing: directions.items[5].value //Маркетинг
    };

    const activeDirections = Object.keys(direction)
      .filter(key => direction[key as keyof DirectionState])
      .map(key => directionRatio[key as keyof typeof directionRatio]);

    if (activeDirections.length === 0) {
        return posts;
    }

    return posts.filter(post => activeDirections.includes(post.direction));
  }

  const filteredPosts = getFilterByDirection(posts, direction);

  return (
    <div className="post">
      {/* <button onClick={() => dispatch(loadPosts())}>Restore Post</button> (загрузка постов из локального хранилища по кнопке) */}
      <FilterBar direction={direction} setDirection={setDirection} />
      
      <Flex direction="column" gap="4" justify="center" align="center">
        {/* рендерим карточки для каждого поста */}
        {filteredPosts.map(post => (
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