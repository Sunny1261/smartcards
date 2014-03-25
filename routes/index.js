
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
						res.render('index', {"userlist": users, "decklist": declist});
					}
				});
			}
		});
	};
};

exports.deckview = function (db)  {
	return function (req, res){
		var deckToShow = req.params.id;
		
		db.collection(cards).find({user: uname, deck: deckToShow}).toArray(function (err, cardlist){
			if (err) {
				console.log(err);
			} else {
				//console.log(cardlist);
				res.render('viewdeck', {"deck": deckToShow, "cardlist": cardlist});
			}
		});
	}
};

exports.adddeck = function (db) {
	return function (req, res) {
		var deckname = req.body.deckname;
		
		if (deckname) {
			db.collection(decks).insert({"owner": uname, "name": deckname}, function(err, doc){
				if (err){
					console.log(err);
				} else {
					res.location("index");
					res.redirect("/");
				}
			});
		}
	}
};

exports.deletedeck = function (db) {
	return function (req, res) {
		var delDeck = req.params.id;
		
		db.collection(decks).remove({name: delDeck, owner: uname}, function(err, result) {
			res.location("index");
			res.redirect("/");
		});
	}
};

exports.addcard = function (db) {
	return function (req, res) {
		var cardKey = req.body.key;
		var cardAns = req.body.answer;
		var cardDeck = req.body.deck;
		
		console.log(cardKey);
		console.log(cardAns);
		console.log(cardDeck);
		
		if (cardKey && cardAns){			
			db.collection(cards).insert({user: uname, deck: cardDeck, key: cardKey, answer: cardAns, queue: 1, active: 0}, function (err, result) {
				if (err) {
					console.log(err);
				} else {
					res.location("cards");
					res.redirect("/viewdeck/" + cardDeck);
				}
			});
		}
	}
};

exports.deletecard = function (db) {
	return function (req, res) {
		var cardId = req.params.id;
		var cardDeck = req.params.deckname;
		
		console.log(cardId);
		console.log(cardDeck);
		
		db.collection(cards).removeById(cardId, function(err, result){
			if (err) {
				console.log(err);
			} else {
				res.location("cards");
				res.redirect("/viewdeck/" + cardDeck);
			}
		});
	}
};

exports.rundeck = function(db) {
	return function (req, res){
		var deckName = req.params.id;

		db.collection(cards).count({user:uname, deck:deckName}, function (err, count) {
			if (err){
				console.log(err);
			} else if (count === 0) {
				console.log("There are zero cards in the deck");
			} else {
				console.log("Run out of Active Decks");
				db.collection(cards).count({user:uname, deck:deckName, active:1}, function (err, count) {
					console.log(count);
					if (err){
						console.log(err);
					} else if (count === 0) {
						db.collection(decks).findOne({owner: uname, name: deckName}, function(err, result){
							if (err){
								console.log(err);
							} else {
								var deckRun = result.run + 1;
								console.log(deckRun);
								if (deckRun > 5){
									deckRun = 1;
								}

								db.collection(decks).update({owner: uname, name: deckName}, {$set:{run:deckRun}}, function (err, result){
									db.collection(cards).update({user:uname, deck:deckName, queue: {$lte: deckRun}}, {$set:{active:1}},{multi: true},  function (err, result){
										if (err) {
											console.log(err);
										}
										else {
											res.location("viewcard");
											res.redirect("/rundeck/" + deckName);
										}
									})
								});

							}
						});
					} else {
						db.collection(cards).findOne({user: uname, deck: deckName, active: 1}, function(err, result) {
							//var cardKey = result.key;
							res.render('viewcard', {"deck": deckName, "card": result});
						});	
					}
				});
			}
				
		});
	}
};

exports.answercard = function(db) {
	return function (req, res) {
		var cardId = req.body.cardId;
		var ans = req.body.answer;
		var deckName = req.body.deck;

		console.log(cardId);
		console.log(ans);
		console.log(deckName);
		console.log(uname);
		db.collection(cards).findById(cardId, function(err, result){
			if (err){
				console.log(err);
			} else {
				var newQueue = result.queue;
				if (result.answer === ans){
					newQueue++;
				} else  {
					newQueue = 1;
				}

				if (newQueue>5){
					newQueue=5;
				}

				db.collection(cards).updateById(cardId, {$set:{queue:newQueue,active:0}}, function(err, result){
					if (err){
						console.log(err);
					} else {
						res.location("viewcard");
						res.redirect("/rundeck/" + deckName);
					}
				});
			}
		});
	}
};