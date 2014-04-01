  /*
	Functions related to modifying a card. 
 */

 var ObjectID = require('mongoskin').ObjectID;
 var helper = require('mongoskin').helper;
 
 // Collection Names. 
 var users = 'users';
 var decks = 'decks';
 var cards = 'cards'; 
 
 // Default Username. 
 var uname = 'Sunny1261';

// Deleting a card. 
exports.deletecard = function (db) {
	return function (req, res) {
		var cardId = req.params.id;
		var cardDeck = req.params.deckname;
		
		console.log(cardId);
		console.log(cardDeck);
		
		// Query to delete the deck.
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

//  Add a new card to the deck.
exports.addcard = function (db) {
	return function (req, res) {
		var cardKey = req.body.key;
		var cardAns = req.body.answer;
		var cardDeck = req.body.deck;
		
		console.log(cardKey);
		console.log(cardAns);
		console.log(cardDeck);
		
		// Check for blanks.
		if (cardKey && cardAns){

			//	Query to insert a card into the database. 
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

// Submitting an answer to a card.
exports.answercard = function(db) {
	return function (req, res) {
		var cardId = req.body.cardId;
		var ans = req.body.answer;
		var deckName = req.body.deck;

		// Query to find the card and get the answer. 
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

				// Query to update the card's active and queue values.
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