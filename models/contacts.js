const mongoose = require('mongoose');

const schema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Set name for contact'],
      unique: false,
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'users',
    },
  },
  {
    versionKey: false,
  }
);

const dbContacts = mongoose.model('contacts', schema);
module.exports = {
  dbContacts,
};
