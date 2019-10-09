const request = require('../request');
const { dropCollection } = require('../db');
const jwt = require('jsonwebtoken');
const { signupUser } = require('../data-helpers');
const User = require('../../lib/models/user');

describe('Auth API', () => {

  beforeEach(() => dropCollection('users'));

  const testUser = {
    email: 'me@me.com',
    password: 'abc'
  };

  let user = null;

  beforeEach(() => {
    return signupUser(testUser)
      .then(newUser => {

        
        return user = newUser;
      });
  });

  it('signs up a user', () => {
    expect(user.token).toBeDefined();
  });

  it('cannot sign up with same email', () => {
    return request
      .post('/api/auth/signup')
      .send(testUser)
      .expect(400)
      .then(({ body }) => {
        expect(body.error).toBe('Email me@me.com already in use');
      });
  });

  function testEmailAndPasswordRequired(route, testProperty, user) {
    it(`${route} requires ${testProperty}`, () => {
      return request
        .post(`/api/auth/${route}`)
        .send(user)
        .expect(400)
        .then(({ body }) => {
          expect(body.error).toBe('Email and password required');
        });
    });
  }

  testEmailAndPasswordRequired('signup', 'email', { password: 'I no like emails' });
  testEmailAndPasswordRequired('signup', 'password', { email: 'no@password.com' });
  testEmailAndPasswordRequired('signin', 'email', { password: 'I no like emails' });
  testEmailAndPasswordRequired('signin', 'password', { email: 'no@password.com' });

  it('signs in a user', () => {
    return request
      .post('/api/auth/signin')
      .send(testUser)
      .expect(200)
      .then(({ body }) => {
        expect(body.token).toBeDefined();
      });
  });

  function testBadSignup(testName, user) {
    it(testName, () => {
      return request
        .post('/api/auth/signin')
        .send(user)
        .expect(401)
        .then(({ body }) => {
          expect(body.error).toBe('Invalid email or password');
        });
    });
  }

  testBadSignup('rejects bad password', { 
    email: testUser.email,
    password: 'bad password'
  });

  testBadSignup('rejects invalid email', {
    email: 'bad@email.com',
    password: testUser.password
  });

  it('verifies a good token', () => {
    return request
      .get('/api/auth/verify')
      .set('Authorization', user.token)
      .expect(200);
  });

  it('verifies a bad token', () => {
    return request
      .get('/api/auth/verify')
      .set('Authorization', jwt.sign({ foo: 'bar' }, 'shhhhh'))
      .expect(401);
  });

  const sithLord = {
    email: 'evil@jointhedarkside.com',
    password: 'thereCanOnlyBeOne'
  };

  function makeFirstAdmin(admin) {
    return request
      .post('/api/auth/signup')
      .send(admin)
      .expect(200)
      .then(({ body }) => body)
      .then(user => {
        return User.updateById(
          user._id,
          { 
            $addToSet: { 
              roles: 'admin'
            }
          }
        );
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
  it('creates an admin user', () => {
    return makeFirstAdmin(sithLord)
      .then(thing => {
        expect(thing.token).toBeTruthy();
      });
  });

  it('creates an admin and then adds an admin', () => {
    return makeFirstAdmin(sithLord)
      .then(admin => {
        return request
          .put(`/api/auth/users/${user._id}/roles/admin`)
          .set('Authorization', admin.token)
          .send(user)
          .expect(200);
      })
      .then(thing => {
        const { body } = thing;
        expect(body.roles[0]).toBe('admin');
      });
  });

  it('creates an admin and then adds an admin and removes an admin', () => {
    return makeFirstAdmin(sithLord)
      .then(admin => {
        return request
          .put(`/api/auth/users/${user._id}/roles/admin`)
          .set('Authorization', admin.token)
          .send(user)
          .expect(200)
          .then(() => {
            return request
              .delete(`/api/auth/users/${user._id}/roles/admin`)
              .set('Authorization', admin.token)
              .send(user)
              .expect(200);
          })
          .then(thing => {
            const { body } = thing;
            expect(body.favorites[0]).toBe(undefined);
          });
      });
  });
  it('admin users can get users', () => {
    return makeFirstAdmin(sithLord)
      .then(admin => {
        return request
          .get('/api/auth/users')
          .set('Authorization', admin.token)
          .then(({ body }) => {
            expect(body[0].email).toBe('me@me.com');
          });
      });
  });
});

