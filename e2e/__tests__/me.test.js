const request = require('../request');
const db = require('../db');
const { signupUser } = require('../data-helpers');

describe('me myself and I', () => {
  beforeEach(() => db.dropCollection('users'));
  beforeEach(() => db.dropCollection('birds'));

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

  const barnOwl = {
    name: 'Barn Owl',
    appearance: {
      pattern: 'spotted',
      mainColor: 'Brown'
    },
    wingSpan: 33,
    flying: true,
    scientificClass: {
      Kingdom: 'Animalia',
      Phylum: 'Chordata',
      Class: 'Aves',
      Order: 'Strigiformes',
      Family: 'Tytonidae',
      Genus: 'Tyto',
      Species: 'T. alba'
    },
    diet: ['rodents', 'bats', 'lizards'],
    conservation: 'Least Concern'
  };

  function postBird(bird) {
    return request
      .post(`/api/birds/`)
      .set('Authorization', user.token)
      .send(bird)
      .expect(200);
  }

  it('adds a bird to favorites', () => {
    return postBird(barnOwl)
      .then(({ body }) => {
        return request
          .put(`/api/me/favorites/${body._id}`)
          .set('Authorization', user.token)
          .expect(200)
          .then(({ body }) => {
            expect(body).toEqual([expect.any(String)]);
          });
      });
  });

  it('remove a bird from favorites', () => {
    return postBird(barnOwl)
      .then(({ body }) => {
        return request
          .put(`/api/me/favorites/${body._id}`)
          .set('Authorization', user.token)
          .expect(200)
          .then(({ body }) => {
            return request
              .delete(`/api/me/favorites/${body}`)
              .set('Authorization', user.token)
              .expect(200);
          });
      });
  });

  it('gets favorites', () => {
    return postBird(barnOwl)
      .then(({ body }) => {
        return request
          .put(`/api/me/favorites/${body._id}`)
          .set('Authorization', user.token)
          .expect(200)
          .then(() => {
            return request
              .get(`/api/me/favorites`)
              .set('Authorization', user.token)
              .expect(200)
              .then(({ body }) => {
                expect(body[0].name).toBe('Barn Owl');
              });
          });
      });
  });
});