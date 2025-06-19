import type { FC } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { useEffect } from 'react';

import './Post.scss';

import { PostCard } from '../PostCard/PostCard';
import { Flex } from '@chakra-ui/react';
import { loadPosts } from '@/features/posts/postSlice';

// компонент для отображения всех постов
const Post: FC = () => {
  // получаем все посты из redux store
  const posts = useAppSelector((state) => state.posts);
  const dispatch = useAppDispatch();

  // при загрузке компонента загружаем посты из localStorage
  useEffect(() => {
    dispatch(loadPosts());
  }, [dispatch]);

  return (
    <div className="post">
      {/* <button onClick={() => dispatch(loadPosts())}>Restore Post</button> (загрузка постов из локального хранилища по кнопке) */}
      <Flex wrap="wrap" gap="4" justify="flex-start">
        {/* рендерим карточки для каждого поста */}
        {posts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </Flex>

      {/* блок для отладки — показывает все посты в виде json */}
      <div className="post__debug">
        <h4 className="post__debug-title">Redux Store:</h4>
        <pre className="post__debug-content">
          {JSON.stringify(posts, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default Post; 