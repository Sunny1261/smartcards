 /*
	Functions related to modifying a deck. 
 */

 var ObjectID = require('mongoskin').ObjectID;
 var helper = require('mongoskin').helper;
 
 // Collection Names. 
 var users = 'users';
 var decks = 'decks';
 var cards = 'cards'; 

// View the entire contents of a deck. 
exports.deckview = function (db)  {
	return function (req, res){
		var deckToShow = req.params.id;
		
		if(req.cookies.user == undefined){
			res.clearCookie('userDecks');
			res.clearCookie('count');
			res.location("login");
			res.redirect("/");
		} else {
			var uname = req.cookies.user.username;
			// Query to retrieve all the cards in a deck.
			db.collection(cards).find({user: uname, deck: deckToShow}).toArray(function (err, cardlist){
				if (err) {
					console.log(err);
				} else {
					res.render('viewdeck', {user: req.cookies.user, "deck": deckToShow, "cardlist": cardlist});
				}
			});

		}
	}
};

exports.adddeck = function (db) {
	return function (req, res) {

		var deckname = req.body.deckname;
		var uname = req.cookies.user.username;
		
		if (deckname) {
			// Query to insert a new deck.
			db.collection(decks).insert({"owner": uname, "name": deckname}, function(err, doc){
				if (err){
					console.log(err);
				} else {
					res.location("index");
					res.redirect("/home");
				}
			});
		}
	}
};

exports.editdeck = function (db) {
	return function (req, res) {

		var deckname = req.body.name;
		var o_id = new ObjectID(req.body.id);
		
		db.collection(decks).update({"_id": o_id}, 
			{$set:{"name": deckname}},
			function(err, doc){
			if (err){
				console.log(err);
			} else {
				res.location("index");
				res.redirect("/home");
			}
		});
	}
};

exports.deletedeck = function (db) {
	return function (req, res) {
		var delDeck = req.params.id;
		var uname = req.cookies.user.username;

		// Query to delete a deck. 
		db.collection(decks).remove({name: delDeck, owner: uname}, function(err, result) {
			res.location("index");
			res.redirect("/home");
		});
	}
};

exports.rundeck = function(db) {
	return function (req, res){
		var deckName = req.params.id;
		var uname = req.cookies.user.username;

		if(req.cookies.user == undefined){
			res.clearCookie('userDecks');
			res.clearCookie('count');
			res.location("login");
			res.redirect("/");
		} else {

			// Query to count number of cards in the deck.
			db.collection(cards).count({user:uname, deck:deckName}, function (err, count) {
				if (err){
					console.log(err);
				} else if (count === 0) {
					console.log("There are zero cards in the deck");
				} else {

					//Query to count the number of active cards in the deck.
					db.collection(cards).count({user:uname, deck:deckName, active:1}, function (err, count) {
						//console.log(count);
						if (err){
							console.log(err);
						} else if (count === 0) {
							// Query to find the current deckrun. 
							db.collection(decks).findOne({owner: uname, name: deckName}, function(err, result){
								if (err){
									console.log(err);
								} else {
									var deckRun = result.run + 1;
									console.log(deckRun);
									if (deckRun > 5){
										deckRun = 1;
									}

									// Query to update the new deckrun. 
									db.collection(decks).update({owner: uname, name: deckName}, {$set:{run:deckRun}}, function (err, result){

										// Query to set the appropriate cards to active.
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

							// Query to get an active card from the deck.
							db.collection(cards).findOne({user: uname, deck: deckName, active: 1}, function(err, result) {
								res.render('viewcard', {user: req.cookies.user, "deck": deckName, "card": result});
							});	
						}
					});
				}
					
			});
 		}
	}
};