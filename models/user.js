import mongoose, { Schema, model, models } from "mongoose";

const userSchema = new Schema(
  {
    userName: { type: String },
    userRole: { type: String },
    userRegisBy: { type: String },
    userPass: { type: String },
    userPhone: { type: String },
    userEmail: { type: String },
    userImage: { type: String }
  },
  {
    timestamps: true,
  }
);

const User = models.User || model("User", userSchema);
export default User;