$('#name').click(function() {
	console.log('HIIII');
	$.ajax({
		url: '/api/items/'+itemID,
		method: 'GET',
		success : function(response) {
			$("#name").html(response.name);
			$("#manufactureYear").html(response.manufactureYear);
			$("#thumbnail").attr('src', response.images[0]);
		}
	})
});