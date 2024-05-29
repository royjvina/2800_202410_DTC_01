const mongoose = require('mongoose');

/**
 * Schema for storing group information
 * @type {mongoose.Schema}
 */
const groupSchema = new mongoose.Schema({
  group_name: { 
    type: String, 
    required: true 
  },
  group_pic: {
    data: Buffer,
    contentType: String
  },
  created_at: { 
    type: Date, 
    default: Date.now 
  },
  members: [{
    user_id: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    }
  }],
  transactions: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Transaction' 
  }]
}, { timestamps: true });

/**
 * Group model
 * @typedef {Object} Group
 * @property {string} group_name - The name of the group
 * @property {Buffer} group_pic.data - The image data of the group's picture
 * @property {string} group_pic.contentType - The content type of the group's picture
 * @property {Date} created_at - The date when the group was created
 * @property {Array<Object>} members - Array of member objects
 * @property {mongoose.ObjectId} members.user_id - The ID of the user who is a member of the group
 * @property {Array<mongoose.ObjectId>} transactions - Array of transaction IDs associated with the group
 * @property {Date} createdAt - The timestamp when the group document was created
 * @property {Date} updatedAt - The timestamp when the group document was last updated
 */
module.exports = mongoose.model('Group', groupSchema);
