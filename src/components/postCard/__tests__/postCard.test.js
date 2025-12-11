import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import api from '../../../api/api';
import { PostCard } from '../postCard';

jest.mock('../../../api/api');
jest.mock('../../comments/CommentSection', () => ({
  CommentSection: () => <div>Mocked Comments</div>
}));

describe('PostCard Component', () => {
  const mockPost = {
    id: 1,
    userId: 10,
    content: 'Hello World',
    imageUrl: 'http://example.com/img.jpg',
    createdAt: new Date().toISOString(),
    likesCount: 3,
    isLiked: false,
    commentsCount: 2
  };

  const mockAuthor = {
    firstName: 'John',
    lastName: 'Doe',
    avatarUrl: '/some-avatar.jpg'
  };

  const onLikeToggle = jest.fn();
  const currentUser = { avatarUrl: '/me.jpg' };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('loads author and displays name', async () => {
    api.get.mockResolvedValueOnce({ data: mockAuthor });

    render(
      <PostCard
        post={mockPost}
        onLikeToggle={onLikeToggle}
        currentUser={currentUser}
      />
    );

    expect(api.get).toHaveBeenCalledWith('/users/10');

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });

  test('renders post content and image', () => {
    render(
      <PostCard
        post={mockPost}
        onLikeToggle={onLikeToggle}
        currentUser={currentUser}
      />
    );

    expect(screen.getByText('Hello World')).toBeInTheDocument();

    const img = screen.getByAltText('post');
    expect(img).toHaveAttribute('src', mockPost.imageUrl);
  });

  test('like button calls API and onLikeToggle', async () => {
    api.get.mockResolvedValueOnce({ data: mockAuthor });

    api.post.mockResolvedValueOnce({
      data: { likesCount: 4, isLiked: true }
    });

    render(
      <PostCard
        post={mockPost}
        onLikeToggle={onLikeToggle}
        currentUser={currentUser}
      />
    );

    const likeBtn = screen.getByRole('button', { name: /3/ });

    fireEvent.click(likeBtn);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/posts/1/like');
      expect(onLikeToggle).toHaveBeenCalledWith(1, {
        ...mockPost,
        likesCount: 4,
        isLiked: true
      });
    });
  });

  test('shows CommentSection when comment button clicked', async () => {
    api.get.mockResolvedValueOnce({ data: mockAuthor });

    render(
      <PostCard
        post={mockPost}
        onLikeToggle={onLikeToggle}
        currentUser={currentUser}
      />
    );

    const commentBtn = screen.getByRole('button', { name: /💬 2/ });

    fireEvent.click(commentBtn);

    expect(screen.getByText('Mocked Comments')).toBeInTheDocument();
  });
});
