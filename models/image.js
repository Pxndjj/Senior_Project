import mongoose, { Schema, model, models } from "mongoose";

const imageSchema = new Schema(
    {
        imageName: { type: String },
        imageUserId: { type: String },
        imageBuffer: { type: String }
    },
    {
        timestamps: true,
    }
);

const Image = models.Image || model("Image", imageSchema);
export default Image;