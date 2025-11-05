import { useState } from 'react';
import api from '../../api';
import './postCard.scss';
export const PostCard = ({ post, onLikeToggle }) => {
  const [isLiking, setIsLiking] = useState(false);
  const handleLike = async () => {
    try {
      setIsLiking(true);
      const response = await api.post(`/posts/${post.id}/like`);
      onLikeToggle(post.id, response.data);
    } catch (err) {
      console.error('Ошибка при лайке :', err);
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <article className='post-card'>
      <div className='post-card__header'>
        <img
          src={post.user.avatarUrl || '/default-avatar.png'}
          alt='userAvatar'
          className='post-card__avatar'
        />
        <div className='post-card__info'>
          <h4 className='post-card__author'>{post.author?.name || 'Аноним'}</h4>
          <p className='post-card__date'>
            {new Date(post.createdAt).toLocaleDateString('ru-RU', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
      </div>

      {post.text && <p className='post-card__text'>{post.text}</p>}
      {post.imageUrl && (
        <div className='post-card__image-wrapper'>
          <img src={post.imageUrl} alt='post' className='post-card__image' />
        </div>
      )}

      <div className='post-card__actions'>
        <button
          className={`post-card__like-button ${post.isLiked ? 'liked' : ''}`}
          onClick={handleLike}
          disabled={isLiking}
        >
          {post.isLiked ? '❤️' : '🤍'} {post.likesCount}
        </button>
        <button className='post-card__comment-button'>
          💬 {post.commentsCount}
        </button>
      </div>
    </article>
  );
};
