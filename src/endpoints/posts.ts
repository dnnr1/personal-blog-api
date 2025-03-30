import { Router } from "express";
import { postSchema } from "../schemas/posts";
import db from "../db";

const postRouter = Router();

postRouter.post("/posts", async (req, res) => {
  try {
    const { title, content } = postSchema.parse(req.body);
    const [id] = await db("posts").insert({ title, content }).returning("id");
    res.status(201).json({ id, title, content });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Error creating post" });
  }
});

postRouter.get("/posts", async (_, res) => {
  const posts = await db("posts").select("*");
  res.json(posts);
});

postRouter.get("/posts/:id", async (req, res) => {
  const { id } = req.params;
  const post = await db("posts").where({ id }).first();
  if (!post) {
    res.status(404).json({ error: "Post not found" });
    return;
  }
  res.json(post);
});

postRouter.put("/posts/:id", async (req, res) => {
  const { id } = req.params;
  const { title, content } = postSchema.parse(req.body);
  const updatedPost = await db("posts")
    .where({ id })
    .update({ title, content })
    .returning("*");
  if (!updatedPost) {
    res.status(404).json({ error: "Post not found" });
    return;
  }
  res.json(updatedPost[0]);
});

postRouter.delete("/posts/:id", async (req, res) => {
  const { id } = req.params;
  const deletedPost = await db("posts").where({ id }).del();
  if (!deletedPost) {
    res.status(404).json({ error: "Post not found" });
    return;
  }
  res.status(204).send();
});

export default postRouter;
