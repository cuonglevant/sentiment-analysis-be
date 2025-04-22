import User from "../models/user.model.js";

export const userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

export const adminBoard = (req, res) => {
  res.status(200).send("Cái này là Cường làm nè!");
};

export const getUserByEmail = async (req, res) => {
  const { email } = req.params;
  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: "User not found." });
    // exclude sensitive info
    const { password, ...userData } = user.toObject();
    res.json(userData);
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

export const updateUserProfile = async (req, res) => {
  const { email } = req.params;
  try {
    const updatedUser = await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      { $set: req.body },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    const { password, ...userData } = updatedUser.toObject();
    res.json(userData);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
