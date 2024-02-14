import mongoose from "mongoose";

const replySchema = new mongoose.Schema({
  content: String,
  commentId: { type: mongoose.Schema.Types.ObjectId, ref: "Comment" }
});

const Reply = mongoose.models.Reply || mongoose.model("Reply", replySchema);

export default Reply;
