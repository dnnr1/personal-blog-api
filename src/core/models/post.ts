export type Post = {
  id: string;
  user_id: string;
  title: string;
  content: string;
  created_at: Date;
  updated_at: Date;
};

export type PostCreateInput = Pick<Post, 'title' | 'content' | 'user_id'>;
export type PostUpdateInput = Pick<
  Post,
  'title' | 'content' | 'id' | 'user_id'
>;
export type PostDeleteInput = Pick<Post, 'id' | 'user_id'>;
export type Posts = Array<
  Post & {
    username: string;
  }
>;
