<%inherit file="myapp:templates/template.mako" />
<%def name="title()">Profile</%def>
<%def name="head()">
<link href="${request.static_url('myapp:static/css/profile.css')}" rel="stylesheet">
</%def>
<%def name="body()">
    <div id="profileContainer" class="container">
    </div>
    <div id="modalUpdate" class="modal">
        <div class="modal-content container">
            <div id="updateContainer"></div>
        </div>
    </div>

</%def>
<%def name="scripts()">
<script type="text/babel" src="${request.static_url('myapp:static/js/customerEdit.jsx')}"></script>
<script type="text/babel" src="${request.static_url('myapp:static/js/profile.jsx')}"></script>
</%def>
