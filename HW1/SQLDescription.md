### Items Table

The items table lists all the attributes of an item. The item type is of domain Item types which contains the values 'Jewelry', 'DVD', 'Silverware', 'Books', 'Sports', 'Memes', 'Games', 'Electronics', 'People', 'Other'.

The ItemID is the Primary Key for this table because no 2 items can have the same ID. ID is also auto incremented by 1 everytime a new entry is added.

When the item entry is added, it has no stock and no copies sold hence their value is defaulted to 0

### Customers table

The items table lists all the attributes of an item.

The ID is the primary key for the table and is autoincremented.

Most of the keys in this table are required so that we dont have empty profiles for a customer.

We use a 0 to 5 rating system. Every customer starts with an average rating of 3 and based on their sell and purchase history the rating either goes up or down.

### Employee Table

Much like the Customer Table, most of the keys in the Employees table are required. Since Employees dont have an ID, we use the SSN as the primary key.

Employees are of 3 types, which are Manager, Customer Representative or other.

### Auction Table

Auction table has ID as the primary key and is autoincremented.
The auction table references the Items, Customers and Employees table using their ID as the foreign key.
The Auction will be deleted if the Item or the items seller is deleted.
If the buyer is deleted then no action is performed.

### Bids table

The Bids table lists all the bids and references the Customers who made the bid using the ID as the foreign key and the Auction in which the bid was made using the AuctionID. It also contains the time of when the bid was made and value of the bid. The bid ID is the primary key and is autoincremented. Since a customer can make multiple bids in an auction, the CustomerID and the AuctionID are not primary but are foreign keys.
If a customer is deleted then their bidding history is also deleted.
If the auction is deleted then all the bids in that auction are also deleted.

### Wins table

Wins table lists all the purchases or "victories" in an auctions. It references the BidID in the Bids table and the CustomerID and AuctionID in their respective tables.
If the bid is deleted then we dont want to delete the wins because the wins act as a purchase history for the Customers. Same goes for when an Auction is deleted. This is because if the customer who made the auction is deleted then auction will be deleted but the winner of the auction still needs his auction history.

### Searches table

The searches table keeps track of what people search for and how frequently an item is searched for.
It references the customerID to see who searched and it also the itemID of what they searched.
If the customer is deleted then all their search is also deleted, and if an item is deleted all associated searches are deleted
