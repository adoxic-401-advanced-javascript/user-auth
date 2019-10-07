const Bird = require('../bird');
const { ObjectId } = require('mongoose').Types;

describe('schema tests', () => {

  it('validates a bird', () => {
    const barnOwl = {
      name: 'Barn Owl',
      appearance: {
        pattern: 'spotted',
        mainColor: 'Brown'
      },
      wingSpan: 33,
      flying: true,
      scientificClass: {
        Kingdom:	'Animalia',
        Phylum:	'Chordata',
        Class:	'Aves',
        Order:	'Strigiformes',
        Family:	'Tytonidae',
        Genus:	'Tyto',
        Species:	'T. alba'
      },
      diet: ['rodents', 'bats', 'lizards'],
      conservation: 'Least Concern',
      observer: new ObjectId(),
    };

    const bird = new Bird(barnOwl);
    const errors = bird.validateSync();
    expect(errors).toBeUndefined();

    const json = bird.toJSON();
    expect(json).toEqual({
      ...barnOwl,
      _id: expect.any(Object),
    });
  });

  it('adds default', () => {
    const barnOwl = {
      name: 'Barn Owl',
      appearance: {
        pattern: 'spotted',
        mainColor: 'Brown'
      },
      wingSpan: 33,
      scientificClass: {
        Kingdom:	'Animalia',
        Phylum:	'Chordata',
        Class:	'Aves',
        Order:	'Strigiformes',
        Family:	'Tytonidae',
        Genus:	'Tyto',
        Species:	'T. alba'
      },
      diet: ['rodents', 'bats', 'lizards'],
      conservation: 'Least Concern',
      observer: new ObjectId(),
    };

    const bird = new Bird(barnOwl);
    const errors = bird.validateSync();
    expect(errors).toBeUndefined();

    expect(bird.flying).toBe(true);
  });

  it('removes information outside of schema', () => {
    const barnOwl = {
      name: 'Barn Owl',
      appearance: {
        pattern: 'spotted',
        mainColor: 'Brown'
      },
      wingSpan: 33,
      scientificClass: {
        Kingdom:	'Animalia',
        Phylum:	'Chordata',
        Class:	'Aves',
        Order:	'Strigiformes',
        Family:	'Tytonidae',
        Genus:	'Tyto',
        Species:	'T. alba'
      },
      diet: ['rodents', 'bats', 'lizards'],
      conservation: 'Least Concern',
      subTypes: ['T. aurantia', 'T. glaucops'],
      height: 14,
      observer: new ObjectId(),
    };

    const bird = new Bird(barnOwl);
    const errors = bird.validateSync();
    expect(errors).toBeUndefined();

    expect(bird.subTypes).toBe(undefined);
    expect(bird.height).toBe(undefined);
  });
});