import express from "express";
import User from "../database/models/userModel.js";
const router = express.Router();
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Poll from "../database/models/pollModel.js";

router.post("/api/signup", async (req, res) => {
  try {
    const { name, email, password, cpassword, image } = req.body;
  console.log(image)
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.json({ error: "User Already Exists" });
    }

    if (password != cpassword) {
      return res.json({ error: "Passwords and Confirm Password not same" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      cpassword: hashedPassword,
      image: image
    });
    await user.save();
    res.status(201).send({ message: "User created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

router.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const emailExists = await User.findOne({ email: email });

    if (!emailExists) {
      return res.status(400).json({ error: "Invalid Credentials" });
    } else {
      const pMatch = await bcrypt.compare(password, emailExists.password);
      if (pMatch) {
        const token = jwt.sign({ emailExists }, "secret");

        res.cookie("jwtoken", token, {
          expires: new Date(Date.now() + 25892000000),
          httpOnly: true
        });
        console.log(emailExists)
        const user = {
          id: emailExists._id,
          name: emailExists.name,
          email: emailExists.email,
          votedPolls: emailExists.votedInPolls,
          createdPolls: emailExists.createdPolls,
          image: emailExists.image
        };
        return res
          .status(200)
          .json({ token, user, message: "User logged in successfully" });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/api/logout", (req, res) => {
  res.clearCookie("jwtoken");

  res.status(200).send({ message: "Logged Out Successfully" });
});

const authMiddleware = (req, res, next) => {
  if (!token) {
    return res.status(401).send("Access denied. No token provided.");
  }
  try {
    const decoded = jwt.verify(token, "secret");
    req.user = decoded;
    next();
  } catch (error) {
    console.error(error);
    res.status(400).send("Invalid token.");
  }
};
router.post("/api/create", async (req, res) => {
  const obtained = req.body;

  const { user, data, options } = obtained;

  try {
    const poll = Poll.create({
      title: data.title,
      description: data.description,
      creater: user.id,
      option1: options.option1,
      option2: options.option2
    });

    const POLL = await poll;
    const userId = user.id;
    const creater = await User.findById(userId);
    creater.createdPolls.push(POLL._id);

    await creater.save();

    // await creater.save();

    res.status(200).send({ message: "Poll Created Successfully" });
  } catch (error) {
    console.log(error);
  }
});

export default router;
