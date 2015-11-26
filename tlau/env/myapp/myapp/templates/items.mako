<%inherit file="myapp:templates/template.mako" />
<%def name="title()">Items</%def>
<%def name="head()">
<script>
	var itemID = ${itemID};
</script>
</%def>

<%def name="body()">

<div id="name"> Name
</div>
<p>Manufacture Year :<span id="manufactureYear"></span></p>
<img id="thumbnail" src=""/>


</%def>

<%def name="scripts()">
<script src="${request.static_url('myapp:static/js/items.js')}"></script>
</%def>