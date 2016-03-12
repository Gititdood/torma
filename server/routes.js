var express = require('express');
var router = express.Router();
var User = require('./db/user');

/*
  This is same as app.get('/'...)
  but more modular
*/


router.get('/', function(req, res) {
  res.render('home');
});

router.get('/login', req =>
  req.res.render('login'));

router.post('/login', (req, res, next) => {
  var form = req.body;
  console.log(req.body.username);
  User.findByUsername(req.body.username, function(err, user) {
    if (err) return next(err);
    if (!user) {
      // user does not exist. lets create and sign up
      user = new User({ username: form.username });
      user.savePassword(req.body.password, function(err, user) {
        if (err) return next(err);
        req.login(user, function(err) {
          if (err) return next(err);
          //res.send('login successful');
          // or 
		  res.render('home');
        });
      });
    } else {
      // user exists
      user.verifyPassword(req.body.password, function(err, res) {
        if (err) return next(err);
        if (res !== true) return next(new Error('Incorrect password'));
        req.login(user, function(err) {
          if (err) return next(err);
          //res.send('login successful');
          res.render('home');
        });
      });
    }
  });
});

/*
sidenote: With ES7 async/await & promises the above could simply be written as:

router.post('/login', (req, res, next) => {
  var form = req.body;
  var user = await User.findOneAsync({ username: form.username });
  if (!user) {
    user = new User({ username: form.username });
    await user.savePassword(form.password);
  }
  if (true !== await user.verifyPassword(form.password)) {
    return next(new Error('Incorrect password'));
  }
  await req.loginAsync(user);
  res.send('login successful');
});

*/

router.get('/logout', req => {
  req.logout(function(err) {
    if (err) return next(err);
    res.redirect('/');
  });
});


module.exports = router;
