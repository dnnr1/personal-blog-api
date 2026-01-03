import postService from '../../src/core/services/post';
import postRepository from '../../src/core/repositories/post';
import { AppError } from '../../src/core/utils/AppError';

jest.mock('../../src/core/repositories/post');

const mockedPostRepository = postRepository as jest.Mocked<
  typeof postRepository
>;

describe('PostService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a post successfully', async () => {
      const input = {
        title: 'Test Post',
        content: 'Test content',
        user_id: '550e8400-e29b-41d4-a716-446655440000',
        pictureUrl: 'https://example.com/image.jpg',
      };

      const createdPost = {
        id: '660e8400-e29b-41d4-a716-446655440001',
        ...input,
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockedPostRepository.create.mockResolvedValue(createdPost);

      const result = await postService.create(input);

      expect(mockedPostRepository.create).toHaveBeenCalledWith(input);
      expect(result).toEqual(createdPost);
    });
  });

  describe('list', () => {
    it('should return all posts', async () => {
      const posts = [
        {
          id: '550e8400-e29b-41d4-a716-446655440000',
          title: 'Post 1',
          content: 'Content 1',
          user_id: '660e8400-e29b-41d4-a716-446655440001',
          author: 'user1',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440001',
          title: 'Post 2',
          content: 'Content 2',
          user_id: '660e8400-e29b-41d4-a716-446655440002',
          author: 'user2',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ];

      mockedPostRepository.list.mockResolvedValue(posts);

      const result = await postService.list();

      expect(mockedPostRepository.list).toHaveBeenCalled();
      expect(result).toEqual(posts);
    });
  });

  describe('get', () => {
    const validId = '550e8400-e29b-41d4-a716-446655440000';

    it('should return a post when valid id is provided', async () => {
      const post = {
        id: validId,
        title: 'Test Post',
        content: 'Test content',
        user_id: '660e8400-e29b-41d4-a716-446655440001',
        author: 'testuser',
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockedPostRepository.get.mockResolvedValue(post);

      const result = await postService.get(validId);

      expect(mockedPostRepository.get).toHaveBeenCalledWith(validId);
      expect(result).toEqual(post);
    });

    it('should throw AppError when id is not a valid UUID', async () => {
      await expect(postService.get('invalid-id')).rejects.toThrow(AppError);
      await expect(postService.get('invalid-id')).rejects.toThrow(
        'Post not found',
      );
    });

    it('should throw AppError when post is not found', async () => {
      mockedPostRepository.get.mockResolvedValue(null);

      await expect(postService.get(validId)).rejects.toThrow(AppError);
      await expect(postService.get(validId)).rejects.toThrow('Post not found');
    });
  });

  describe('update', () => {
    const validId = '550e8400-e29b-41d4-a716-446655440000';
    const userId = '660e8400-e29b-41d4-a716-446655440001';

    it('should update a post successfully', async () => {
      const input = {
        id: validId,
        user_id: userId,
        title: 'Updated Title',
        content: 'Updated content',
      };

      const updatedPost = {
        ...input,
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockedPostRepository.update.mockResolvedValue(updatedPost);

      const result = await postService.update(input);

      expect(mockedPostRepository.update).toHaveBeenCalledWith(input);
      expect(result).toEqual(updatedPost);
    });

    it('should throw AppError when id is not a valid UUID', async () => {
      const input = {
        id: 'invalid-id',
        user_id: userId,
        title: 'Updated Title',
        content: 'Updated content',
      };

      await expect(postService.update(input)).rejects.toThrow(AppError);
      await expect(postService.update(input)).rejects.toThrow('Post not found');
    });

    it('should throw AppError when post is not found', async () => {
      const input = {
        id: validId,
        user_id: userId,
        title: 'Updated Title',
        content: 'Updated content',
      };

      mockedPostRepository.update.mockResolvedValue(null as any);

      await expect(postService.update(input)).rejects.toThrow(AppError);
      await expect(postService.update(input)).rejects.toThrow('Post not found');
    });
  });

  describe('remove', () => {
    const validId = '550e8400-e29b-41d4-a716-446655440000';
    const userId = '660e8400-e29b-41d4-a716-446655440001';

    it('should delete a post successfully', async () => {
      const input = { id: validId, user_id: userId };
      const deletedPost = {
        id: validId,
        title: 'Deleted Post',
        content: 'Content',
        user_id: userId,
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockedPostRepository.remove.mockResolvedValue(deletedPost);

      const result = await postService.remove(input);

      expect(mockedPostRepository.remove).toHaveBeenCalledWith(validId, userId);
      expect(result).toEqual(deletedPost);
    });

    it('should throw AppError when id is not a valid UUID', async () => {
      const input = { id: 'invalid-id', user_id: userId };

      await expect(postService.remove(input)).rejects.toThrow(AppError);
      await expect(postService.remove(input)).rejects.toThrow('Post not found');
    });

    it('should throw AppError when post is not found', async () => {
      const input = { id: validId, user_id: userId };

      mockedPostRepository.remove.mockResolvedValue(null as any);

      await expect(postService.remove(input)).rejects.toThrow(AppError);
      await expect(postService.remove(input)).rejects.toThrow('Post not found');
    });
  });
});
