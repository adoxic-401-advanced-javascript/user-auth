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
  wingSpan: {
    type: Number,
    required: true
  },
  flying: {
    type: Boolean,
    default: true
  },
  scientificClass: {
    Kingdom: {
      type: String,
      required: true
    },
    Phylum: {
      type: String,
      required: true
    },
    Class: {
      type: String,
      required: true
    },
    Order: {
      type: String,
      required: true
    },
    Family: {
      type: String,
      required: true
    },
    Genus: {
      type: String,
      required: true
    },
    Species: {
      type: String,
      required: true
    }
  },
  diet: [{
    type: String,
  }],
  conservation: {
    type: String,
    required: true
  },
  observer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
});

module.exports = mongoose.model('Bird', schema);