$('#login').on('click', function(e) {
    // debugger;
    var username = $('#username').val();
    var password = $('#password').val();
    var type = $('#isCustomer').is(':checked') ? 0 : 1

    $.ajax({
        url: '/api/login',
        method: 'POST',
        data: {
            username: username.toLowerCase(),
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

$("#logout").on('click', function(e) {
    $.ajax({
        url: '/api/logout',
        method: 'GET',
        success: function() {
            console.log('logout');
            window.location.reload()
        },
    })
});

$('#username').on('change', function() {
    $('#username').removeClass('invalid')
    $('#password').removeClass('invalid')
});

$(document).ready(function(){
    $('.modal-trigger').leanModal();
    // debugger;
    if(!window.currentUser) {
        if(window.location.hash == '#modalLogin') {
            // debugger;
            $('#modalLogin').openModal()
        }
    }
});

$("#searchItem").on("keydown", function (e) {        
    if(e.keyCode == 13) {
        window.location = "/items/search?query="+e.target.value;
    }
});


