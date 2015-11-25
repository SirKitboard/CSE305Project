$('#login').on('click', function(e) {
    var username = $('#username').val();
    var password = $('#password').val();
    var type = $('#isCustomer').is(':checked') ? 0 : 1

    $.ajax({
        url: '/api/login',
        method: 'POST',
        data: {
            username: username,
            password: password,
            type: type
        },
        success: function() {
            console.log('login_success');
            window.location.reload()
        },
        error: function() {
            $('#username').addClass('invalid')
            $('#password').addClass('invalid')
        }
    })
});

$('#username').on('change', function() {
    $('#username').removeClass('invalid')
    $('#password').removeClass('invalid')
});

// $(document).ready(function(){
//     $.ajax({
//         url: 'api/auctions/open',
//         method: 'GET',
//         success: function(response){
//             var something = "<div>HIII</div>";
//             $("#hotItems").html(something);
//         }
//     })
// });

ReactDOM.render(
  <h1>Hello, world!</h1>,
  document.getElementById('hotItems')
);
