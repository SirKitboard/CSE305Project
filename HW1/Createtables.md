### Items table

```
CREATE TABLE Items (
    ID INTEGER NOT NULL AUTO_INCREMENT,
    Name CHAR(100) NOT NULL,
    Type ItemTypes DEFAULT "Other",
    YearManufactured INTEGER,
    CopiesSold INTEGER DEFAULT 0,
    AmountInStock INTEGER DEFAULT 0,
    PRIMARY KEY (ID)
  )

CREATE DOMAIN ItemTypes CHAR(15)
    CHECK ( VALUE IN ('Jewelry', 'DVD', 'Silverware', 'Books', 'Sports', 'Memes', 'Games', 'Electronics', 'People', 'Other'))
```

### Customers table

```
CREATE TABLE Customers (
    ID INTEGER NOT NULL AUTO_INCREMENT,
    LastName CHAR(30) NOT NULL,
    FirstName CHAR(30) NOT NULL,
    Address  CHAR(100) NOT NULL,
    City CHAR(30) NOT NULL,
    State CHAR(30) NOT NULL,
    ZipCode INTEGER NOT NULL,
    Telephone CHAR(20) NOT NULL,
    Email CHAR(60) NOT NULL,
    CreditCardNumber CHAR(20) NOT NULL,
    ItemsSold INTEGER DEFAULT 0,
    ItemsPurchased INTEGER DEFAULT 0,
    Rating INTEGER DEFAULT 3,
    PRIMARY KEY (ID)
  )
```

### Employees table

```
CREATE TABLE Employees (
    SSN CHAR(10)NOT NULL,
    LastName CHAR(30) NOT NULL,
    FirstName CHAR(30) NOT NULL,
    Address  CHAR(100) NOT NULL,
    City CHAR(30) NOT NULL,
    State CHAR(30) NOT NULL,
    ZipCode INTEGER NOT NULL,
    Telephone CHAR(20) NOT NULL,
    StartDate TIMESTAMP DEFAULT NOW(),
    HourlyRate FLOAT NOT NULL,
    Type Types
    PRIMARY KEY (SSN)
  )

CREATE DOMAIN EmpTypes CHAR(10)
    CHECK ( VALUE IN ('Manager','CustRep','Other'))
```

### Auctions table

```
CREATE TABLE Auctions(
    AuctionID INTEGER NOT NULL AUTO_INCREMENT,
    ItemID INTEGER ,
    SellerID  INTEGER,
    BuyerID INTEGER,
    OpeningTime TIMESTAMP,
    ClosingTime TIMESTAMP,
    OpeningBid FLOAT DEFAULT 0,
    ClosingBid FLOAT DEFAULT 0,
    CurrentBid FLOAT DEFAULT 0,
    CurrentHighBid FLOAT DEFAULT 0,
    Reserve FLOAT DEFAULT 0,
    Increment FLOAT DEFAULT 0,
    EmployeeID INTEGER,
    PRIMARY KEY (AuctionID),
    FOREIGN KEY (ItemID) REFERENCES Items (ID)
      ON DELETE CASCADE,
      ON UPDATE CASCADE,
    FOREIGN KEY (SellerID) REFERENCES Customers(ID)
      ON DELETE CASCADE,
    FOREIGN KEY (BuyerID) REFERENCES Customers(ID)
      ON DELETE NO ACTION
  )
```

### Bids Table

```
CREATE TABLE Bids (
    ID INTEGER NOT NULL AUTO_INCREMENT,
    Time TIMESTAMP DEFAULT NOW(),
    Amount FLOAT DEFAULT 1,
    CustomerID INTEGER,
    AuctionID INTEGER,
    PRIMARY KEY (ID),
    FOREIGN KEY (CustomerID) REFERENCES Customers(ID)
      ON DELETE CASCADE,
    FOREIGN KEY (AuctionID) REFERENCES Auctions(ID)
      ON DELETE CASCADE
  )
```

### Wins Table

```
CREATE TABLE Wins (
    BidID INTEGER,
    Time TIMESTAMP DEFAULT NOW(),
    CustomerID INTEGER,
    AuctionID INTEGER,
    PRIMARY KEY (BidID, CustomerID, AuctionID)
    FOREIGN KEY (BidID) REFERENCES Bids(ID)
      ON DELETE NO ACTION,
    FOREIGN KEY (CustomerID) REFERENCES Customers(ID)
      ON DELETE CASCADE,
    FOREIGN KEY (AuctionID) REFERENCES Auctions(ID)
      ON DELETE NO ACTION
  )
```

### Searches table

```
CREATE TABLE Searches (
    CustomerID INTEGER,
    ItemID INTEGER,
    Frequency INTEGER DEFAULT 0,
    PRIMARY KEY (CustomerID, ItemID)
    FOREIGN KEY (CustomerID) REFERENCES Customers(ID)
      ON DELETE CASCADE,
    FOREIGN KEY (ItemID) REFERENCES Items(ID)
      ON DELETE CASCADE
  )
```
