import { Request, Response } from 'express';
import * as postController from '../../src/core/controllers/post';
import postService from '../../src/core/services/post';
import { code } from '../../src/core/utils/constants';

jest.mock('../../src/core/services/post');

const mockedPostService = postService as jest.Mocked<typeof postService>;

describe('Post controller', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  beforeEach(() => {
    mockReq = {
      body: {},
      params: {},
      user: {
        id: '550e8400-e29b-41d4-a716-446655440000',
        username: 'testuser',
        email: 'test@example.com',
      },
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a post and return 201', async () => {
      const postData = {
        title: 'Test Post',
        content: 'Test content',
        pictureUrl: 'https://example.com/image.jpg',
      };

      const createdPost = {
        id: '660e8400-e29b-41d4-a716-446655440001',
        ...postData,
        user_id: mockReq.user!.id,
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockReq.body = postData;
      mockedPostService.create.mockResolvedValue(createdPost);

      await postController.create(mockReq as Request, mockRes as Response);

      expect(mockedPostService.create).toHaveBeenCalledWith({
        title: postData.title,
        content: postData.content,
        user_id: mockReq.user!.id,
        pictureUrl: postData.pictureUrl,
      });
      expect(mockRes.status).toHaveBeenCalledWith(code.CREATED);
      expect(mockRes.json).toHaveBeenCalledWith({
        ok: true,
        status: code.CREATED,
        message: 'Post created successfully',
        data: createdPost,
      });
    });
  });

  describe('list', () => {
    it('should return all posts with 200', async () => {
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
      ];

      mockedPostService.list.mockResolvedValue(posts);

      await postController.list(mockReq as Request, mockRes as Response);

      expect(mockedPostService.list).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(code.OK);
      expect(mockRes.json).toHaveBeenCalledWith({
        ok: true,
        status: code.OK,
        message: 'Posts retrieved successfully',
        data: posts,
      });
    });
  });

  describe('get', () => {
    it('should return a single post with 200', async () => {
      const postId = '550e8400-e29b-41d4-a716-446655440000';
      const post = {
        id: postId,
        title: 'Test Post',
        content: 'Test content',
        user_id: '660e8400-e29b-41d4-a716-446655440001',
        author: 'testuser',
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockReq.params = { id: postId };
      mockedPostService.get.mockResolvedValue(post);

      await postController.get(mockReq as Request, mockRes as Response);

      expect(mockedPostService.get).toHaveBeenCalledWith(postId);
      expect(mockRes.status).toHaveBeenCalledWith(code.OK);
      expect(mockRes.json).toHaveBeenCalledWith({
        ok: true,
        status: code.OK,
        message: 'Post retrieved successfully',
        data: post,
      });
    });
  });

  describe('update', () => {
    it('should update a post and return 200', async () => {
      const postId = '550e8400-e29b-41d4-a716-446655440000';
      const updateData = {
        title: 'Updated Title',
        content: 'Updated content',
      };

      const updatedPost = {
        id: postId,
        ...updateData,
        user_id: mockReq.user!.id,
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockReq.params = { id: postId };
      mockReq.body = updateData;
      mockedPostService.update.mockResolvedValue(updatedPost);

      await postController.update(mockReq as Request, mockRes as Response);

      expect(mockedPostService.update).toHaveBeenCalledWith({
        id: postId,
        user_id: mockReq.user!.id,
        ...updateData,
      });
      expect(mockRes.status).toHaveBeenCalledWith(code.OK);
      expect(mockRes.json).toHaveBeenCalledWith({
        ok: true,
        status: code.OK,
        message: 'Post updated successfully',
        data: updatedPost,
      });
    });
  });

  describe('remove', () => {
    it('should delete a post and return 200', async () => {
      const postId = '550e8400-e29b-41d4-a716-446655440000';
      const deletedPost = {
        id: postId,
        title: 'Deleted Post',
        content: 'Content',
        user_id: mockReq.user!.id,
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockReq.params = { id: postId };
      mockedPostService.remove.mockResolvedValue(deletedPost);

      await postController.remove(mockReq as Request, mockRes as Response);

      expect(mockedPostService.remove).toHaveBeenCalledWith({
        id: postId,
        user_id: mockReq.user!.id,
      });
      expect(mockRes.status).toHaveBeenCalledWith(code.OK);
      expect(mockRes.json).toHaveBeenCalledWith({
        ok: true,
        status: code.OK,
        message: 'Post deleted successfully',
        data: deletedPost,
      });
    });
  });
});
