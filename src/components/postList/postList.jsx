import { useEffect, useState } from 'react';
import api from '../../api';
import { AddPost } from '../addPost/addPost';
import { PostCard } from '../postCard/postCard';
import './postList.scss';

export const PostList = ({ currentUser }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetchPosts = async () => {
    try {
      const response = await api.get('/posts');
      const sorted = response.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setPosts(sorted);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchPosts();
  }, []);
  const handlePostAdded = newPost => {
    setPosts(prevPosts => [newPost, ...prevPosts]);
  };
  const handleLikeToggle = (postId, updatedPost) => {
    setPosts(prevPosts =>
      prevPosts.map(post => (post.id === postId ? updatedPost : post))
    );
  };
  return (
    <section className='post-list'>
      <AddPost onPostAdded={handlePostAdded} currentUser={currentUser} />
      {loading ? (
        <p>Загрузка постов...</p>
      ) : posts.length > 0 ? (
        posts.map(post => (
          <PostCard key={post.id} post={post} onLikeToggle={handleLikeToggle} />
        ))
      ) : (
        <p>Постов нет. Будьте первым, кто опубликует!</p>
      )}
    </section>
  );
};
