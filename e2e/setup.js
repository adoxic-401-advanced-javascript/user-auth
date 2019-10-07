const connect = require('../lib/connect');
const MONGODB_URI = 'mongodb://localhost:27017/test-db';
const mongoose = require('mongoose');

beforeAll(() => {
  return connect(MONGODB_URI, { log: false });
});

afterAll(() => {
  return mongoose.connection.close();
});
