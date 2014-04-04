
/*
 * GET users listing.
 */

exports.list = function(req, res){
  res.send("respond with a resource");
};

exports.loginCheck = function(db){
	return function(req, res){	
		// check req cookies
		if(req.cookies.user != undefined){
			res.location("index");
			res.redirect("/home");
		} else {
			res.clearCookie('user');
			res.clearCookie('userDecks');
			res.clearCookie('count');
			res.render('login');
		}
	}
};

exports.login = function(db){
	return function(req, res){
		//check that username / password combo exists
		//log user in
	}
}

exports.adduser = function (db) {
	return function (req, res) {

		var username = req.body.username;
		var email = req.body.email;
		var password = req.body.password;
		var verify_password = req.body.verify_password;

		// check if email already registered
		// then check that the username is available
		// then validate the passwords are the same

		// then add user and log user in
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