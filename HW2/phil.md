**Find bid history for an auction**

	SELECT * 
	FROM Bids 
	WHERE AuctionID = 1

**Find current and past auctions a customer has taken part in**

	SELECT * 
	FROM Auctions 
	WHERE ID IN (
		SELECT AuctionID 
		FROM Bids 
		WHERE CustomerID = 3
	)

**Items sold by a given seller and corresponding auction info**

	SELECT * 
	FROM Auctions 
	WHERE SellerID = 2

**Items available of a particular type and corresponding auction info**

	SELECT * 
	FROM Auctions 
	WHERE ID IN (
		SELECT ID 
		FROM Items 
		WHERE ID = 1
	)

**Items available with a particular keyword or set of keywords in the item name, and corresponding auction info**

	SELECT * 
	FROM Auctions 
	WHERE ID IN (
		SELECT ID 
	  	FROM Items 
	  	WHERE Name 
	  	LIKE '%Tita%'
	)

**Best-Seller list**

	SELECT Name 
	FROM Items 
	WHERE ID IN (
	  SELECT ItemID 
	  FROM Auctions 
	  WHERE ID IN (
	    SELECT AuctionID 
	    FROM Wins
	  )
	)

**Personalized item suggestion list**

	SELECT Name 
	FROM Items 
	WHERE Type IN (
	  SELECT Type 
	  FROM Items 
	  WHERE ID IN (
	    SELECT ItemID 
	    FROM Searches 
	    WHERE CustomerID = 1
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
	)

**A view for customer representatives to read employee information, except for the hourly rate and SSN.**

	CREATE VIEW view_employees AS (
		SELECT LastName, FirstName, Address, City, State, ZipCode, Telephone, StartDate, Type
		FROM Employees
	)

**A view of a receipt of an order from a customer.**

	CREATE VIEW receipt AS (
		SELECT C.Id, C.LastName, C.FirstName, C.Address, C.City, C.State, C.ZipCode, C.Telephone, C.Email, C.CreditCardNumber, 		I.Name, W.Time, W.AuctionID, A.CurrentBid
		FROM Customers C, Items I, Wins W, Auctions A
		WHERE W.CustomerID = C.ID AND W.AuctionID = A.ID AND A.ItemID = I.ID
	)
