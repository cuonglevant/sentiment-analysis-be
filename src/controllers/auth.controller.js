import db from "../models/index.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const User = db.user;
const Role = db.role;

export const signup = async (req, res) => {
  try {
    const { email, password, roles } = req.body;

    const user = new User({
      email,
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
    res.send({ message: "User was registered successfully!" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

export const signin = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email }).populate(
      "roles",
      "-__v"
    );
    if (!user) return res.status(404).send({ message: "User Not found." });
    if (!bcrypt.compareSync(req.body.password, user.password)) {
      return res
        .status(401)
        .send({ accessToken: null, message: "Invalid Password!" });
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: 86400,
    });
    res.status(200).send({
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
    res.status(200).send({ message: "You've been signed out!" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
