const User = require("../models/user");  // Capitalized conventionally
const mailSender = require("../utils/mailSender");
const crypto = require("crypto");
const bcrypt = require("bcrypt");

// resetPasswordToken
exports.resetPasswordToken = async (req, res) => {
    try {
        const email = req.body.email;
        const existingUser = await User.findOne({ email: email });
        if (!existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Your email is not registered with us'
            });
        }

        const token = crypto.randomUUID();
        await User.findOneAndUpdate(
            { email: email },
            {
                token: token,
                resetPasswordExpire: Date.now() + 30 * 60 * 1000  // 30 mins
            },
            { new: true }
        );

        const url = `http://localhost:3000/update-password/${token}`;
        await mailSender(email, 'Reset Password', `Password reset link: ${url}`);

        return res.status(200).json({
            success: true,
            message: 'Email sent successfully'
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Something went wrong'
        });
    }
};

// resetPassword
exports.resetPassword = async (req, res) => {
    try {
        const { token, password, confirmPassword } = req.body;

        if (password !== confirmPassword) {
            return res.status(403).json({
                success: false,
                message: 'Password and confirm password do not match'
            });
        }

        const existingUser = await User.findOne({ token: token });
        if (!existingUser) {
            return res.status(403).json({
                success: false,
                message: 'Invalid token'
            });
        }

        if (existingUser.resetPasswordExpires < Date.now()) {
            return res.status(403).json({
                success: false,
                message: 'Token expired'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.findOneAndUpdate(
            { token: token },
            {
                password: hashedPassword,
                token: null,
                resetPasswordExpire: null
            },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: 'Password reset successfully'
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Something went wrong'
        });
    }
};
