import mongoose from "mongoose";
import User from "./user.model.js";
import Role from "./role.model.js";

mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.user = User;
db.role = Role;

// Define ROLES array for validation
db.ROLES = ["user", "admin"];

export default db;
