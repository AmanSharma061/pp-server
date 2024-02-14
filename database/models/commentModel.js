import mongoose, { mongo } from "mongoose";

const commentSchema = new mongoose.Schema({
  content: String,
  postedBy:{
    type: mongoose.Schema.Types.ObjectId ,
    ref:"User"
  },
  poll: { type: mongoose.Schema.Types.ObjectId, ref: "Poll" }, // Added poll field
  replies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Reply" }]
});

const Comment =
  mongoose.models.Comment || mongoose.model("Comment", commentSchema);

export default Comment;
