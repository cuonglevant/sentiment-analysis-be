import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieSession from "cookie-session";
import mongoose from "mongoose";

import authRoute from "./src/routes/auth.route.js";
import userRoute from "./src/routes/user.route.js";
import Role from "./src/models/role.model.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 8080;

const corsOptions = {
  origin: "*", // Allow requests from this origin
  credentials: true, // Allow credentials (e.g., cookies, authorization headers)
  optionsSuccessStatus: 200, // For legacy browsers
  allowedHeaders: ["Content-Type", "Authorization"], // Allow specific headers
};

app.use(cors(corsOptions));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(
  cookieSession({
    name: "cuonglevant-session",
    secret: process.env.COOKIE_SECRET,
    httpOnly: true,
  })
);

// Set strictQuery option to suppress deprecation warning
mongoose.set("strictQuery", true);

mongoose
  .connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("Successfully connected to MongoDB.");
    await initial(); // Initialize roles
  })
  .catch((err) => {
    console.error("Connection error", err);
    process.exit();
  });

app.use("/auth", authRoute);
app.use("/user", userRoute);
app.use("/api/test", userRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

// Updated to use async/await instead of callbacks
async function initial() {
  try {
    const count = await Role.estimatedDocumentCount();

    if (count === 0) {
      try {
        await new Role({ name: "user" }).save();
        console.log("Added 'user' to roles collection");

        await new Role({ name: "admin" }).save();
        console.log("Added 'admin' to roles collection");
      } catch (err) {
        console.log("Error creating roles:", err);
      }
    }
  } catch (err) {
    console.log("Error counting documents:", err);
  }
}
