import express from "express";
import connectDB from "./database/connection.js";
import router from "./auth/server.js";
import cors from "cors";
import http from "http";
import pollRouter from "./poll/server.js";
import { Server } from "socket.io";
import Poll from "./database/models/pollModel.js";
import User from "./database/models/userModel.js";
import Comment from "./database/models/commentModel.js";
import Notification from "./database/models/notificationSchema.js";

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
// app.use(express.bodyParser({ limit: "50mb" }));
// app.use(express.static(process.cwd() + "/dist"));
app.use(express.json());
app.use(router);
app.use(pollRouter);
connectDB();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

io.on("connection", async (socket) => {
  console.log(`Connected Socket ${socket.id}`);

  // For Voting
  socket.on("voting", async (data) => {
    const { pollId, userId, selectedValue } = data;
    let flag = false;
    try {
      const poll = await Poll.findById(pollId);
      const user = await User.findById(userId);

      const uservotedpolls = user.votedInPolls;
      for (let key in uservotedpolls) {
        if (uservotedpolls[key].toString() == pollId) {
          flag = true;
          io.emit("message", { error: "Already Submitted 1 poll" });
        } else {
        }
      }
      if (!flag) {
        if (poll.option1 == selectedValue) {
          poll.count1 = poll.count1 + 1;
        } else {
          poll.count2 = poll.count2 + 1;
        }
        user.votedInPolls.push(pollId);
        await poll.save();
        await user.save();

        const polls = await Poll.find({});

        io.emit("received_polls", { polls });
        socket.emit("message", { message: "You Opinion Submitted" });
      }
    } catch (error) {
      res.status(500).send(error);
      console.log(error);
    }
  });

  // For Profile Updation
  socket.on("getPollsByUser", async (data) => {
    const { id } = data;

    try {
      const user = await User.findById(id)
        .populate("votedInPolls")
        .populate("createdPolls");
      const votedPolls = user?.votedInPolls;
      const createdPolls = user?.createdPolls;

      socket.emit("votedInAndVoteCreated", { votedPolls, createdPolls });
    } catch (error) {
      socket.emit("votedInAndVoteCreated", { error });

      console.log(error);
    }
  });

  // Commet Posted
  socket.on("post_comment", async (data) => {
    const { pollId, comment, userId, createrId } = data;

    try {
      const addCmnt = await Comment.create({
        content: comment,
        poll: pollId,
        postedBy: userId
      });

      const polll = await Poll.findById(pollId);
      polll.comments.push(addCmnt);
      polll.save();
      const notidication = await Notification.create({
        notificationFor: createrId,
        notificationBy: userId,
        poll: pollId
      });
      let noti = {};
      Notification.findOne({})
        .sort({ _id: -1 })
        .populate("notificationFor")
        .populate("notificationBy")
        .populate("poll")
        .then((lastNotification) => {
          if (lastNotification) {
            socket.broadcast.emit("broadcast", { lastNotification });
          } else {
            console.log("No notifications found.");
          }
        })
        .catch((error) => {
          console.error("Error occurred while querying notifications:", error);
        });

      // Broadcast the message to all clients except the sender

      const comments = await Comment.find({ poll: pollId }).populate(
        "postedBy"
      );

      io.emit("receive_comment", { comments });
    } catch (error) {
      console.log(error);
    }
  });

  // Getting Poll Comments
  socket.on("poll_comments", async (data) => {
    try {
      const pollComments = await Comment.find({ poll: data.pollId }).populate(
        "postedBy"
      );
      io.emit("initial_pollComments", { pollComments });
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("getAllPolls", async (data) => {
    try {
      const polls = await Poll.find({});
      io.emit("received_polls", { polls });
    } catch (error) {
      console.log(error);
    }
  });
});

server.listen(3000, () => {
  console.log(`Server Running on port ${3000}`);
});
