import db from "../models/index.js"; /// Define roles array directly instead of using db.ROLES
const ROLES = ["user", "admin"];

const User = db.user;

const checkDuplicateUsernameOrEmail = async (req, res, next) => {
  try {
    // Check Username
    let user = await User.findOne({ email: req.body.email }).exec();
    if (user) {
      return res
        .status(400)
        .send({ message: "Failed! Username is already in use!" });
    }
    next();
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (const element of req.body.roles) {
      if (!ROLES.includes(element)) {
        res.status(400).send({
          message: `Failed! Role ${element} does not exist!`,
        });
        return;
      }
    }
  }

  next();
};

export { checkDuplicateUsernameOrEmail, checkRolesExisted };
