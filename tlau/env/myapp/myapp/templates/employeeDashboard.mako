<%inherit file="myapp:templates/template.mako" />
<%def name="title()">Employee Dashboard</%def>
<%def name="head()">
<link href="${request.static_url('myapp:static/css/employeeDashboard.css')}" rel="stylesheet">
</%def>
<%def name="body()">
    <div class="container template">
        <div class="row">
        <div id="navBar" class="col s12">
          <ul class="tabs z-depth-1">
            <li class="tab col s3"><a class="active" href="#customersTab">Customers</a></li>
            <li class="tab col s3"><a href="#salesTab">Sales</a></li>
            <li class="tab col s3"><a href="#mailingListTab">Mailing List</a></li>
            <div class="indicator white" style="z-index:1"></div>
          </ul>
        </div>
        <div id="customersTab" class="container"></div>
        <div id="salesTab" class="container">Test 2</div>
        <div id="mailingListTab" class="container">Test 3</div>
        </div>
    </div>
</%def>
<%def name="scripts()">
<script type="text/babel" src="${request.static_url('myapp:static/js/customerEdit.jsx')}"></script>
<script type="text/babel" src="${request.static_url('myapp:static/js/employeeDashboard/customers.jsx')}"></script>
<script type="text/babel" src="${request.static_url('myapp:static/js/employeeDashboard/sales.jsx')}"></script>
<script type="text/babel" src="${request.static_url('myapp:static/js/employeeDashboard/mailingList.jsx')}"></script>

</%def>
