import mongoose from "mongoose";

const pollSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  creater: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  option1: {
    type: String,
    required: true
  },
  option2: {
    type: String,
    required: true
  },
  count1: {
    type: Number,
    default: 0
  },
  count2: {
    type: Number,
    default: 0
  },

  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment"
    }
  ]
});

const Poll = mongoose.models.Poll || mongoose.model("Poll", pollSchema);
export default Poll;
