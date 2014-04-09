/*
* Function related to sharing a deck.
*/
 
 var ObjectID = require('mongoskin').ObjectID;
 var helper = require('mongoskin').helper;
 
 // Collection Names. 
 var users = 'users';
 var decks = 'decks';
 var cards = 'cards'; 

 exports.shareDeck = function(db){
 	return function(req, res) {
 		if (req.cookies.user == undefined){
 			res.clearCookie('userDecks');
 			res.clearCookie('count');
 			res.location('login');
 			res.redirect("/");
 		} else {
 			var uname = req.cookies.user.username;
 			var deckname = req.body.deck;
 			var targetname = req.body.targetname;

 			db.collection(decks).find({"owner": targetname, "name": deckname}).toArray(function(err, deck){
 				console.log(deck);
 				if (err){
 					console.log(err);
 				} else if (deck.length !== 0) {
 					console.log("Deck with the same name already exists for this user");
 					res.location("Deck View");
 					res.redirect("/viewdeck/" + deckname);
 				} else {
 					db.collection(decks).insert({"owner": targetname, "name": deckname, "run": 1}, function(err, doc){
 						if (err){
 							console.log(err);
 						} else {
 							console.log("New Deck Inserted for New User");
 							db.collection(cards).find({"user": uname, "deck": deckname}).toArray(function(err, card){
 								if (err) {
 									console.log(err);
 								} else {
 									console.log("Inserting Cards for new user")
 									for (var i = 0; i < card.length; i++){

 										db.collection(cards).insert({user: targetname, deck: deckname, key: card[i].key, answer: card[i].answer, queue: 1, active: 0}, function (err, result) {
											if (err) {
												console.log(err);
											} 
 										});

 									}

 									res.location("Deck View");
 									res.redirect("/viewdeck/" + deckname);
 								}
 							});
 						}
 					});
 				}
 			});

 		}

 	}
 }