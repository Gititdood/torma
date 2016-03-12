


$( document ).ready(function() {
    var working = false;
	$('.login').on('submit', function(e) {
	  e.preventDefault();
	  if (working) return;
	  working = true;
	  var $this = $(this),
		$state = $this.find('button > .state');
	  $this.addClass('loading');
	  $state.html('Authenticating');
	  setTimeout(function() {
		$this.addClass('ok');
		$state.html('Welcome back!');
		setTimeout(function() {
			var inputform = {};
			inputform['username'] = $("#username").val();
			inputform['password'] = $("#password").val();
			
		  $.post( "/login", inputform, function( data ) {
			  alert(data);
			});
		}, 1000);
	  }, 1000);
	});
});

