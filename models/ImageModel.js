import mongoose from "mongoose";

const imageGallarySchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: false
        },
        imageURL: {
            type: String
        },
        originalName: {
            type: String
        },
        mimeType: {
            type: String
        },
        size: {
            type: Number
        },
        createdAt: {
            type: Date,
            default: new Date()
        },
        updatedAt: {
            type: Date,
            default: new Date()
        }
    }
);

export const ImageModel = mongoose.model("imageGallary", imageGallarySchema);
