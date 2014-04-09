
function strcmp(s1, s2){  
    if (s1.toString() < s2.toString()) return -1;  
    if (s1.toString() > s2.toString()) return 1;  
    return 0;  
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
	var newName = $('editDeckName-'+deck_id).value;
	if(strcmp(key, '') != 0 && strcmp(ans, '') != 0){
		document.getElementById('editdeckform-'+deck_id).submit();
	} else {
		alert("Invalid Deck Name.");
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
}

function submitCardAnswer(){
	document.getElementById('answercard').submit();
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