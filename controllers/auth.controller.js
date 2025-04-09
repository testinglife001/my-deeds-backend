	import bcryptjs from "bcryptjs";
import bcrypt from "bcrypt";
import crypto from "crypto";
import validator from "validator";
import jwt from "jsonwebtoken";

import { User } from "../models/user.model.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendPasswordResetEmail, sendResetSuccessEmail, sendVerificationEmail, sendWelcomeEmail,  } from "../mailtrap/emails.js";
import { Admin } from "../models/adminModel.js";
// import adminModel from "../models/adminModel.js";


export const signup = async (req,res) => {
	// console.log(req);
	// console.log(req.body);
    
    
     const { email, password, name, isAdmin,  role, image } = req.body;
	//  const body = req.body;
    try {
        if (!email || !password || !name) {
			throw new Error("All fields are required");
		}		 
		// body.image = req.file ? req.file?.path : null;
		// if(image){
		//	const imageName = Date.now() + image.image.originalFilename;
		//	const disPath = __dirname + `../../frontend/public/userImage/${imageName}`
		// }

		const userAlreadyExists = await User.findOne({ email });
		console.log("userAlreadyExists", userAlreadyExists);
		 console.log(image);


		if (userAlreadyExists) {
			return res.status(400).json({ success: false, message: "User already exists" });
		}
        const hashedPassword = await bcryptjs.hash(password, 10);
		const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
        const user = new User({
			email,
			password: hashedPassword,
			name,
            isAdmin,
            role,
            loginMethod: 'manually',
            // image: "file:///D:/audwit/coding/mysimpleapp/frontend/public/hgzbykooy7r9dqigzron.jpg",
			// image: `http://localhost:3000/userImage/${imageName}`,
			image: req.file?.path || null,  // : req.file ? req.file?.path : null,
            verificationToken,
			verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
		});

		console.log(user);

		
        await user.save();


		if(!userAlreadyExists){
			const token = jwt.sign({
				id: user._id,
				email: user.email,
				name: user.userName,
				image: user.image,
				role: user.role,
				loginMethod: user.loginMethod,
				accessStatus: user.accessStatus,
				createdAt: user.createdAt
			}, process.env.JWT_SECRET, {
				expiresIn: process.env.TOKEN_EXP
			})

			const option = {
				expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
			}

			// res.status(201).cookie('token', token, option)
			//	.json(
			//		{
			//		successMessage: "Verify your email and register successfully",
			//		token
			//		}
			//)
			await sendVerificationEmail(user.email, verificationToken);

			res.status(201)
				.cookie('token', token, option)
				.json(
					{
					success: true,
					message: "User created successfully",
					user: {
						...user._doc,
						password: undefined,
					},
					successMessage: "Verify your email and register successfully",
					token
				}
			);
		}



        // generateTokenAndSetCookie(res, user._id);
		

     } catch (error) {
         res.status(400).json({ success: false, message: error.message });
     }
	
    
}

export const createUser = async (req,res) => {
	// console.log(req.body);
	
	try {
		const body = req.body;
		body.image = req.file ? req.file?.path : null;
		console.log(body);
		const user = new User(body);
		console.log(user);
		await user.save();
		res.status(201)
		.json({
			message: "User created.",
			uccess: true
		})
	} catch (error) {
		res.status(500)
			.json({
				message: "Internal server error",
				success: false,
				error: error
			})	
	}
	

}

export const verifyEmail = async (req, res) => {
	const { code } = req.body;
     console.log(code);
	
    
	
	try {
		const user = await User.findOne({
			verificationToken: code,
			verificationTokenExpiresAt: { $gt: Date.now() },
		});

		if (!user) {
			return res.status(400).json({ success: false, message: "Invalid or expired verification code" });
		}

		user.isVerified = true;
		user.verificationToken = undefined;
		user.verificationTokenExpiresAt = undefined;
		await user.save();


		await sendWelcomeEmail(user.email, user.name);

		res.status(200).json({
			success: true,
			message: "Email verified successfully",
			user: {
				...user._doc,
				password: undefined,
			},
		});
	} catch (error) {
		console.log("error in verifyEmail ", error);
		res.status(500).json({ success: false, message: "Server error" });
	}
	
    
}; 


