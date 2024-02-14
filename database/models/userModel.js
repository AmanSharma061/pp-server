import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  cpassword: {
    type: String,
    required: true
  },
  image: {
   type:String
  },
  votedInPolls: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Poll"
    }
  ],
  createdPolls: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Poll"
    }
  ]
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
