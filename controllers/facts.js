var Student = require('../models/student');

module.exports = {
  create: create,
  delete: del
};

function create(req, res, next) {
  req.user.facts.push({text: req.body.fact});
  req.user.save(function(err) {
    if (err) return next(err);
    res.status(200).json(req.user);
  });
}

function del(req, res) {

}
