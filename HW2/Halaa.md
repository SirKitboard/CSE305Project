## Record a sale

```SQL
INSERT INTO Wins (BidID, Time, CustomerID, AuctionID)
VALUES ('3','2015-08-08 09:00:00','1', '3');
```

```SQL
UPDATE Items 
SET CopiesSold = CopiesSold + 1, Stock=Stock-1
WHERE ID=1 
```

### Add information for a customer

## Add 

```SQL
INSERT INTO Customers (ID, LastName, FirstName, Address, City, State, ZipCode, Telephone, Email, CreditCardNumber,ItemsSold,ItemsPurchased,Rating)	q	q	w
Values ('5', 'Finch', 'Atticus', ' Happy 987', 'Stony Brook', 'NY', '11790', '516 111 11111', 'finch@gmail.com', '1111-1111-1111-1111','0','0','3')
```

##Edit 

```SQL
UPDATE Customers 
SET LastName='Lang', FirstName='Lana', Address= '777 Hope Street', City= 'Smallville', State= 'NY', ZipCode= 11111, Telephone= '(516)888-8888', Email= 'lana@gmail.com' , CreditCardNumber= '1233-4444-5555-6666',ItemsSold='12',ItemsPurchased='3',Rating=1
WHERE ID=1
```

##Delete 

```SQL
DELETE FROM Customers
WHERE ID=1;
```

##Produce customer mailing lists	

```SQL
SELECT Email, concat(Customers.LastName, ' ', Customers.FirstName) AS Name
FROM Customers
```






