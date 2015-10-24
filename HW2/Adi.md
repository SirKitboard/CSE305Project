# SQL Transactions

### Add, Modify and Delete employees

#### Add
```
INSERT INTO Employees(SSN, LastName, FirstName, Address, City, State, ZipCode, Telephone, StartDate, HourlyRate, Type)
VALUES ('345-45-123', 'Tarbell', 'Billy', '4232 Summit Park Avenue', 'Brewton','AL', 36426,'251-212-0863','1994-02-02 00:00:00',60.00,'CustRep');
```

#### Modify
```
UPDATE Employees
SET FirstName = 'Tarry'
WHERE SSN = '345-45-123'
```

#### Delete

```
DELETE FROM Employees
WHERE FirstName = 'Tarry'
```

### Obtain a sales report for a particular month

```
CREATE VIEW Sales_Report AS
  SELECT Wins.Time AS Time, concat(Customers.LastName, ' ', Customers.FirstName) AS BoughtBy, Bids.Amount as Amount, Customers.Email As Email, Items.Name as ItemName, Items.Type as ItemType from Wins, Bids, Customers, Items
  WHERE Wins.BidID = Bids.ID
      AND Bids.CustomerID = Customers.ID
      AND Bids.ItemID = Items.ID;

SELECT * FROM Sales_Report;
```

### Comprehensive Listing of all items

```
SELECT * FROM Items
```

### Produce a list of sales by item name or by customer name

#### List of sales by item name
```
SELECT * FROM Sales_Report WHERE ItemName = 'Titanic'
```

#### List of sales by customer name
```
SELECT * FROM Sales_Report WHERE BoughtBy = 'Du Haixia';
```
