<%inherit file="myapp:templates/template.mako" />
<%def name="title()">Home</%def>
<%def name="head()">
<script>
if(window.currentUser && window.currentUser.type ==1){
    if(window.currentUser.employeeType == 0) {
        window.location.href = "/manager/dashboard"
    } else {
        window.location.href = "/employee/dashboard"
    }
}
</script></%def>
<%def name="body()">
<div class="container">
    <div class="itemContainer" id="hotItems">

    </div>
    <div class="fixed-action-btn">
        <a href="auctions/add" class="btn-floating btn-large red">
            <i class="large material-icons">mode_edit</i>
        </a>
        <ul>
            <li><a href="profile" class="btn-floating yellow darken-1"><i class="material-icons">person</i></a></li>
        </ul>
    </div>
</div>
</%def>
<%def name="scripts()">
<script type="text/babel" src="${request.static_url('myapp:static/js/home.jsx')}"></script>
</%def>
