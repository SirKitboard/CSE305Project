<%inherit file="myapp:templates/template.mako" />
<%def name="title()">Index</%def>

<%def name="body()">
    <div class="row">
        <div class="col s12">
            <h1>Hot Items</h1>
            <div class="card">
                <div class="card-image">
                    <span class="card-title">Card Title</span>
                </div>
                <div class="card-content">
                    <p>I am a very simple card. I am good at containing small bits of information.
                        I am convenient because I require little markup to use effectively.</p>
                </div>
                <div class="card-action">
                    <a href="#">This is a link</a>
                </div>
            </div>
        </div>
    </div>
</%def>
