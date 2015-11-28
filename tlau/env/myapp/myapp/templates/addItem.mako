<%inherit file="myapp:templates/template.mako" />
<%def name="title()">Add Item</%def>
<%def name="head()">
</%def>
<%def name="body()">
    <div id="addItemContainer" class="container">
    </div>
</%def>
<%def name="scripts()">
<script type="text/babel" src="${request.static_url('myapp:static/js/addItem.jsx')}"></script>
</%def>
