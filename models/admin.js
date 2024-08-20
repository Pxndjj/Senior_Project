import mongoose, { Schema, model, models } from "mongoose";

const adminSchema = new Schema(
  {
    email: { type: String },
  },
  {
    timestamps: true,
  }
);

const Admin = models.Admin || model("Admin", adminSchema);
export default Admin;