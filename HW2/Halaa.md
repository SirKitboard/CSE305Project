# Record a sale

Parameters

(Insert)
?BidID: ID of the bid. Integer
?Time: Time the sale was made. Date value
?CustomerID: ID of the customer partaking in the bid. Integer
?AuctionID: ID of the auction where the bid is happening. Integer
 
(Update Items)
?CopiesSold: number of copies sold of that item. Integer
?STOCK: how much of that item is in inventory. Integer
?ID: ID of the item being updated. Integer

(Update Customers)
?

```SQL
START TRANSACTION;
INSERT INTO Wins (BidID, Time, CustomerID, AuctionID)
VALUES ('3','2015-08-08 09:00:00','1', '3');

<<<<<<< Updated upstream
```SQL
UPDATE Items
SET CopiesSold = CopiesSold + 1, Stock=Stock-1
WHERE ID=1
=======
UPDATE Items 
SET CopiesSold = CopiesSold + 1, Stock=Stock-1
WHERE ID=1 

UPDATE Customers 
SET ItemsPurchased=ItemsPurchased+1
WHERE ID IN 
    (SELECT SellerID from Auctions 
        WHERE ID IN (SELECT AuctionsID from Wins Where CustomerID = 1));


UPDATE Customers
SET ItemsSold=ItemsSold=+1
WHERE ID IN



>>>>>>> Stashed changes
```

# Add information for a customer

## Add

Parameters

ID: ID of the customer: Integer
?lastName: Last name of the customer. String, up to 30 characters
?firstName : First name of customer. String, upto 30 characters
?address : Address of customer. String, upto 100 characters
?city : City where customer lives. String, upto 30 characters
?state : State where customer lives. String, upto 30 characters
?zipCode : Zip code of customer. Integer.


```SQL
<<<<<<< Updated upstream
INSERT INTO Customers (LastName, FirstName, Address, City, State, ZipCode, Telephone, Email, CreditCardNumber,ItemsSold,ItemsPurchased,Rating)
Values ('Finch', 'Atticus', ' Happy 987', 'Stony Brook', 'NY', '11790', '516 111 11111', 'finch@gmail.com', '1111-1111-1111-1111','0','0','3')
=======
START TRANSACTION;
INSERT INTO Customers (ID, LastName, FirstName, Address, City, State, ZipCode, Telephone, Email, CreditCardNumber,ItemsSold,ItemsPurchased,Rating)
Values ('5', 'Allen', 'Barry', ' Flash 52', 'Central City', 'NY', '11790', '516 121 1212', 'flash@gmail.com', '1212-1212-1212-1212','0','0','3')
COMMIT;
>>>>>>> Stashed changes
```

##Edit

Parameters:
?lastName : Last name of customer. String, upto 30 characters
?firstName : First name of customer. String, upto 30 characters
?address : Address of customer. String, upto 100 characters
?city : City where customer lives. String, upto 30 characters
?state : State where customer lives. String, upto 30 character
?zipCode : Zip code of customer. Integer.
?telephone: telephone number of customer: String, up to 20 characters
?email: email of customer: String, up to 60 characters
?ID: id of customer to be updated


```SQL
<<<<<<< Updated upstream
UPDATE Customers
=======
START TRANSACTION;
UPDATE Customers 
>>>>>>> Stashed changes
SET LastName='Lang', FirstName='Lana', Address= '777 Hope Street', City= 'Smallville', State= 'NY', ZipCode= 11111, Telephone= '(516)888-8888', Email= 'lana@gmail.com' , CreditCardNumber= '1233-4444-5555-6666',ItemsSold='12',ItemsPurchased='3',Rating=1
WHERE ID=1
COMMIT;
```

##Delete

Parameters
ID: ID of customer to be deleted: Integer

```SQL
START TRANSACTION;
DELETE FROM Customers
WHERE ID=1;
COMMIT;
```

##Produce customer mailing lists
<<<<<<< Updated upstream
=======

Parameters
?email: email of customer. String, up to 60 characters
?lastname: last name of customer. String, up to 30 characters
?firstname: first name of cusomer. String, up to 30 characters	
>>>>>>> Stashed changes

```SQL
START TRANSACTION;
SELECT Email, concat(Customers.LastName, ' ', Customers.FirstName) AS Name
FROM Customers
COMMIT;
```
