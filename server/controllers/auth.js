import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

/* REGISTER USER */
export const register = async (req, res) => {
  try {
    const {
      firstName,
      secondName,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation,
    } = req.body;
    const salt = await bcrypt.genSalt();
    const passWordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName,
      secondName,
      email,
      password: passWordHash,
      picturePath,
      friends,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 10000),
      impressions: Math.floor(Math.random() * 10000),
    });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Error");
  }
};
/* LOGIN FUNCTION */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ msg: "User not exists..." });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid Credentials..." });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    delete user.password;
    return res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ msg: err.message });
    console.log("Error");
  }
};
