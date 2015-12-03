<%inherit file="myapp:templates/template.mako" />
<%def name="title()">Manager Dashboard</%def>
<%def name="head()">
<link href="${request.static_url('myapp:static/css/managerDashboard.css')}" rel="stylesheet">
</%def>
<%def name="body()">
    <div class="container template">
    <div class="row">
    <div id="navBar" class="col s12">
      <ul class="tabs z-depth-1">
        <li class="tab col s3"><a class="active" href="#employeesTab">Employees</a></li>
        <li class="tab col s3"><a href="#salesTab">Sales</a></li>
        <li class="tab col s3"><a href="#itemsTab">Items</a></li>
        <li class="tab col s3"><a href="#revenueTab">Revenue</a></li>
        <div class="indicator white" style="z-index:1"></div>
      </ul>
    </div>
    <div id="employeesTab" class="container"></div>
    <div id="salesTab" class="container">Test 2</div>
    <div id="itemsTab" class="container">Test 3</div>
    <div id="revenueTab" class="container">Test 4</div>
    </div>
    </div>
</%def>
<%def name="scripts()">
<script type="text/babel" src="${request.static_url('myapp:static/js/managerDashboard/sales.jsx')}"></script>
<script type="text/babel" src="${request.static_url('myapp:static/js/managerDashboard/employees.jsx')}"></script>
<script type="text/babel" src="${request.static_url('myapp:static/js/managerDashboard/items.jsx')}"></script>
<script type="text/babel" src="${request.static_url('myapp:static/js/selectItem.jsx')}"></script>
<script type="text/babel" src="${request.static_url('myapp:static/js/managerDashboard/revenue.jsx')}"></script>
</%def>
