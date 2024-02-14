import Poll from "../database/models/pollModel.js";
import User from "../database/models/userModel.js";
import Comment from '../database/models/commentModel.js'
import Reply from  '../database/models/replyModel.js'
import express from "express";

const pollRouter = express.Router();

pollRouter.get("/api/getPolls", async (req, res) => {
  try {
    const polls = await Poll.find({}).populate("creater").exec();
    res.status(200).send(polls);
  } catch (error) {
    console.log(error);
  }
});

pollRouter.post("/api/user/polls", async (req, res) => {
  const { id, name, email } = req.body;

  try {
    const user = await User.findById(id)
      .populate("votedInPolls")
      .populate("createdPolls");
    const votedPolls = user?.votedInPolls;
    const createdPolls = user?.createdPolls;

    res.status(200).send({ votedPolls, createdPolls });
  } catch (error) {
    res.status(500).send(error);
    console.log(error);
  }
});

pollRouter.post("/api/getSingle", async (req, res) => {
  const { pollId } = req.body;

  try {
    const poll = await Poll.findById(pollId).populate("creater");

    res.status(200).send(poll);
  } catch (error) {
    res.status(500).send(error);
    console.log(error);
  }
});


export default pollRouter;
