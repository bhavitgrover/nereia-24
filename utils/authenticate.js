const passport = require('passport')

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    else res.redirect('/login');
  }

function ensureRole(req,res,next) {
    if(req.user.role === 'diver' || req.user.role === 'researcher'){
        return next();
    }
    else res.redirect('/join');
  }

function forwardAuthenticated(req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
    else{
      res.redirect('/')
    } 
  }

module.exports = { ensureAuthenticated, forwardAuthenticated, ensureRole};