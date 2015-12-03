-- MySQL dump 10.13  Distrib 5.5.46, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: 305
-- ------------------------------------------------------
-- Server version	5.5.46-0ubuntu0.14.04.2

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `305`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `305` /*!40100 DEFAULT CHARACTER SET latin1 */;

USE `305`;

--
-- Table structure for table `Auctions`
--

DROP TABLE IF EXISTS `Auctions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Auctions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `itemID` int(11) DEFAULT NULL,
  `sellerID` int(11) DEFAULT NULL,
  `openingTime` datetime DEFAULT NULL,
  `closingTime` datetime DEFAULT NULL,
  `openingBid` decimal(10,2) DEFAULT NULL,
  `currentBid` decimal(10,2) DEFAULT NULL,
  `reserve` decimal(10,2) DEFAULT NULL,
  `increment` decimal(10,2) DEFAULT NULL,
  `employeeID` int(11) DEFAULT NULL,
  `finished` tinyint(4) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `itemID` (`itemID`),
  KEY `sellerID` (`sellerID`),
  KEY `employeeID` (`employeeID`),
  CONSTRAINT `Auctions_ibfk_1` FOREIGN KEY (`itemID`) REFERENCES `Items` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Auctions_ibfk_4` FOREIGN KEY (`sellerID`) REFERENCES `Customers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Auctions_ibfk_5` FOREIGN KEY (`employeeID`) REFERENCES `Employees` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Auctions`
--

LOCK TABLES `Auctions` WRITE;
/*!40000 ALTER TABLE `Auctions` DISABLE KEYS */;
INSERT INTO `Auctions` VALUES (1,2,1,'1998-11-01 00:00:00','2008-12-08 13:00:00',1000.00,1900.00,1500.00,100.00,2,1),(3,3,1,'1998-11-01 00:00:00','2015-10-20 10:00:00',90.00,600.00,210.00,20.00,2,1),(4,1,1,'1998-11-01 00:00:00','1998-12-01 00:00:00',10.00,50.00,25.00,5.00,2,1),(5,6,3,'2015-04-04 09:00:00','2015-05-05 09:00:00',15.00,31.00,25.00,2.00,2,1),(6,1,1,'2015-11-01 00:00:00','2015-11-30 00:00:00',10.00,45.00,25.00,5.00,2,1),(12,1,7,'2015-11-28 19:56:18','2015-11-30 00:00:00',30.00,NULL,30.00,5.00,2,0),(13,1,1,'2015-12-03 16:30:09','2015-12-31 00:00:00',25.00,NULL,30.00,2.00,3,0);
/*!40000 ALTER TABLE `Auctions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `AuctionsImages`
--

DROP TABLE IF EXISTS `AuctionsImages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `AuctionsImages` (
  `auctionID` int(11) DEFAULT NULL,
  `url` varchar(1000) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `AuctionsImages`
--

LOCK TABLES `AuctionsImages` WRITE;
/*!40000 ALTER TABLE `AuctionsImages` DISABLE KEYS */;
/*!40000 ALTER TABLE `AuctionsImages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `BidLogs`
--

