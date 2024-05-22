const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  group_name: { type: String, required: true },
  group_pic: {
    data: Buffer,
    contentType: String
},
  created_at: { type: Date, default: Date.now },
  members: [{
      user_id: { type:  mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    }],
  transactions: [{ type:  mongoose.Schema.Types.ObjectId, ref: 'Transaction' }]
});

module.exports = mongoose.model('Group', groupSchema);