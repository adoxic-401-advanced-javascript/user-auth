const request = require('../request');
const { dropCollection } = require('../db');
const jwt = require('jsonwebtoken');
const { signupUser } = require('../data-helpers');
const User = require('../../lib/models/user');
const Bees = require('../../lib/models/bee');

describe('BEEEES', () => {

  beforeEach(() => dropCollection('users'));
  beforeEach(() => dropCollection('bees'));

  const testUser = {
    email: 'me@me.com',
    password: 'abc'
  };

  beforeEach(() => {
    return signupUser(testUser)
      .then(newUser => {

        return User.updateById(
          user._id,
          { 
            $addToSet: { 
              roles: 'admin'
            }
          }
        );
      });
  });

  const bumbleBee = {
    name: 'Bumble Bee',
    appearance: {
      pattern: 'stripe',
      mainColor: 'yellow'
    },
    weight: 3,
    conservation: 'endangered',
  };
  it('make a bee?', () => {

  });
});