export const signin = async (req, res) => {
    const { email, password } = req.body;
	// console.log(req.body);

	try {
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(400).json({ success: false, message: "Invalid credentials" });
		}
		const isPasswordValid = await bcryptjs.compare(password, user.password);
		if (!isPasswordValid) {
			return res.status(400).json({ success: false, message: "Invalid credentials" });
		}
		
		

		// generateTokenAndSetCookie(res, user._id);

		user.lastLogin = new Date();
		await user.save();

		if(isPasswordValid){
			const token = jwt.sign({
				id: user._id,
				email: user.email,
				name: user.userName,
				image: user.image,
				role: user.role,
				loginMethod: user.loginMethod,
				accessStatus: user.accessStatus,
				createdAt: user.createdAt
			}, process.env.JWT_SECRET, {
				expiresIn: process.env.TOKEN_EXP
			})

			const option = {
				expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
			}
			res.status(201)
				.cookie('token', token, option)
				.json({
					successMessage: "Your logged in is successfully",
					token,
					success: true,
					message: "Logged in successfully",
					user: {
						...user._doc,
						password: undefined,
					},
				}
			)

		}

		// res.status(200).json({
		//	success: true,
		//	message: "Logged in successfully",
		//	user: {
		//		...user._doc,
		//		password: undefined,
		//	},
		// });
	} catch (error) {
		console.log("Error in login ", error);
		res.status(400).json({ success: false, message: error.message });
	}

}

export const signout = async (req, res) => {
    res.clearCookie("token");
	res.status(200).json({ success: true, message: "Logged out successfully" });
}

export const forgotPassword = async (req, res) => {
	const { email } = req.body;
	console.log(req.body);

	try {
		const user = await User.findOne({ email });

		if (!user) {
			return res.status(400).json({ success: false, message: "User not found" });
		}

		// Generate reset token
		const resetToken = crypto.randomBytes(20).toString("hex");
		const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

		user.resetPasswordToken = resetToken;
		user.resetPasswordExpiresAt = resetTokenExpiresAt;

		await user.save();

		// send email
		await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);

		res.status(200).json({ success: true, message: "Password reset link sent to your email" });
	} catch (error) {
		console.log("Error in forgotPassword ", error);
		res.status(400).json({ success: false, message: error.message });	
	}

}

export const resetPassword = async (req, res) => {

	try {
		const { token } = req.params;
		console.log(token);
		const { password } = req.body;
		console.log(password);

		const user = await User.findOne({
			resetPasswordToken: token,
			resetPasswordExpiresAt: { $gt: Date.now() },
		});

		if (!user) {
			return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
		}
		// update password
		const hashedPassword = await bcryptjs.hash(password, 10);

		user.password = hashedPassword;
		user.resetPasswordToken = undefined;
		user.resetPasswordExpiresAt = undefined;
		await user.save();

		await sendResetSuccessEmail(user.email);

		res.status(200).json({ success: true, message: "Password reset successful" });

	} catch (error) {
		console.log("Error in resetPassword ", error);
		res.status(400).json({ success: false, message: error.message });
	}

}

export const checkAuth = async (req, res) => {
	try {
		const user = await User.findById(req.userId).select("-password");
		if (!user) {
			return res.status(400).json({ success: false, message: "User not found" });
		}

		res.status(200).json({ success: true, user });
	} catch (error) {
		console.log("Error in checkAuth ", error);
		res.status(400).json({ success: false, message: error.message });
	}
}

export const admin_login = async (req, res) => {
	// console.log(req.body);
	
	const {email,password} = req.body;
	const error = {	}
	if(email && !validator.isEmail(email)){
		error.email = "Please provide valid email"
	}
	if(!email){
		error.email = "Please provide your email"
	}
	if (!password) {
        error.password = "please provide your password"
    }

	if(Object.keys(error).length > 0){
        return res.status(400).json({ errorMessage: error });
    }
	else{
		try {
			const getAdmin = await Admin.findOne({ email }).select('+password');
			// console.log(getAdmin);
			if(getAdmin){
				const matchPassword = await bcrypt.compare(password, getAdmin.password);
				// console.log(matchPassword);
				if(matchPassword){
					const token = jwt.sign({
                        id: getAdmin._id,
                        name: getAdmin.adminName,
                        role: getAdmin.role,
                        image: getAdmin.image
                    }, process.env.JWT_SECRET, { expiresIn: '7d' });
                    res.status(200).cookie('token', token, {
                        expires: new Date(
                            Date.now() + process.env.COOKIE_EXP * 24 * 60 * 60 * 1000
                        ),
                        httpOnly: true
                    }).json({
                        successMessage: 'login successfull',
                        token
                    });
				}
				else{
					return res.status(400).json({ errorMessage: { error: "Passwod does not match" } });
				}
			}
			else{
				return res.status(400).json({ errorMessage: { error: "Email does not exits" } });
			}
		} catch (error) {
			console.log(error.message);
			return res.status(500).json({ errorMessage: { error: "Internal server error" } });
		}
	}
	

}

