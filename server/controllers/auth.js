import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import transporter from "../config/nodemailer.js";
/* REGISTER USER */
export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation,
    } = req.body;

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      picturePath,
      friends,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 10000),
      impressions: Math.floor(Math.random() * 10000),
    });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* LOGGING IN */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) return res.status(400).json({ msg: "User does not exist. " });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials. " });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    delete user.password;
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Send password reset OTP
export const sendResetPassword = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.json({
            success: false,
            message: 'Email is required'
        });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.json({
                success: false,
                message: 'User email not found'
            });
        }

        // Generate OTP
        const OTP = String(Math.floor(100000 + Math.random() * 900000));

        // Hash OTP before storing
        const hashedOTP = await bcrypt.hash(OTP, 10);

        // Store hashed OTP and expiry
        user.resetOTP = hashedOTP;
        user.expresetOTP = Date.now() + 15 * 60 * 1000; // Valid for 15 minutes
        await user.save();

        // Send OTP via email
        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "OTP Verification for Our Website",
            text: `Your OTP is ${OTP}. Please verify your account using this OTP within 15 minutes.`
        };

        await transporter.sendMail(mailOption);

        return res.json({
            success: true,
            message: "OTP email sent",
        });

    } catch (error) {
        return res.json({
            success: false,
            message: "Error sending OTP: " + error.message,
        });
    }
};

// Reset user password
export const resetPassword = async (req, res) => {
    const { email, OTP, password } = req.body;

    if (!email || !OTP || !password) {
        return res.json({
            success: false,
            message: 'Invalid input: email, OTP, and password are required'
        });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.json({
                success: false,
                message: 'User not found'
            });
        }

        // Verify OTP
        const isOTPValid = await bcrypt.compare(OTP, user.resetOTP);
        if (!isOTPValid) {
            return res.json({
                success: false,
                message: 'Invalid OTP'
            });
        }

        if (user.expresetOTP < Date.now()) {
            return res.json({
                success: false,
                message: 'OTP expired'
            });
        }

        // Encrypt new password
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;

        // Clear OTP fields
        user.resetOTP = '';
        user.expresetOTP = 0;

        await user.save();

        return res.json({
            success: true,
            message: 'Password reset successful'
        });
    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        });
    }
};
