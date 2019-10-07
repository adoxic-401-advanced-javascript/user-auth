const request = require('../request');
const db = require('../db');
const { signupUser } = require('../data-helpers');

describe('bird api', () => {
  beforeEach(() => {
    return db.dropCollection('users');
  });
  beforeEach(() => {
    return db.dropCollection('birds');
  });

  let user = null;
  beforeEach(() => {
    return signupUser().then(newUser => {
      return (user = newUser);
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
      .post('/api/birds')
      .send(bird)
      .expect(200)
      .then(({ body }) => body);
  }

  it('posts a bird for a user', () => {
    return request
      .post(`/api/birds/`)
      .set('Authorization', user.token)
      .send(barnOwl)
      .expect(200)
      .then(({ body }) => {
        console.log(body);
        expect(body.observer).toBe(user._id);
        expect(body).toMatchInlineSnapshot(
          {
            _id: expect.any(String),
            observer: expect.any(String)
          },
          `
          Object {
            "__v": 0,
            "_id": Any<String>,
            "appearance": Object {
              "mainColor": "Brown",
              "pattern": "spotted",
            },
            "conservation": "Least Concern",
            "diet": Array [
              "rodents",
              "bats",
              "lizards",
            ],
            "flying": true,
            "name": "Barn Owl",
            "observer": Any<String>,
            "scientificClass": Object {
              "Class": "Aves",
              "Family": "Tytonidae",
              "Genus": "Tyto",
              "Kingdom": "Animalia",
              "Order": "Strigiformes",
              "Phylum": "Chordata",
              "Species": "T. alba",
            },
            "wingSpan": 33,
          }
        `
        );
      });
  });

  it('gets a list of birds', () => {
    return Promise.all([
      postBird({
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
      }),
      postBird({
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
      }),
      postBird({
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
      })
    ])
      .then(() => {
        return request.get('/api/birds').expect(200);
      })
      .then(({ body }) => {
        expect(body.length).toBe(3);
      });
  });
});
