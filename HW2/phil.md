**Find bid history for an auction**

SELECT * FROM Bids WHERE AuctionID = 1

**Find current and past auctions a customer has taken part in**

SELECT * from Auctions WHERE ID IN (SELECT AuctionID from Bids WHERE CustomerID = 3)

**Items sold by a given seller and corresponding auction info**

SELECT * FROM Auctions WHERE SellerID = 2

**Items available of a particular type and corresponding auction info**

SELECT * FROM Auctions WHERE ID IN (SELECT ID FROM Items WHERE ID = 1)

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
