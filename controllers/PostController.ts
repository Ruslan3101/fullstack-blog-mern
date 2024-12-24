import { Request, Response } from "express";
import PostModel from "../models/Post";
import { Error } from "mongoose";

export const getAll = async (req: Request, res: Response) => {
  try {
    const posts = await PostModel.find().populate("user").exec();
    res.json(posts);
  } catch (err) {
    console.log(err),
      res.status(500).json({
        message: "An error occurred while getting posts",
      });
  }
};

export const getOne = async (req: Request, res: Response): Promise<void> => {
  try {
    const postId = req.params.id;
    const updatedPost = await PostModel.findOneAndUpdate(
      { _id: postId },
      { $inc: { viewsCount: 1 } },
      { returnDocument: "after" }
    );

    if (!updatedPost) {
      res.status(404).json({
        message: "The post is not found",
      });
      return;
    }

    res.json(updatedPost);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "An error occurred while updating the post",
    });
  }
};

export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      tags: req.body.tags,
      imageUrl: req.body.imageUrl,
      user: res.locals.userId,
    });

    const post = await doc.save();
    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "An error occurred while creating the post",
    });
  }
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  try {
    const postId = req.params.id;
    const deleted = await PostModel.findOneAndDelete({ _id: postId });

    if (!deleted) {
      res.status(404).json({
        message: "The post has already been deleted or does not exist",
      });
      return;
    }

    res.json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "An error occurred while deleting the post",
    });
  }
};

export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const postId = req.params.id;
    const updatedPost = await PostModel.updateOne(
      { _id: postId },
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        user: res.locals.userId,
        tags: req.body.tags,
      }
    );

    res.json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "An error occurred while updating the post",
    });
  }
};
