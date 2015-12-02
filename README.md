Totally Legit Online Auctions
===============================

Sample Credentials:
--------------------
1. Customer : john_smith, password
2. Employees : david_warren, password
3. Manager : david_smith, password

To update database:
--------------------
1. Go to myapp directory in the vagrant server app/env/myapp
2. Run `mysql --user=root --password=SmolkaSucks69 < bak.sql`

To run:
----------
1. `vagrant up cse`
2. `vagrant ssh cse`

This will spin up a server on port 8081 on localhost

To sync/update:
---------------
1. Go to env folder
2. Run `source bin/activate`
3. Go to myapp folder
4. Run `python setup.py develop`
5. Run `pserve development.ini`
6. View on port 5000 of localhost

To check error logs:
---------------------
1. Go to /var/logs/apache2
2. If permission denied
    * Go to /var/logs
    * Run `chmod -R 755 apache2`
    * Go to /var/logs/apache2
3. Run `tail -f error.log`

To exit:
-----------
1. Run `deactivate`

To quit VM:
-------------
1. `vagrant halt cse`
