import db from "../models/index.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const User = db.user;
const Role = db.role;

export const signup = async (req, res) => {
  try {
    const { name, email, password, roles } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }
    
    // Check if email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already in use.' });
    }

    const user = new User({
      name,
      email: email.toLowerCase(),
      password: bcrypt.hashSync(password, 8),
    });

    const savedUser = await user.save();

    if (roles) {
      const foundRoles = await Role.find({ name: { $in: roles } });
      savedUser.roles = foundRoles.map((role) => role._id);
    } else {
      const role = await Role.findOne({ name: "user" });
      savedUser.roles = [role._id];
    }

    await savedUser.save();
    res.status(201).json({ message: "User registered successfully!" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }
    
    const user = await User.findOne({ email: email.toLowerCase() }).populate(
      "roles",
      "-__v"
    );
    
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password." });
    }
    
    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(400).json({ message: "Invalid email or password." });
    }
    
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: 86400, // 24 hours
    });
    
    res.status(200).json({
      id: user._id,
      email: user.email,
      roles: user.roles,
      accessToken: token,
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

export const signout = (req, res) => {
  try {
    req.session = null;
    res.status(200).json({ message: "You've been signed out!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
