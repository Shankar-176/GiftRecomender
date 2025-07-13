	import express from "express";
	import bcrypt from "bcryptjs";
	import jwt from "jsonwebtoken";
	import { User } from "./models/User.js"; // ✅ Fixed import path

	const router = express.Router();

	router.post("/", async (req, res) => {
		try {
			const user = await User.findOne({ email: req.body.email });
			if (!user) return res.status(401).json({ message: "Invalid Email or Password" });

			const validPassword = await bcrypt.compare(req.body.password, user.password);
			if (!validPassword) return res.status(401).json({ message: "Invalid Email or Password" });

			const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "120d" });

			res.status(200).json({ token, message: "Logged in successfully" });
		} catch (error) {
			res.status(500).json({ message: "Internal Server Error" });
		}
	});

	export default router;
