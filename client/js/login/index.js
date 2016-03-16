$(document).ready(function() {
  var working = false;
  $('.login').on('submit', function(e) {
    e.preventDefault();
    if (working) return;
    working = true;
    var $this = $(this),
      $state = $this.find('button > .state');
    $this.addClass('loading');
    $state.html('Authenticating');
    var inputform = {};
    inputform['username'] = $("[name=username]").val();
    inputform['password'] = $("[name=password]").val();
    $.post('/login', inputform)
      .done(function() {
        $this.addClass('ok');
        $state.html('Welcome back!');
        setTimeout(function() {
          window.location = '/';
        }, 1000);
      })
      .fail(function() {
        $this.removeClass('loading');
        $this.addClass('error');
        $state.html('Oops, login failed!');
      });
  });
});
