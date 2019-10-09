const mongoose = require('mongoose');

const { Schema } = mongoose;

const schema = new Schema({
  name: {
    type: String,
    required: true
  },
  appearance: {
    pattern: String,
    mainColor: {
      type: String,
    }
  },
  flying: {
    type: Boolean,
    default: true
  },
  weight: {
    type: Number,
    required: true
  },
  conservation: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Bee', schema);