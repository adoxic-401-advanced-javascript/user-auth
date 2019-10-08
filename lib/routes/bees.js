const router = require('express').Router();
const Bee = require('../models/bee');
const ensureAuth = require('../middleware/ensure-auth');
const ensureRole = require('../middleware/ensure-role');

router
  .get('/', (req, res, next) => {
    Bee.find()
      .then(bees => {
        res.json(bees);
      })
      .catch(next);
  })

  .post('/', ensureAuth(), ensureRole('admin'), (req, res, next) => {

    req.body.observer = req.user.id;

    Bee.create(req.body)
      .then(bee => {
        res.json(bee);
      })
      .catch(next);
  })

  .put('/:id', ensureAuth(), ensureRole('admin'), ({ params, body }, res, next) => {
    Bee.updateOne({
      _id: params.id
    }, body)
      .then(bee => res.json(bee))
      .catch(next);
  })

  .delete('/:id', ensureAuth(), ensureRole('admin'), (req, res, next) => {
    Bee.findByIdAndRemove(req.params.id)
      .then(removed => {
        res.json(removed);
      })
      .catch(next);
  });

module.exports = router;