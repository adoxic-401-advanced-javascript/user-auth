const tokenService = require('../token-service');

module.exports = function createEnsureAuth() {
  return (req, res, next) => {
    const token = req.get('Authorization');

    tokenService.verify(token)
      .then(payload => {
        req.user = payload;
        req.user.isAdmin = req.user.roles.includes('admin');
        next();
      })
      .catch(() => {
        next({
          statusCode: 401,
          message: 'Invalid or missing token'
        });
      });
  };
};