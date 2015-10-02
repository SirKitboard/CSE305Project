just fuvking write something phil

Auctions, Employees, Items and Customers
------------------
Auctions, Employees, Customer, and Item are the 4 main entities of our database. The tables list their attributes. In case of Auctions, Customers and Items, the ID is the Primary Key of the table and in case of Employees, the SSN is the Primary Key.

For ItemType in Items, the value can only be one of 'Jewelry', 'DVD', 'Silverware', 'Books', 'Sports', 'Memes', 'Games', 'Electronics', 'People' and 'Other'

The BidsIn Relationship represents shows that a customer can bid on an Item. The bid has a Timestamp of when the bid was made along with the value. The Bids are tracked in the Bids table and are uniquely identified by their BidID.

At the end of an action, the customer with the Highest bid wins the Auction and gets possession of them item. The Wins Relationship references the BidID in the BidsIn Relationship and also lists the time when the customer won the auction.

For Employees table has 2 types which are Manager and Customer Representive. The Manager has can Add, Modify and Delete employee data.

An Employees can help customers by editing their info and they can also add and remove customers. They can also get a list of all the customers.

Customers can search for items to see if they are on Auction. The search is recorded in the Searches Relationship which also keeps track of how many times a customer searched for an item, which will be used for future item suggestions.

Employees can create, edit and delete items.

Employees are involved in the auction process and oversee the auction. They also record the sale at the end of an auction.

Employees can also get a list of items that are won frequently using the Wins Relationship.