DROP TABLE IF EXISTS `BidLogs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `BidLogs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `amount` decimal(10,2) DEFAULT NULL,
  `auctionID` int(11) DEFAULT NULL,
  `customerID` int(11) DEFAULT NULL,
  `time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `auctionID` (`auctionID`),
  KEY `customerID` (`customerID`),
  CONSTRAINT `BidLogs_ibfk_1` FOREIGN KEY (`auctionID`) REFERENCES `Auctions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `BidLogs_ibfk_2` FOREIGN KEY (`customerID`) REFERENCES `Customers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `BidLogs`
--

LOCK TABLES `BidLogs` WRITE;
/*!40000 ALTER TABLE `BidLogs` DISABLE KEYS */;
INSERT INTO `BidLogs` VALUES (1,600.00,3,4,'2015-08-08 09:00:00'),(2,1500.00,1,2,'2004-10-24 09:33:43'),(3,1600.00,1,3,'2004-10-25 09:33:43'),(4,1700.00,1,2,'2004-10-25 09:33:43'),(5,1800.00,1,3,'2004-10-25 09:33:43'),(6,1900.00,1,2,'2004-10-25 09:33:43'),(7,30.00,4,4,'1998-11-04 14:24:00'),(8,50.00,4,3,'1998-11-08 19:13:00'),(9,20.00,5,4,'2015-04-10 12:12:34'),(10,25.00,5,1,'2015-04-11 23:11:14'),(11,30.00,5,2,'2015-04-14 12:12:34'),(12,31.00,5,1,'2015-04-14 12:12:35'),(13,15.00,6,7,'2015-11-28 22:09:43'),(14,20.00,6,9,'2015-11-28 22:26:34'),(15,30.00,6,7,'2015-11-28 22:26:35'),(16,40.00,6,9,'2015-11-28 22:26:36'),(33,35.00,6,7,'2015-11-29 16:21:34'),(34,45.00,6,7,'2015-11-29 16:21:34');
/*!40000 ALTER TABLE `BidLogs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Bids`
--

DROP TABLE IF EXISTS `Bids`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Bids` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `time` datetime NOT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `customerID` int(11) DEFAULT NULL,
  `auctionID` int(11) DEFAULT NULL,
  `maxBid` decimal(10,2) DEFAULT NULL,
  `itemID` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `itemID` (`itemID`),
  KEY `Bids_Customers_ID_fk` (`customerID`),
  KEY `Bids_Auctions_ID_fk` (`auctionID`),
  CONSTRAINT `Bids_Auctions_ID_fk` FOREIGN KEY (`auctionID`) REFERENCES `Auctions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Bids_Customers_ID_fk` FOREIGN KEY (`customerID`) REFERENCES `Customers` (`id`) ON DELETE SET NULL ON UPDATE SET NULL,
  CONSTRAINT `Bids_ibfk_3` FOREIGN KEY (`itemID`) REFERENCES `Items` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Bids`
--

LOCK TABLES `Bids` WRITE;
/*!40000 ALTER TABLE `Bids` DISABLE KEYS */;
INSERT INTO `Bids` VALUES (1,'2015-08-08 09:00:00',600.00,4,3,800.00,3),(5,'2004-10-25 09:33:44',1800.00,3,1,1800.00,2),(6,'2004-10-25 09:33:45',1900.00,2,1,1900.00,2),(7,'1998-11-04 14:24:00',30.00,4,4,40.00,1),(8,'1998-11-08 19:13:00',50.00,3,4,55.00,1),(9,'2015-04-10 12:12:34',20.00,4,5,25.00,6),(11,'2015-04-14 12:12:34',30.00,2,5,30.00,6),(12,'2015-04-14 12:12:35',31.00,1,5,35.00,6),(15,'2015-11-29 16:21:34',45.00,7,6,60.00,1),(16,'2015-11-28 22:26:36',40.00,9,6,40.00,1);
/*!40000 ALTER TABLE `Bids` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Customers`
--

DROP TABLE IF EXISTS `Customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Customers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `lastName` char(30) NOT NULL,
  `firstName` char(30) NOT NULL,
  `address` char(100) NOT NULL,
  `city` char(30) NOT NULL,
  `state` char(30) NOT NULL,
  `zipCode` int(11) NOT NULL,
  `telephone` char(20) NOT NULL,
  `email` char(60) NOT NULL,
  `creditCardNumber` char(24) NOT NULL DEFAULT '',
  `itemsSold` int(11) DEFAULT '0',
  `itemsPurchased` int(11) DEFAULT '0',
  `rating` int(11) DEFAULT '3',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Customers`
--

