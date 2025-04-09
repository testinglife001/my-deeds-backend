import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		name: {
			type: String,
			required: true,
		},
        loginMethod: {
            type: String,
            // required: true
        },
        image: {
            type: String,
             required: false
        },
		image_url: {
            type: String,
             required: false
        },
        role: {
            type: String,
            default: 'user'
        },
        accessStatus: {
            type: String,
            default: 'unblock'
        },
		lastLogin: {
			type: Date,
			default: Date.now,
		},
		isVerified: {
			type: Boolean,
			default: false,
		},
        isActive: {
            type: Boolean,
            required: true,
            default: true
        },
        isAdmin: { 
            type: Boolean, 
            required: true, 
            default: false 
        },
		resetPasswordToken: String,
		resetPasswordExpiresAt: Date,
		verificationToken: String,
		verificationTokenExpiresAt: Date,
	},
	{ timestamps: true }
);

export const User = mongoose.model("User", userSchema);
