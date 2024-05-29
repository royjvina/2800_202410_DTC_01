const mongoose = require('mongoose');

/**
 * Schema for storing user information
 * @type {mongoose.Schema}
 */
const userSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true 
    },
    phone: { 
        type: String, 
        required: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    resetPasswordToken: { 
        type: String 
    },
    resetPasswordExpires: { 
        type: Date 
    },
    profileImage: {
        data: Buffer,
        contentType: String
    },
    friends: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    }],
    groups: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Group' 
    }],
    emailVerified: { 
        type: Boolean, 
        default: false 
    },
    emailVerificationToken: { 
        type: String 
    },
    emailVerificationExpires: { 
        type: Date 
    }
}, { timestamps: true });

/**
 * User model
 * @typedef {Object} User
 * @property {string} username - The username of the user
 * @property {string} email - The email address of the user
 * @property {string} phone - The phone number of the user
 * @property {string} password - The password of the user
 * @property {string} [resetPasswordToken] - Token for resetting the password
 * @property {Date} [resetPasswordExpires] - Expiry date for the reset password token
 * @property {Object} [profileImage] - Profile image of the user
 * @property {Buffer} profileImage.data - The image data of the user's profile picture
 * @property {string} profileImage.contentType - The content type of the user's profile picture
 * @property {Array<mongoose.ObjectId>} friends - Array of friend IDs
 * @property {Array<mongoose.ObjectId>} groups - Array of group IDs the user belongs to
 * @property {boolean} [emailVerified=false] - Indicates if the user's email is verified
 * @property {string} [emailVerificationToken] - Token for email verification
 * @property {Date} [emailVerificationExpires] - Expiry date for the email verification token
 * @property {Date} createdAt - The timestamp when the user document was created
 * @property {Date} updatedAt - The timestamp when the user document was last updated
 */
module.exports = mongoose.model('User', userSchema);