LOCK TABLES `Customers` WRITE;
/*!40000 ALTER TABLE `Customers` DISABLE KEYS */;
INSERT INTO `Customers` VALUES (1,'Smithy','John','789 Peace Blvd','Los Angeles','CA',12345,'(412) 443-4321','shlu@ic.sunysb.edu','2345-6789-2345-6789',5,0,3),(2,'Finch','Atticus',' Happy 987','Stony Brook','NY',11790,'516 111 11111','finch@gmail.com','1111-1111-1111-1111',0,1,3),(3,'Lu','Shiyong','123 Success Street','Stony Brook','NY',11790,'(516) 632-8959','shiyong@cs.sunysb.edu','1234-5678-1234-5678',0,1,3),(4,'Du','Haixia','456 Fortune Road','Stony Brook','NY',11790,'(516) 632-4360','dhaixia@cs.sunysb.edu','5678-1234-5678-1234',0,1,3),(7,'Balwani','Adi','asdasdasd','asdasd','ny',12312,'6314494337','Adibalwani@gmail.com','1234123412341234',0,2,3),(9,'hjkhkj','hjfkds','kfdjah','hjkh','hjk',11590,'12345678865','menasyhalaa@gmail.com','123456789012',0,0,3);
/*!40000 ALTER TABLE `Customers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Employees`
--

DROP TABLE IF EXISTS `Employees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Employees` (
  `ssn` char(12) NOT NULL,
  `lastName` char(30) NOT NULL,
  `firstName` char(30) NOT NULL,
  `address` char(100) NOT NULL,
  `city` char(30) NOT NULL,
  `state` char(30) NOT NULL,
  `zipCode` int(11) NOT NULL,
  `telephone` char(20) NOT NULL,
  `startDate` date NOT NULL,
  `hourlyRate` decimal(10,2) NOT NULL,
  `type` int(11) DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ssn` (`ssn`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Employees`
--

LOCK TABLES `Employees` WRITE;
/*!40000 ALTER TABLE `Employees` DISABLE KEYS */;
INSERT INTO `Employees` VALUES ('123-45-6789','Smith','David','123 College Road','Stony Brook','NY',11790,'(516)215-2345','1998-11-01',60.00,0,1),('(516) 632-99','Warren','Dave','456 Sunken Street','Stony Brook','NY',11794,'(516) 632-9987','1994-02-02',50.00,1,2),('(516) 212-12','Fowler','Kyle','123 Broad Street','Bell','NY',11241,'(516) 212-1234','2003-10-07',50.00,1,3),('123123123','Balwani','Aditya','asd','asd','asd',12312,'123','2015-11-01',123.00,1,7);
/*!40000 ALTER TABLE `Employees` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Items`
--

DROP TABLE IF EXISTS `Items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` char(100) NOT NULL,
  `type` char(20) NOT NULL,
  `manufactureYear` int(11) DEFAULT NULL,
  `copiesSold` int(11) DEFAULT '0',
  `stock` int(11) DEFAULT '0',
  `description` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Items`
--

LOCK TABLES `Items` WRITE;
/*!40000 ALTER TABLE `Items` DISABLE KEYS */;
INSERT INTO `Items` VALUES (1,'Titanic','DVD',2011,3,98,'This is a description'),(2,'Nissan Sentra','Car',2007,1,3,NULL),(3,'Gamecube','Game',2001,1,3,NULL),(4,'Scott Pilgrim','DVD',2010,0,2,NULL),(5,'Inception','DVD',2010,0,10,NULL),(6,'GTAV','Game',2014,1,10,NULL),(7,'Nexus 5','phone',2013,0,0,''),(8,'Nexus 6P','Phone',2015,0,0,'Ma phoooonneeee');
/*!40000 ALTER TABLE `Items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ItemsImages`
--

DROP TABLE IF EXISTS `ItemsImages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ItemsImages` (
  `itemID` int(11) DEFAULT NULL,
  `url` varchar(1000) DEFAULT NULL,
  KEY `itemID` (`itemID`),
  CONSTRAINT `ItemsImages_ibfk_1` FOREIGN KEY (`itemID`) REFERENCES `Items` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ItemsImages`
--

LOCK TABLES `ItemsImages` WRITE;
/*!40000 ALTER TABLE `ItemsImages` DISABLE KEYS */;
INSERT INTO `ItemsImages` VALUES (1,'http://ecx.images-amazon.com/images/I/51d17yMqhVL.jpg'),(6,'http://media.rockstargames.com/rockstargames/img/global/news/upload/actual_1364906194.jpg'),(7,'/static/images/5751eb3b-e382-4010-86ab-b2a45e5bea93.png'),(8,'/static/images/3170496a-f070-4384-9c14-ad6db846851c.jpg');
/*!40000 ALTER TABLE `ItemsImages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `MailingLists`
--

DROP TABLE IF EXISTS `MailingLists`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `MailingLists` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `createdBy` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `MailingLists`
--

LOCK TABLES `MailingLists` WRITE;
/*!40000 ALTER TABLE `MailingLists` DISABLE KEYS */;
INSERT INTO `MailingLists` VALUES (1,'List1',2),(10,'Hello',2);
/*!40000 ALTER TABLE `MailingLists` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `MailingListsMappings`
--

DROP TABLE IF EXISTS `MailingListsMappings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `MailingListsMappings` (
  `listID` int(11) NOT NULL DEFAULT '0',
  `customerID` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`listID`,`customerID`),
  KEY `customerID` (`customerID`),
  CONSTRAINT `MailingListsMappings_ibfk_1` FOREIGN KEY (`listID`) REFERENCES `MailingLists` (`id`) ON DELETE CASCADE,
  CONSTRAINT `MailingListsMappings_ibfk_2` FOREIGN KEY (`customerID`) REFERENCES `Customers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `MailingListsMappings`
--

LOCK TABLES `MailingListsMappings` WRITE;
/*!40000 ALTER TABLE `MailingListsMappings` DISABLE KEYS */;
INSERT INTO `MailingListsMappings` VALUES (1,1),(10,1),(1,2),(10,2),(1,3),(1,4);
/*!40000 ALTER TABLE `MailingListsMappings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PermanentSessions`
--

DROP TABLE IF EXISTS `PermanentSessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `PermanentSessions` (
  `sessionKey` varchar(32) DEFAULT NULL,
  `userID` int(11) NOT NULL DEFAULT '0',
  `type` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`userID`,`type`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PermanentSessions`
--

LOCK TABLES `PermanentSessions` WRITE;
/*!40000 ALTER TABLE `PermanentSessions` DISABLE KEYS */;
/*!40000 ALTER TABLE `PermanentSessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary table structure for view `Receipts`
--

DROP TABLE IF EXISTS `Receipts`;
/*!50001 DROP VIEW IF EXISTS `Receipts`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `Receipts` (
  `customerID` tinyint NOT NULL,
  `lastName` tinyint NOT NULL,
  `firstName` tinyint NOT NULL,
  `address` tinyint NOT NULL,
  `city` tinyint NOT NULL,
  `state` tinyint NOT NULL,
  `zipCode` tinyint NOT NULL,
  `telephone` tinyint NOT NULL,
  `email` tinyint NOT NULL,
  `creditCardNumber` tinyint NOT NULL,
  `name` tinyint NOT NULL,
  `time` tinyint NOT NULL,
  `auctionID` tinyint NOT NULL,
  `currentBid` tinyint NOT NULL
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `Sales_Report`
--

DROP TABLE IF EXISTS `Sales_Report`;
/*!50001 DROP VIEW IF EXISTS `Sales_Report`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `Sales_Report` (
  `itemID` tinyint NOT NULL,
  `bidID` tinyint NOT NULL,
  `customerID` tinyint NOT NULL,
  `monitorID` tinyint NOT NULL,
  `time` tinyint NOT NULL,
  `boughtBy` tinyint NOT NULL,
  `amount` tinyint NOT NULL,
  `email` tinyint NOT NULL,
  `itemName` tinyint NOT NULL,
  `itemType` tinyint NOT NULL,
  `monitorName` tinyint NOT NULL,
  `auctionID` tinyint NOT NULL,
  `sellerID` tinyint NOT NULL
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `Searches`
--

DROP TABLE IF EXISTS `Searches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Searches` (
  `customerID` int(11) NOT NULL DEFAULT '0',
  `itemID` int(11) NOT NULL DEFAULT '0',
  `frequency` int(11) DEFAULT '0',
  PRIMARY KEY (`customerID`,`itemID`),
  KEY `itemID` (`itemID`),
  CONSTRAINT `Searches_ibfk_1` FOREIGN KEY (`customerID`) REFERENCES `Customers` (`id`) ON DELETE CASCADE,
  CONSTRAINT `Searches_ibfk_2` FOREIGN KEY (`itemID`) REFERENCES `Items` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Searches`
--

LOCK TABLES `Searches` WRITE;
/*!40000 ALTER TABLE `Searches` DISABLE KEYS */;
INSERT INTO `Searches` VALUES (1,1,6),(1,6,2),(2,2,1),(3,2,2),(3,4,2),(7,1,9),(7,2,3),(7,3,9);
/*!40000 ALTER TABLE `Searches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Users`
--

DROP TABLE IF EXISTS `Users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Users` (
  `username` varchar(20) NOT NULL DEFAULT '',
  `password` varchar(32) DEFAULT NULL,
  `type` int(11) DEFAULT NULL,
  `id` int(11) DEFAULT NULL,
  UNIQUE KEY `type` (`type`,`id`),
  UNIQUE KEY `Users_username_type_uindex` (`username`,`type`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Users`
--

LOCK TABLES `Users` WRITE;
/*!40000 ALTER TABLE `Users` DISABLE KEYS */;
INSERT INTO `Users` VALUES ('adibalwani','qw75ElNTVyllI',0,7),('atticus_finch','qwIL39doGCEfo',0,2),('david_smith','qwIL39doGCEfo',1,1),('david_warren','qwIL39doGCEfo',1,2),('haixia_du','qwIL39doGCEfo',0,4),('hjhj','qwCR/a4B.Y1ZM',0,9),('john_smith','qwIL39doGCEfo',0,1),('kyle_karl','qwIL39doGCEfo',1,3),('shiyong_lu','qwIL39doGCEfo',0,3),('adibalwani','qw75ElNTVyllI',1,7);
/*!40000 ALTER TABLE `Users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Wins`
--

DROP TABLE IF EXISTS `Wins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Wins` (
  `bidID` int(11) NOT NULL DEFAULT '0',
  `Time` datetime DEFAULT NULL,
  `customerID` int(11) NOT NULL DEFAULT '0',
  `auctionID` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`auctionID`),
  KEY `customerID` (`customerID`),
  KEY `bidID` (`bidID`),
  CONSTRAINT `Wins_ibfk_2` FOREIGN KEY (`customerID`) REFERENCES `Customers` (`id`) ON DELETE CASCADE,
  CONSTRAINT `Wins_ibfk_3` FOREIGN KEY (`auctionID`) REFERENCES `Auctions` (`id`) ON DELETE NO ACTION,
  CONSTRAINT `Wins_ibfk_4` FOREIGN KEY (`bidID`) REFERENCES `Bids` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Wins`
--

LOCK TABLES `Wins` WRITE;
/*!40000 ALTER TABLE `Wins` DISABLE KEYS */;
INSERT INTO `Wins` VALUES (6,'2008-12-08 13:00:00',2,1),(1,'2015-08-08 09:00:00',4,3),(8,'1998-12-01 00:00:00',3,4),(12,'2015-05-05 00:00:00',1,5),(15,'2015-12-02 22:57:44',7,6);
/*!40000 ALTER TABLE `Wins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary table structure for view `receipt`
--

DROP TABLE IF EXISTS `receipt`;
/*!50001 DROP VIEW IF EXISTS `receipt`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `receipt` (
  `id` tinyint NOT NULL,
  `lastName` tinyint NOT NULL,
  `firstName` tinyint NOT NULL,
  `address` tinyint NOT NULL,
  `city` tinyint NOT NULL,
  `state` tinyint NOT NULL,
  `zipCode` tinyint NOT NULL,
  `telephone` tinyint NOT NULL,
  `email` tinyint NOT NULL,
  `creditCardNumber` tinyint NOT NULL,
  `name` tinyint NOT NULL,
  `Time` tinyint NOT NULL,
  `auctionID` tinyint NOT NULL,
  `currentBid` tinyint NOT NULL
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `view_employees`
--

DROP TABLE IF EXISTS `view_employees`;
/*!50001 DROP VIEW IF EXISTS `view_employees`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `view_employees` (
  `lastName` tinyint NOT NULL,
  `firstName` tinyint NOT NULL,
  `address` tinyint NOT NULL,
  `city` tinyint NOT NULL,
  `state` tinyint NOT NULL,
  `zipCode` tinyint NOT NULL,
  `telephone` tinyint NOT NULL,
  `StartDate` tinyint NOT NULL,
  `type` tinyint NOT NULL
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Current Database: `305`
--

USE `305`;

--
-- Final view structure for view `Receipts`
--

/*!50001 DROP TABLE IF EXISTS `Receipts`*/;
/*!50001 DROP VIEW IF EXISTS `Receipts`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `Receipts` AS (select `C`.`id` AS `customerID`,`C`.`lastName` AS `lastName`,`C`.`firstName` AS `firstName`,`C`.`address` AS `address`,`C`.`city` AS `city`,`C`.`state` AS `state`,`C`.`zipCode` AS `zipCode`,`C`.`telephone` AS `telephone`,`C`.`email` AS `email`,`C`.`creditCardNumber` AS `creditCardNumber`,`I`.`name` AS `name`,`W`.`Time` AS `time`,`W`.`auctionID` AS `auctionID`,`A`.`currentBid` AS `currentBid` from (((`Customers` `C` join `Items` `I`) join `Wins` `W`) join `Auctions` `A`) where ((`W`.`customerID` = `C`.`id`) and (`W`.`auctionID` = `A`.`id`) and (`A`.`itemID` = `I`.`id`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `Sales_Report`
--

/*!50001 DROP TABLE IF EXISTS `Sales_Report`*/;
/*!50001 DROP VIEW IF EXISTS `Sales_Report`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `Sales_Report` AS select `Items`.`id` AS `itemID`,`Bids`.`id` AS `bidID`,`Customers`.`id` AS `customerID`,`Employees`.`id` AS `monitorID`,`Wins`.`Time` AS `time`,concat(`Customers`.`firstName`,' ',`Customers`.`lastName`) AS `boughtBy`,`Bids`.`amount` AS `amount`,`Customers`.`email` AS `email`,`Items`.`name` AS `itemName`,`Items`.`type` AS `itemType`,concat(`Employees`.`firstName`,' ',`Employees`.`lastName`) AS `monitorName`,`Auctions`.`id` AS `auctionID`,`Auctions`.`sellerID` AS `sellerID` from (((((`Wins` join `Bids`) join `Customers`) join `Items`) join `Employees`) join `Auctions`) where ((`Wins`.`bidID` = `Bids`.`id`) and (`Bids`.`customerID` = `Customers`.`id`) and (`Bids`.`itemID` = `Items`.`id`) and (`Bids`.`auctionID` = `Auctions`.`id`) and (`Auctions`.`employeeID` = `Employees`.`id`)) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `receipt`
--

/*!50001 DROP TABLE IF EXISTS `receipt`*/;
/*!50001 DROP VIEW IF EXISTS `receipt`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = latin1 */;
/*!50001 SET character_set_results     = latin1 */;
/*!50001 SET collation_connection      = latin1_swedish_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `receipt` AS (select `C`.`id` AS `id`,`C`.`lastName` AS `lastName`,`C`.`firstName` AS `firstName`,`C`.`address` AS `address`,`C`.`city` AS `city`,`C`.`state` AS `state`,`C`.`zipCode` AS `zipCode`,`C`.`telephone` AS `telephone`,`C`.`email` AS `email`,`C`.`creditCardNumber` AS `creditCardNumber`,`I`.`name` AS `name`,`W`.`Time` AS `Time`,`W`.`auctionID` AS `auctionID`,`A`.`currentBid` AS `currentBid` from (((`Customers` `C` join `Items` `I`) join `Wins` `W`) join `Auctions` `A`) where ((`W`.`customerID` = `C`.`id`) and (`W`.`auctionID` = `A`.`id`) and (`A`.`itemID` = `I`.`id`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `view_employees`
--

/*!50001 DROP TABLE IF EXISTS `view_employees`*/;
/*!50001 DROP VIEW IF EXISTS `view_employees`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = latin1 */;
/*!50001 SET character_set_results     = latin1 */;
/*!50001 SET collation_connection      = latin1_swedish_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `view_employees` AS (select `Employees`.`lastName` AS `lastName`,`Employees`.`firstName` AS `firstName`,`Employees`.`address` AS `address`,`Employees`.`city` AS `city`,`Employees`.`state` AS `state`,`Employees`.`zipCode` AS `zipCode`,`Employees`.`telephone` AS `telephone`,`Employees`.`startDate` AS `StartDate`,`Employees`.`type` AS `type` from `Employees`) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2015-12-03 18:05:28
