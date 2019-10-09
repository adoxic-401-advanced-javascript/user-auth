const request = require('../request');
const { dropCollection } = require('../db');
const User = require('../../lib/models/user');

describe('BEEEES', () => {
  beforeEach(() => dropCollection('users'));
  beforeEach(() => dropCollection('bees'));

  const testUser = {
    email: 'me@me.com',
    password: 'abc'
  };

  function makeFirstAdmin(admin) {
    return request
      .post('/api/auth/signup')
      .send(admin)
      .expect(200)
      .then(({ body }) => body)
      .then(user => {
        return User.updateById(user._id, {
          $addToSet: {
            roles: 'admin'
          }
        });
      })
      .then(() => {
        return request
          .post('/api/auth/signin')
          .send(admin)
          .expect(200)
          .then(res => {
            admin = res.body;
            return res.body;
          });
      });
  }
  let user = null;

  beforeEach(() => {
    return makeFirstAdmin(testUser).then(admin => (user = admin));
  });

  const bumbleBee = {
    name: 'Bumble Bee',
    appearance: {
      pattern: 'stripe',
      mainColor: 'yellow'
    },
    weight: 3,
    conservation: 'endangered'
  };

  const editBee = {
    name: 'Bumblebee',
    appearance: {
      pattern: 'stripe',
      mainColor: 'yellow'
    },
    weight: 3,
    conservation: 'endangered'
  };

  function postBee(bee) {
    return request
      .post('/api/bees')
      .set('Authorization', user.token)
      .send(bee)
      .expect(200)
      .then(({ body }) => body);
  }
  it('make a bee?', () => {
    return postBee(bumbleBee).then(bee => {
      expect(bee).toMatchInlineSnapshot(
        {
          _id: expect.any(String)
        },
        `
        Object {
          "__v": 0,
          "_id": Any<String>,
          "appearance": Object {
            "mainColor": "yellow",
            "pattern": "stripe",
          },
          "conservation": "endangered",
          "flying": true,
          "name": "Bumble Bee",
          "weight": 3,
        }
      `
      );
    });
  });
  it('edit a bee?', () => {
    return postBee(bumbleBee).then(bee => {
      return request
        .put(`/api/bees/${bee._id}`)
        .set('Authorization', user.token)
        .send(editBee)
        .expect(200);
    })
      .then(newBee => {
        const { body } = newBee; 
        expect(body.name).toBe('Bumblebee');
      });
  });
  it('delete a bee?', () => {
    return postBee(bumbleBee).then(bee => {
      return request
        .delete(`/api/bees/${bee._id}`)
        .set('Authorization', user.token)
        .expect(200);
    });
  });

  const someGuy = {
    email: 'person@person.com',
    password: 'password'

  };
  function makeUser(admin) {
    return request
      .post('/api/auth/signup')
      .send(admin)
      .expect(200)
      .then(({ body }) => body);
  }

  it('any user can get bees', () => {
    return Promise.all([
      postBee(bumbleBee),
      makeUser(someGuy)
    ])
      .then(([bee, regUser]) => {
        return request
          .get('/api/bees')
          .set('Authorization', regUser.token)
          .expect(200)
          .then(({ body }) => {
            expect(body[0]).toEqual(bee);
          });
      });
  });
});
