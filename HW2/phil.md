**Find bid history for an auction**
	START TRANSACTION;
		SELECT * 
		FROM Bids 
		WHERE AuctionID = ?aID;
	COMMIT;

?aID = the ID of the Auction you want to see the bid history of

![Bid History](/images/bid_history.png)

**Find current and past auctions a customer has taken part in**

	START TRANSACTION;
		SELECT * 
		FROM Auctions 
		WHERE ID IN (
			SELECT AuctionID 
			FROM Bids 
			WHERE CustomerID = ?custID
		);
	COMMIT;

?custID = the ID of the Customer you want see the current/past auctions of 

![Auction History](/images/current_past_auctions.png)

**Items sold by a given seller and corresponding auction info**

	START TRANSACTION;
		SELECT * 
		FROM Auctions 
		WHERE SellerID = ?sellerID;
	COMMIT;
	
?sellerID = the ID of the customer who's sold 

![Seller History](/images/seller_history.png)

**Items available of a particular type and corresponding auction info**

	START TRANSACTION;
		SELECT * 
		FROM Auctions 
		WHERE ItemID IN (
			SELECT ID
			FROM Items 
			WHERE Type = ?itemType
		);
	COMMIT;

?itemType = the type of the Item you want to see auctions for (e.g. 'DVD', 'Car')

![Type Auctionss](/images/item_type.png)

**Items available with a particular keyword or set of keywords in the item name, and corresponding auction info**

	START TRANSACTION;
		SELECT * 
		FROM Auctions 
		WHERE ID IN (
			SELECT ID 
		  	FROM Items 
		  	WHERE Name 
		  	LIKE '%?keyword%'
		);
	COMMIT;
	
?keyword = the keywords you want to match

**Best-Seller list**

	START TRANSACTION;
		SELECT Name 
		FROM Items 
		WHERE ID IN (
		  SELECT ItemID 
		  FROM Auctions 
		  WHERE ID IN (
		    SELECT AuctionID 
		    FROM Wins
		  )
		);
	COMMIT;

**Personalized item suggestion list**

	START TRANSACTION;
		SELECT Name 
		FROM Items 
		WHERE Type IN (
		  SELECT Type 
		  FROM Items 
		  WHERE ID IN (
		    SELECT ItemID 
		    FROM Searches 
		    WHERE CustomerID = ?custID
		  )
		) 
		AND 
		Items.Name NOT IN (
		  SELECT Name 
		  FROM Items 
		  WHERE ID IN (
		    SELECT ItemID 
		    FROM Auctions
		    WHERE ID IN (
		      SELECT AuctionID
		      FROM Bids
		    )
		  )
		);
	COMMIT;

?custID = the ID of the customer who we're creating a suggestion list for

**A view for customer representatives to read employee information, except for the hourly rate and SSN.**

	START TRANSACTION;
		CREATE VIEW view_employees AS (
			SELECT LastName, FirstName, Address, City, State, ZipCode, Telephone, StartDate, Type
			FROM Employees
		);
	COMMIT;
	
**A view of a receipt of an order from a customer.**

	CREATE VIEW receipt AS (
		SELECT C.Id, C.LastName, C.FirstName, C.Address, C.City, C.State, C.ZipCode, C.Telephone, C.Email, C.CreditCardNumber, 		I.Name, W.Time, W.AuctionID, A.CurrentBid
		FROM Customers C, Items I, Wins W, Auctions A
		WHERE W.CustomerID = C.ID AND W.AuctionID = A.ID AND A.ItemID = I.ID
	)
