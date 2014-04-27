
function strcmp(s1, s2){  
    if (s1.toString() < s2.toString()) return -1;  
    if (s1.toString() > s2.toString()) return 1;  
    return 0;  
}

function getCookie(NameOfCookie){ 
	if (document.cookie.length > 0) {
		begin = document.cookie.indexOf(NameOfCookie+"="); 
		if (begin != -1) { 
			begin += NameOfCookie.length+1; 
			end = document.cookie.indexOf(";", begin);
			if (end == -1) 
				end = document.cookie.length;
			return unescape(document.cookie.substring(begin, end)); 
		} 
	}
	return null; 
}

function showRenameDeckForm(deck_id){
	$('#deck-'+deck_id).hide();
	$('#editDeck-'+deck_id).show();
}

function hideRenameDeckForm(deck_id){
	$('#deck-'+deck_id).show();
	$('#editDeck-'+deck_id).hide();
}

function renameDeck(deck_id){
	var newName = $('#editDeckName-'+deck_id).value;
	if(strcmp(key, '') != 0 && strcmp(ans, '') != 0){
		document.getElementById('editdeckform-'+deck_id).submit();
	} else {
		alert("Invalid Deck Name.");
	}
}

function searchUsersDisplayResults(){
	var user_string = document.getElementById('user_str').value;
	//console.log("search string = "+user_string);
	$.ajax({
		url: "/searchUsers/"+user_string,
		type: "get",
		dataType: "json",
		contentType: "application/json",

		success: function(data) {
		  	//console.log(data['results']);
		  	var matches = data['results'];
		  	var resultsHTML = '<h3>Which one?</h3>';

		  	for(var i = 0; i < matches.length; i++){
				//console.log(matches[i]);
		  		resultsHTML += '<a class="btn-primary btn userResultBtn" onclick="shareToUser(\''+matches[i]['username']+'\')"> '+matches[i]['username']+' </a>';
		  	}

		  	$('#userSearchResults').html(resultsHTML);

		  	//console.log('process success');
		},

		error: function() {
		  	console.log('user search error');
		}
	});
}

function shareToUser(username){
	// put username in form
	document.getElementById('user_str').value = username;
	// disable search
	$('#searchUsersBtn').attr({'disabled': 'disabled'});
	// enable share submit button
	$('#shareSubmit').removeAttr('disabled');
}

function shareDeckSubmitForm(){
	document.getElementById('shareDeckForm').submit();
}

function runDeckCheck(deck_name, card_count){
	console.log(card_count);
	if(card_count > 0){
		window.location.href = "/rundeck/" + deck_name;
	} else {
		alert("No cards to run through!\nCreate cards to use");
	}
}

function clearShareForm(){
	document.getElementById('user_str').value = '';
	$('#searchUsersBtn').removeAttr('disabled');
	$('#shareSubmit').attr({'disabled': 'disabled'});
	$('#userSearchResults').html('');


}

function togglePerformanceView(){
	var cards = document.getElementsByClassName('liveCard');
	var state = strcmp(document.getElementById('perfToggle').attributes.state.value, "OFF") == 0 ? 0 : 1;

	if(state == 0){
		document.getElementById('perfToggle').value = "Performance Toggle: ON";
		document.getElementById('perfToggle').attributes.state.value = "ON"
		$('#performanceKey').html('<img src="/img/performance-key.jpg" alt="Performance Color Key" style="padding-bottom: 10px; padding-top: 10px;" />');
	} else {
		document.getElementById('perfToggle').value = "Performance Toggle: OFF";
		document.getElementById('perfToggle').attributes.state.value = "OFF"
		$('#performanceKey').html('');
	}

	for(var i = 0; i < cards.length; i++){
		if(state == 0){
			var right = parseInt(cards[i].attributes.right.value);
			var wrong = parseInt(cards[i].attributes.wrong.value);
			var rate = right/(right+wrong); 
			if(right == 0 && wrong == 0){
				$('#card-'+cards[i].attributes.name.value).css("background-color", "rgba(255, 255, 255, .8)");
			} else if(rate <= .2){
				// #FF0000
				$('#card-'+cards[i].attributes.name.value).css("background-color", "rgb(255, 0, 0)");
			} else if(rate <= .4){
				// #FF6600
				$('#card-'+cards[i].attributes.name.value).css("background-color", "rgb(255, 102, 0)");
			} else if(rate <= .6){
				// #FFCC00
				$('#card-'+cards[i].attributes.name.value).css("background-color", "rgb(255, 204, 0)");
			} else if(rate <= .8){
				// #9ECC00
				$('#card-'+cards[i].attributes.name.value).css("background-color", "rgb(158, 204, 0)");
			} else {
				// #00CC00
				$('#card-'+cards[i].attributes.name.value).css("background-color", "rgb(0, 204, 0)");
			}
		} else {
			$('#card-'+cards[i].attributes.name.value).css("background-color", "rgba(255, 255, 255, .8)");
		}
	}
}

function revealAnswer(id){
	var use = "#"+id;
	$("#"+id).show();
}

function editCard(id){
	$("#editCard-"+id).show();
	$("#card-"+id).hide();
}

function hideEditForm(id){
	$("#editCard-"+id).hide();
	$("#card-"+id).show();
}

function saveCardChanges(id){
	var key = document.getElementById('editKey-'+id).value;
	var ans = document.getElementById('editAnswer-'+id).value;

	if(strcmp(key, '') != 0 && strcmp(ans, '') != 0){
		document.getElementById('editcardform-'+id).submit();
	} else {
		alert("Invalid Question/Key or Answer.");
	}
}

function saveNewCard(){
	var key = document.getElementById('newCardKey').value;
	var ans = document.getElementById('newCardAnswer').value;

	if(strcmp(key, '') != 0 && strcmp(ans, '') != 0){
		document.getElementById('createcardform').submit();
	} else {
		alert("Invalid Question/Key or Answer.");
	}
}

function clearCreateForm(){
	document.getElementById('newCardKey').value = '';
	document.getElementById('newCardAnswer').value = '';
}

function clearCreateDeckForm(){
	document.getElementById('newDeckName').value='';
}

function createNewDeck(){
	var name = document.getElementById('newDeckName').value;
	if(strcmp(name, '') == 0){
		alert("Enter name of deck to create");
	} else {
		document.getElementById('newdeck').submit();
	}
}

function checkAndRevealAnswer(){
	var user_ans = document.getElementById('userAnswer').value;
	var correct_ans = document.getElementById('correctAnswer').value;
	if(strcmp(user_ans, correct_ans) == 0){
		$(".result").html('<h2> CORRECT! :)</h2>');
	} else {
		$(".result").html('<h2> INCORRECT! :(</h2>');
	}
	$('.currentCardSubmit').attr({'disabled': 'disabled'});
	$(".revealAnswer").show();

	$.ajax({
		type: 'POST',
		url: '/answercard',
		data: $('#answercard').serialize(), 
		success: function(response) { 
			console.log(response);
		},
		error: function(err){
			console.log(err);
		}
	});
}

function submitCardAnswer(deck_name){
	window.location.href = "/rundeck/" + deck_name;
}

function clearPreferencesForm(){
	$('#username').value = $('#orig_username').value;
	$('#useremail').value = $('#orig_useremail').value;
}

function validateAndUpdateUserPreferences(){
	var new_uname = $('#username').value;
	var new_email = $('#useremail').value;

	if(strcmp(new_uname, '') == 0 || strcmp(new_email, '') == 0){
		alert("Invalid value for Username and/or Email");
	} else {
		$('userPreferencesForm').submit();
	}
}