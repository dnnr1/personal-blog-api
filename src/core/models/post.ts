export type Post = {
  id: string;
  user_id: string;
  title: string;
  pictureUrl?: string;
  content: string;
  created_at: Date;
  updated_at: Date;
};

export type PostCreateInput = {
  title: string;
  content: string;
  user_id: string;
  pictureUrl?: string;
};

export type PostUpdateInput = {
  title?: string;
  content?: string;
  pictureUrl?: string;
  id: string;
  user_id: string;
};

export type PostDeleteInput = {
  id: string;
  user_id: string;
};

export type Posts = Array<
  Post & {
    author: string;
  }
>;
