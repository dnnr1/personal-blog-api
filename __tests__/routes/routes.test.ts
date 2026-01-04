import express, { Express, Request, Response, NextFunction } from 'express';
import request from 'supertest';

const mockUserService = {
  register: jest.fn(),
  login: jest.fn(),
};

const mockPostService = {
  create: jest.fn(),
  list: jest.fn(),
  get: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

jest.mock('../../src/core/services/user', () => ({
  __esModule: true,
  default: mockUserService,
}));

jest.mock('../../src/core/services/post', () => ({
  __esModule: true,
  default: mockPostService,
}));

const mockUser = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  username: 'testuser',
  email: 'test@example.com',
};

jest.mock('../../src/core/middlewares/authenticate', () => ({
  authenticate: (req: Request, _res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      const { AppError } = require('../../src/core/utils/AppError');
      return next(new AppError('UNAUTHORIZED', 401));
    }
    const [scheme, token] = authHeader.split(' ');
    if (scheme?.toLowerCase() !== 'bearer' || !token) {
      const { AppError } = require('../../src/core/utils/AppError');
      return next(new AppError('UNAUTHORIZED', 401));
    }
    req.user = mockUser;
    return next();
  },
}));

jest.mock('../../src/db', () => ({
  __esModule: true,
  default: jest.fn(),
}));

import router from '../../src/routes';
import errorHandler from '../../src/core/middlewares/errorHandler';

describe('Routes Integration', () => {
  let app: Express;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/blog-api', router);
    app.use(errorHandler);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /blog-api/register', () => {
    it('should register a new user', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        username: 'testuser',
      };

      const registeredUser = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        email: userData.email,
        username: userData.username,
      };

      mockUserService.register.mockResolvedValue(registeredUser);

      const response = await request(app)
        .post('/blog-api/register')
        .send(userData)
        .expect(201);

      expect(response.body.ok).toBe(true);
      expect(response.body.message).toBe('User created successfully');
      expect(response.body.data).toEqual(registeredUser);
    });

    it('should return 400 for invalid data', async () => {
      const invalidData = {
        email: 'invalid-email',
        password: '123',
        username: 'ab',
      };

      const response = await request(app)
        .post('/blog-api/register')
        .send(invalidData)
        .expect(400);

      expect(response.body.ok).toBe(false);
    });
  });

  describe('POST /blog-api/login', () => {
    it('should login a user', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123',
      };

      const loggedInUser = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        email: loginData.email,
        username: 'testuser',
      };

      mockUserService.login.mockResolvedValue(loggedInUser);

      const response = await request(app)
        .post('/blog-api/login')
        .send(loginData)
        .expect(200);

      expect(response.body.ok).toBe(true);
      expect(response.body.message).toBe('Login successful');
      expect(response.body.data).toEqual(loggedInUser);
    });
  });

  describe('GET /blog-api/posts', () => {
    it('should return all posts', async () => {
      const posts = [
        {
          id: '550e8400-e29b-41d4-a716-446655440000',
          title: 'Post 1',
          content: 'Content 1',
          author: 'user1',
        },
      ];

      mockPostService.list.mockResolvedValue(posts);

      const response = await request(app).get('/blog-api/posts').expect(200);

      expect(response.body.ok).toBe(true);
      expect(response.body.data).toEqual(posts);
    });
  });

  describe('GET /blog-api/posts/:id', () => {
    it('should return a single post', async () => {
      const postId = '550e8400-e29b-41d4-a716-446655440000';
      const post = {
        id: postId,
        title: 'Test Post',
        content: 'Test content',
        author: 'testuser',
      };

      mockPostService.get.mockResolvedValue(post);

      const response = await request(app)
        .get(`/blog-api/posts/${postId}`)
        .expect(200);

      expect(response.body.ok).toBe(true);
      expect(response.body.data).toEqual(post);
    });
  });

  describe('Protected Routes', () => {
    const authHeader = 'Bearer mock-token';

    describe('POST /blog-api/posts', () => {
      it('should create a post when authenticated', async () => {
        const postData = {
          title: 'New Post',
          content: 'New content',
        };

        const createdPost = {
          id: '660e8400-e29b-41d4-a716-446655440001',
          ...postData,
          user_id: '550e8400-e29b-41d4-a716-446655440000',
        };

        mockPostService.create.mockResolvedValue(createdPost);

        const response = await request(app)
          .post('/blog-api/posts')
          .set('Authorization', authHeader)
          .send(postData)
          .expect(201);

        expect(response.body.ok).toBe(true);
        expect(response.body.message).toBe('Post created successfully');
      });

      it('should return 401 when not authenticated', async () => {
        const postData = {
          title: 'New Post',
          content: 'New content',
        };

        const response = await request(app)
          .post('/blog-api/posts')
          .send(postData)
          .expect(401);

        expect(response.body.ok).toBe(false);
      });
    });

    describe('PUT /blog-api/posts/:id', () => {
      it('should update a post when authenticated', async () => {
        const postId = '550e8400-e29b-41d4-a716-446655440000';
        const updateData = {
          title: 'Updated Title',
          content: 'Updated content',
        };

        const updatedPost = {
          id: postId,
          ...updateData,
        };

        mockPostService.update.mockResolvedValue(updatedPost);

        const response = await request(app)
          .put(`/blog-api/posts/${postId}`)
          .set('Authorization', authHeader)
          .send(updateData)
          .expect(200);

        expect(response.body.ok).toBe(true);
        expect(response.body.message).toBe('Post updated successfully');
      });
    });

    describe('DELETE /blog-api/posts/:id', () => {
      it('should delete a post when authenticated', async () => {
        const postId = '550e8400-e29b-41d4-a716-446655440000';
        const deletedPost = {
          id: postId,
          title: 'Deleted Post',
          content: 'Content',
        };

        mockPostService.remove.mockResolvedValue(deletedPost);

        const response = await request(app)
          .delete(`/blog-api/posts/${postId}`)
          .set('Authorization', authHeader)
          .expect(200);

        expect(response.body.ok).toBe(true);
        expect(response.body.message).toBe('Post deleted successfully');
      });
    });
  });
});
