
/*
 * GET home page.
 */
 
 var ObjectID = require('mongoskin').ObjectID;
 var helper = require('mongoskin').helper;
 
 var users = 'users';
 var decks = 'decks';
 var cards = 'cards';	
 // Testing variable. 
 

exports.index = function (db) {
	return function(req, res){
		if(req.cookies.user == undefined){
			res.clearCookie('userDecks');
			res.clearCookie('count');
			res.location("login");
			res.redirect("/");
		} else {
			var uname = req.cookies.user.username;
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

							db.collection(cards).group(["deck"], {}, { "count" : 0 }, 
								"function(curr, result){ result.count++; }",
								function(err, results) {
									if (err) {
										console.log(err);
									} else {
										var rdyCnts = {};
										console.log(results);

										for(var i = 0; i < results.length; i++){
											rdyCnts[results[i].deck] = results[i].count;
										}
										console.log(rdyCnts);

										res.cookie('user', users);
										res.cookie('userDecks', declist);
										res.cookie('count', rdyCnts);
										res.render('index', {"user": users, "decklist": declist, "counts": rdyCnts});
									}
								}
							);
						}
					});
				}
			});
		}
	};
};