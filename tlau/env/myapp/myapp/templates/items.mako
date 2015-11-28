<%inherit file="myapp:templates/template.mako" />
<%def name="title()">Items</%def>
<%def name="head()">
<link href="${request.static_url('myapp:static/css/items.css')}" rel="stylesheet">
<script>
	var itemID = ${itemID};
</script>
</%def>

<%def name="body()">
<div id="itemContainer" class="container">

</div>
</%def>

<%def name="scripts()">
<script type="text/babel" src="${request.static_url('myapp:static/js/imageScroller.jsx')}"></script>
<script type="text/babel" src="${request.static_url('myapp:static/js/items.jsx')}"></script>
</%def>
