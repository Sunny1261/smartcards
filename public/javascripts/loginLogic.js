
$(document).ready( function() {
	$('#register').click( function() {
        $('#login_form').attr('action', 'adduser');
        $('#loginButton').attr('Value', 'Register');
        $('#login_status').html('');
        $('#user_email').show();
        $('#password2').show();
        $('#cancel').show();
        $(this).hide();
    });

	$('#cancel').click( function() {
        $('#login_form').attr('action', 'loginuser');
        $('#loginButton').attr('Value', 'Login');
        $('#login_status').html('');
        $('#user_email').hide();
        $('#password2').hide();
        $('#register').show();
        $(this).hide();
    });

});