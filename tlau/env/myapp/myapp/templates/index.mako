<%inherit file="myapp:templates/template.mako" />
<%def name="title()">Index</%def>
<%def name="head()"></%def>
<%def name="body()">
    <div class="row">
        <div class="col s12">
            <h1>Hot Items</h1>
            <div class="itemContainer" id="hotItems">

            </div>
        </div>
    </div>
    <div class="fixed-action-btn">
        <a class="btn-floating btn-large red">
            <i class="large material-icons">mode_edit</i>
        </a>
        <ul>
            <li><a class="btn-floating red"><i class="material-icons">insert_chart</i></a></li>
            <li><a class="btn-floating yellow darken-1"><i class="material-icons">format_quote</i></a></li>
            <li><a class="btn-floating green"><i class="material-icons">publish</i></a></li>
            <li><a class="btn-floating blue"><i class="material-icons">attach_file</i></a></li>
        </ul>
    </div>
</%def>
<%def name="scripts()">
<script type="text/babel" src="${request.static_url('myapp:static/js/home.jsx')}"></script>
</%def>
