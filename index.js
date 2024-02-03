import express from "express";
import connectDb from "./database/connection.js";
import User from "./database/userModel.js";
import bcrypt from "bcryptjs";
import cookieParser from "cookie-parser";

const app = express();
app.use(cookieParser());
app.use(express.json());
connectDb();
app.get("/", (req, res) => {
  res.send("heloooo");
});
app.get("/contact", (req, res) => {
  res.send("Contact Page");
});

app.post("/api/signup", async (req, res) => {
  const { name, email, password, cpassword } = req.body;

  try {
    if (!email || !name || !password || !cpassword) {
      res.status(401).json({ error: "Missing Fields" });
    }
    const emailExists = await User.findOne({ email });

    if (emailExists) {
      res.status(401).json({ warning: "Email already Exists" });
    }
    if (password != cpassword) {
      res
        .status(401)
        .json({ error: "Password and Confirm password Not Matched" });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      cpassword: hashedPassword
    });
    const token = await user.generateToken();

    await user.save();
    res
      .status(200)
      .json({ message: "User Created Successfully", token: token });
  } catch (error) {
    console.log(error);
  }
});

app.post("/api/login",   async (req, res) => {
  const { email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (!userExists) {
      res.status(400).json({ error: "Invalid Credentials" });
    }

    const isTrue = await bcrypt.compare(password, userExists.password);

    if (!isTrue) {
      res.status(401).json({ error: "Passwords Error" });
    }
    const token = await userExists.generateToken();

    res
      .cookie("token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 8 * 3600000)
      })
      .status(200)
      .json({ message: "user Logged in successfully", token });
  } catch (error) {
    console.log(error);
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
