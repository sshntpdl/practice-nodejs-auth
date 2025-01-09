import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//register controller
const registerUser = async (req, res) => {
  try {
    //extract user information from our request body
    const { username, email, password, role } = req.body;

    //check if user is already exist in our database
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exist with this username or email",
      });
    }

    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //create a new user and save in database
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role: role || "user",
    });

    if (user) {
      res.status(201).json({
        success: true,
        message: "User created successfully",
        data: user,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Failed to create user. Please try again",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong! Please try again.",
    });
  }
};

//login controller
const loginUser = async (req, res) => {
  try {
    //extract user information from our request body
    const { username, password } = req.body;

    //check if user is already exist in our database
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User does not exist",
      });
    }

    //check if password is correct
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (isPasswordCorrect) {
      //generate token
      const token = jwt.sign(
        { userId: user._id, username: user.username, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "15m" }
      );

      res.status(200).json({
        success: true,
        message: "User logged in successfully",
        token,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Invalid username or password",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong! Please try again.",
    });
  }
};

//change password
const changePassword = async (req, res) => {
  try {
    const userId = req.userInfo.userId;

    //extract old & new password
    const { oldPassword, newPassword } = req.body;

    //find the current logged in user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User does not exist",
      });
    }

    //check if the old password is correct
    const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({
        success: false,
        message: "Old password is incorrect",
      });
    }

    //hash the new password here
    const salt = await bcrypt.genSalt(10);
    const newHashedPassword = await bcrypt.hash(newPassword, salt);

    //update the password
    user.password = newHashedPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.log("Password change failed", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong! Please try again.",
    });
  }
};

export { registerUser, loginUser, changePassword };
