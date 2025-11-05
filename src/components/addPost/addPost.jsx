import { useState } from 'react';
import { FaCamera, FaImage, FaSmile } from 'react-icons/fa';
import api from '../../api';
import './addPost.scss';

export const AddPost = ({ onPostAdded, currentUser }) => {
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [prewiew, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = e => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };
  const clearImage = () => {
    setImage(null);
    setPreview(null);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!text.trim() && !image) return;

    const formData = new FormData();
    if (image) formData.append('image', image);

    try {
      setLoading(true);
      const response = await api.post('/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      if (onPostAdded) onPostAdded(response.data);
      clearImage();
      setText('');
    } catch (error) {
      console.error('Error adding post:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className='add-post' onSubmit={handleSubmit}>
      <div className='add-post__top'>
        <div className='add-post__avatar'>
          {currentUser?.avatarUrl || currentUser?.avatar ? (
            <img
              src={currentUser?.avatarUrl || currentUser?.avatar}
              alt='avatar'
            />
          ) : (
            <div className='avatar-placeholder'>
              {currentUser?.firstName?.[0] || 'U'}
            </div>
          )}
        </div>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder='Что у вас нового?'
          className='add-post__textarea'
          rows={3}
        />
      </div>

      {prewiew && (
        <div className='add-post__preview'>
          <img src={prewiew} alt='preview' />
          <button
            type='button'
            className='add-post__remove'
            onClick={clearImage}
          >
            ✕
          </button>
        </div>
      )}

      <div className='add-post__actions'>
        <div className='add-post__options'>
          <label className='add-post__option'>
            <FaImage className='option-icon' />
            <span>Фото</span>
            <input type='file' accept='image/*' onChange={handleImageChange} />
            <FaCamera className='option-icon' />
            <FaSmile className='option-icon' />
          </label>
        </div>
        <button type='submit' className='add-post__submit' disabled={loading}>
          {loading ? 'Публикуется...' : 'Опубликовать'}
        </button>
      </div>
    </form>
  );
};
