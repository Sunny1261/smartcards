
/*
 * GET home page.
 */
 
 var ObjectID = require('mongoskin').ObjectID;
 var helper = require('mongoskin').helper;
 
 var users = 'users';
 var decks = 'decks';
 var cards = 'cards';	
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

									res.render('index', {"userlist": users, "decklist": declist, "counts": rdyCnts});
								}
							}
						);
					}
				});
			}
		});
	};
};