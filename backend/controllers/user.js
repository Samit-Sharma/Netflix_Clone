import { User } from "../models/userModel.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Invalid data",
        success: false
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
        success: false
      });
    }

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
        success: false
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        secure: true,       // REQUIRED on Render
        sameSite: "none",   // REQUIRED for Vercel
        maxAge: 60 * 60 * 1000
      })
      .json({
        message: `Welcome back ${user.fullName}`,
        success: true,
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email
        }
      });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
};

export const Logout = async (req, res) => {
  res
    .status(200)
    .cookie("token", "", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      expires: new Date(0)
    })
    .json({
      message: "User logged out successfully",
      success: true
    });
};

export const Register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({
        message: "Invalid data",
        success: false
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: "Email already exists",
        success: false
      });
    }

    const hashedPassword = await bcryptjs.hash(password, 12);

    await User.create({
      fullName,
      email,
      password: hashedPassword
    });

    res.status(201).json({
      message: "Account created successfully",
      success: true
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
};
