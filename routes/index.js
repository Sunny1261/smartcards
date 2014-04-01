
/*
 * GET home page.
 */
 
 var ObjectID = require('mongoskin').ObjectID;
 var helper = require('mongoskin').helper;
 
 var users = 'users';
 var decks = 'decks';
 var cards = 'cards';	
 var name = '';
 // Testing variable. 
 
 var uname = 'Sunny1261';
 

exports.index = function (db) {
	return function(req, res){
		db.collection(users).find({username: uname}).toArray(function (err, users){
			if (err){
				console.log(err);
			} else {
				console.log(users);
				db.collection(decks).find({owner: uname}).toArray(function (err, declist){
					if (err) {
						console.log(err);
					} else {
						console.log(declist);
						console.log(declist.length);
						
						res.render('index', {"userlist": users, "decklist": declist});
					}
				});
			}
		});
	};
};