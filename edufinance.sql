-- MySQL dump 10.13  Distrib 8.0.32, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: edufinance
-- ------------------------------------------------------
-- Server version	8.0.32

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `accounts`
--

DROP TABLE IF EXISTS `accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `accounts` (
  `accountID` int NOT NULL DEFAULT '0',
  `lastName` varchar(255) NOT NULL,
  `firstName` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `login` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`accountID`),
  UNIQUE KEY `accountID_UNIQUE` (`accountID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accounts`
--

LOCK TABLES `accounts` WRITE;
/*!40000 ALTER TABLE `accounts` DISABLE KEYS */;
INSERT INTO `accounts` VALUES (0,'Buketov','Anton','buktov.95@mail.ru','admin','$2b$10$SWKvKoIb5hq8JKTencYpDem18z9kjFdtor91XYGkVYFChmIYmrqxK'),(1,'Test','Test','test@testov.ru','admin2','$2b$10$OJh9uMIVPZtHlmT6h.ar0OXlS8slmFCCgguyCThzyIbVu2mxCfZR.');
/*!40000 ALTER TABLE `accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `extraactions`
--

DROP TABLE IF EXISTS `extraactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `extraactions` (
  `idextraActions` int NOT NULL AUTO_INCREMENT,
  `extraName` varchar(99) NOT NULL,
  `extraRate` int NOT NULL,
  PRIMARY KEY (`idextraActions`),
  UNIQUE KEY `idextraActions_UNIQUE` (`idextraActions`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `extraactions`
--

LOCK TABLES `extraactions` WRITE;
/*!40000 ALTER TABLE `extraactions` DISABLE KEYS */;
INSERT INTO `extraactions` VALUES (1,'Curriculum',7),(2,'Communication',6),(3,'Trial lesson',8),(4,'Social media',6),(5,'Invoices',7),(6,'Community',7),(7,'Onboarding',7),(8,'Individual Lesson',7),(9,'Engineering',9),(10,'Automation',7),(11,'Homework sending',7),(12,'Schedule',7),(13,'Individual lesson with special needs',7),(14,'Events',7),(15,'Bookkeeping',7),(16,'Design',7),(17,'General',7),(18,'Other',9);
/*!40000 ALTER TABLE `extraactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `workers`
--

DROP TABLE IF EXISTS `workers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `workers` (
  `workerid` int NOT NULL AUTO_INCREMENT,
  `firstName` varchar(500) DEFAULT NULL,
  `lastName` varchar(500) DEFAULT NULL,
  `workerEmail` varchar(45) DEFAULT NULL,
  `city` varchar(500) DEFAULT NULL,
  `teachingHours` varchar(500) DEFAULT NULL,
  `fixedFee` varchar(500) DEFAULT '0',
  `hourlyRates` varchar(500) DEFAULT '6',
  `startDate` date DEFAULT NULL,
  `endDate` date DEFAULT NULL,
  PRIMARY KEY (`workerid`),
  UNIQUE KEY `workerid_UNIQUE` (`workerid`)
) ENGINE=InnoDB AUTO_INCREMENT=2450 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `workers`
--

LOCK TABLES `workers` WRITE;
/*!40000 ALTER TABLE `workers` DISABLE KEYS */;
INSERT INTO `workers` VALUES (225,'Landon','Farrow','farrowr@farrowr.ee','Narva','3','150','8','2023-05-01','2023-05-31'),(226,'Harper','Kingsley','harper@harper.ee','Narva','13','0','7','2023-05-01','2023-05-31'),(227,'Kade','Blackburn','kade@kade.ee','Narva','14','0','6','2023-05-01','2023-05-31'),(228,'Emery','Thorn','emery@emery.ee','Tallinn','2','0','6','2023-05-01','2023-05-31'),(229,'Saylor','Brighton','saylor@Saylor.ee','Tallinn','7','0','7','2023-05-01','2023-05-31'),(230,'Callan','Mercer','callan@callan.ee','Tallinn','8','0','7','2023-05-01','2023-05-31'),(231,'Tinsley','Everett','tinsley@tinsley.ee','Tartu','21','0','7','2023-05-01','2023-05-31'),(234,'Leif','Sinclair','leif@leif.ee','Kohtla-Järve','19','0','6','2023-05-01','2023-05-31'),(238,'Ronan','Archer','ronan@ronan.ee','Tartu','17','0','6','2023-05-01','2023-05-31'),(240,'Vars','Feelton','vars@vars.se','Kohtla-Järve','0','0','8','2023-05-01','2023-05-31'),(244,'Nicolas','Taranos','nic@nic.ee','Narva','22','0','8','2023-04-01','2023-04-30'),(2377,'Lyric','Banks','lyric@lyric.ee','Tartu','33','0','6','2023-05-01','2023-05-31'),(2449,'Anton','Buketov','buketov.95@mail.ru','Narva','2.5','0','6','2023-05-01','2023-05-31');
/*!40000 ALTER TABLE `workers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `workersextraactions`
--

DROP TABLE IF EXISTS `workersextraactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `workersextraactions` (
  `idworkersExtraActions` int NOT NULL AUTO_INCREMENT,
  `idextraActions` int NOT NULL,
  `date` date DEFAULT NULL,
  `extrahours` double NOT NULL,
  `firstname` varchar(999) NOT NULL,
  `lastname` varchar(999) NOT NULL,
  PRIMARY KEY (`idworkersExtraActions`),
  UNIQUE KEY `idworkersExtraActions_UNIQUE` (`idworkersExtraActions`)
) ENGINE=InnoDB AUTO_INCREMENT=878 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `workersextraactions`
--

LOCK TABLES `workersextraactions` WRITE;
/*!40000 ALTER TABLE `workersextraactions` DISABLE KEYS */;
INSERT INTO `workersextraactions` VALUES (691,4,'2023-05-02',99,'Vars','Feelton'),(692,9,'2023-05-04',2,'Leif','Sinclair'),(693,7,'2023-05-04',3,'Lyric','Banks'),(694,7,'2023-05-04',7,'Ronan','Archer'),(695,15,'2023-05-02',3,'Callan','Mercer'),(696,2,'2023-05-01',1,'Emery','Thorn'),(697,2,'2023-05-02',8,'Saylor','Brighton'),(698,6,'2023-05-02',9,'Saylor','Brighton'),(699,10,'2023-05-02',4,'Saylor','Brighton'),(700,15,'2023-05-02',7,'Saylor','Brighton'),(701,4,'2023-05-02',7,'Tinsley','Everett'),(702,7,'2023-05-02',14,'Tinsley','Everett'),(703,12,'2023-05-02',21,'Tinsley','Everett'),(876,10,'2023-05-01',4,'Anton','Buketov'),(877,15,'2023-05-01',4,'Anton','Buketov');
/*!40000 ALTER TABLE `workersextraactions` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-05-13 11:55:47
