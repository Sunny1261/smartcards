
/*
 * GET users listing.
 */

// Collection Names. 
var users = 'users';
var decks = 'decks';
var cards = 'cards'; 

function strcmp(s1, s2){  
    if (s1.toString() < s2.toString()) return -1;  
    if (s1.toString() > s2.toString()) return 1;  
    return 0;  
}

exports.list = function(req, res){
  res.send("respond with a resource");
};

exports.loggedInCheck = function(db){
	return function(req, res){	
		// check req cookies
		if(req.cookies.user != undefined){
			res.location("index");
			res.redirect("/home");
		} else {
			res.clearCookie('user');
			res.clearCookie('userDecks');
			res.clearCookie('count');
			res.render('login', {errorMsg: ''});
		}
	}
};

exports.login = function(db){
	return function(req, res){
		//check that username / password combo exists
		var uname = req.body.username;
		var pw = req.body.password;

		db.collection(users).find({username: uname, password: pw}, {password: 0}).toArray(function (err, users){
			if (err){
				console.log(err);
			} else {
				if(users.length == 0){
					res.location("login");
					res.render('login', {errorMsg: "Invalid Username / Password Combination"});
				} else {
					console.log(users[0]);
					res.cookie('user', users[0]);
					res.location("index");
					res.redirect("/home");
				}
			}
		});
	}
}

exports.adduser = function (db) {
	return function (req, res) {	
		var username = req.body.username;
		var email = req.body.email;
		var password = req.body.password;
		var verify_password = req.body.verify_password;

		if(strcmp(username, '') == 0 || strcmp(email, '') == 0 || strcmp(password, '') == 0){
			res.location("login");
			res.render('login', {errorMsg: "Register Error: All fields are required."});
		} else {

			db.collection(users).find({email: email}).toArray(function (err, emailMatches){
				if(err){
					console.log(err);
				} else if(emailMatches.length > 0){
					res.location("login");
					res.render('login', {errorMsg: "Register Error: Email "+email+" already registered"});
				} else {

					db.collection(users).find({username: username}).toArray(function(err, usernameMatches){
						if(err){
							console.log(err);
						} else if(usernameMatches.length > 0){
							res.location("login");
							res.render('login', {errorMsg: "Username "+username+" taken. Choose a different username"});
						} else {
							if(strcmp(password, verify_password) != 0){
								res.location("login");
								res.render('login', {errorMsg: "Passwords don't match"});
							} else {
								db.collection(users).insert({username: username, email: email, password: password}, function(err, doc){
									if (err){
										console.log(err);
									} else {
										doc[0].password = null;
										console.log(doc[0]);
										res.cookie('user', doc[0]);
										res.location("index");
										res.redirect("/home");
									}
								});
							}
						}
					});
				}
			});
		}
	}
};

exports.logout = function(db){
	return function(req, res){
		res.clearCookie('user');
		res.clearCookie('userDecks');
		res.clearCookie('count');
		res.redirect("/");
	}
}