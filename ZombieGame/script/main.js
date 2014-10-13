
$(function() {
	$('#feedback_submit').on('click', submitFeedback);
});

function submitFeedback()
{
	$.post('feedback.php',
		{
			email: $('#feedback_email').val(),
			message: $('#feedback_message').val()
		}, function(data) {
			console.log("This is the data that got sent back from submit feedback:");
			console.log(data);
		});
	
	$('#feedback_sumbitMessage').css('opacity', '1.0').show();
	setTimeout(function() {
		$('#feedback_sumbitMessage').animate( {
			opacity: 0
		}, 2000);
	}, 1000);
}

