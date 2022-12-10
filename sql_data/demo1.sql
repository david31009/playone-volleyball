-- MySQL dump 10.13  Distrib 8.0.30, for Win64 (x86_64)
--
-- Host: localhost    Database: vb_meetup
-- ------------------------------------------------------
-- Server version	8.0.30

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `chat_msg`
--

DROP TABLE IF EXISTS `chat_msg`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chat_msg` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned DEFAULT NULL,
  `chatroom_id` int unsigned DEFAULT NULL,
  `msg` varchar(45) DEFAULT NULL,
  `time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `chatroom_id` (`chatroom_id`),
  CONSTRAINT `chat_msg_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  CONSTRAINT `chat_msg_ibfk_2` FOREIGN KEY (`chatroom_id`) REFERENCES `chatroom` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chat_msg`
--

LOCK TABLES `chat_msg` WRITE;
/*!40000 ALTER TABLE `chat_msg` DISABLE KEYS */;
/*!40000 ALTER TABLE `chat_msg` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chatroom`
--

DROP TABLE IF EXISTS `chatroom`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chatroom` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chatroom`
--

LOCK TABLES `chatroom` WRITE;
/*!40000 ALTER TABLE `chatroom` DISABLE KEYS */;
/*!40000 ALTER TABLE `chatroom` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comment`
--

DROP TABLE IF EXISTS `comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comment` (
  `id` int unsigned NOT NULL,
  `user_id` int unsigned DEFAULT NULL,
  `commenter_id` int unsigned DEFAULT NULL,
  `score` tinyint unsigned DEFAULT NULL,
  `content` varchar(45) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `commenter_id` (`commenter_id`),
  CONSTRAINT `comment_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  CONSTRAINT `comment_ibfk_2` FOREIGN KEY (`commenter_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comment`
--

LOCK TABLES `comment` WRITE;
/*!40000 ALTER TABLE `comment` DISABLE KEYS */;
/*!40000 ALTER TABLE `comment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fans`
--

DROP TABLE IF EXISTS `fans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fans` (
  `user_id` int unsigned NOT NULL,
  `follower_id` int unsigned NOT NULL,
  PRIMARY KEY (`user_id`,`follower_id`),
  KEY `follower_id` (`follower_id`),
  CONSTRAINT `fans_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fans_ibfk_2` FOREIGN KEY (`follower_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fans`
--

LOCK TABLES `fans` WRITE;
/*!40000 ALTER TABLE `fans` DISABLE KEYS */;
/*!40000 ALTER TABLE `fans` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `group`
--

DROP TABLE IF EXISTS `group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `group` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `creator_id` int unsigned DEFAULT NULL,
  `title` varchar(45) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `time_duration` smallint unsigned DEFAULT NULL,
  `net` char(1) DEFAULT NULL,
  `place` varchar(10) DEFAULT NULL,
  `place_description` varchar(20) DEFAULT NULL,
  `court` char(1) DEFAULT NULL,
  `is_charge` tinyint(1) DEFAULT NULL,
  `money` smallint unsigned DEFAULT NULL,
  `level` char(1) DEFAULT NULL,
  `level_description` varchar(255) DEFAULT NULL,
  `people_have` tinyint unsigned DEFAULT NULL,
  `people_need` tinyint unsigned DEFAULT NULL,
  `people_left` tinyint unsigned DEFAULT NULL,
  `group_description` varchar(255) DEFAULT NULL,
  `is_build` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `creator_id` (`creator_id`),
  CONSTRAINT `group_ibfk_1` FOREIGN KEY (`creator_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `group`
--

LOCK TABLES `group` WRITE;
/*!40000 ALTER TABLE `group` DISABLE KEYS */;
INSERT INTO `group` VALUES (1,1,'我要揪團','2022-11-09 05:00:00',180,'0','台北市大安區','大安運動中心','0',1,100,'0','會基本接發',7,8,8,'我要揪團',1),(2,2,'我要揪團','2022-11-09 16:00:00',180,'0','台北市大同區','大安運動中心','1',1,200,'1','會基本接發',3,9,8,'我要揪團',0),(3,3,'我要揪團','2022-11-07 06:00:00',180,'1','台北市大同區','大安運動中心','0',1,300,'2','會基本接發',4,9,7,'我要揪團',1),(4,4,'我要揪團','2022-11-08 07:00:00',180,'1','台北市大安區','大安運動中心','0',1,225,'3','會基本接發',2,9,6,'我要揪團',0),(5,1,'我要揪團','2022-11-09 16:00:00',180,'0','台北市中正區','大安運動中心','1',1,120,'4','會基本接發',1,9,8,'我要揪團',1),(6,2,'我要揪團','2022-11-06 09:00:00',180,'1','台北市大安區','大安運動中心','0',1,250,'0','會基本接發',5,9,4,'我要揪團',0),(7,3,'我要揪團','2022-11-06 09:00:00',180,'1','台北市大安區','大安運動中心','0',1,100,'1','會基本接發',6,9,3,'我要揪團',1),(8,4,'我要揪團','2022-11-06 09:00:00',180,'0','台北市中正區','大安運動中心','1',1,100,'2','會基本接發',3,9,2,'我要揪團',0),(9,2,'我要揪團','2022-11-08 09:00:00',180,'1','台北市大安區','大安運動中心','0',1,100,'3','會基本接發',2,9,1,'我要揪團',0),(10,3,'我要揪團','2022-11-07 09:00:00',180,'0','台北市大同區','大安運動中心','0',1,100,'4','會基本接發',3,9,7,'我要揪團',0),(11,4,'我要揪團','2022-11-06 09:00:00',180,'1','台北市大同區','大安運動中心','1',1,100,'0','會基本接發',5,9,7,'我要揪團',1),(12,1,'我要揪團','2022-11-06 09:00:00',180,'0','台北市中正區','大安運動中心','0',1,100,'1','會基本接發',7,9,6,'我要揪團',0),(13,2,'我要揪團','2022-11-09 16:00:00',180,'0','台北市大安區','大安運動中心','0',1,100,'3','會基本接發',7,9,5,'我要揪團',1),(14,3,'我要揪團','2022-11-09 09:00:00',180,'1','台北市大安區','大安運動中心','1',1,100,'4','會基本接發',7,9,4,'我要揪團',0),(15,4,'我要揪團','2022-11-06 09:00:00',180,'1','台北市中正區','大安運動中心','0',1,100,'2','會基本接發',2,9,3,'我要揪團',0),(16,1,'我要揪團','2022-11-08 09:00:00',180,'1','台北市大安區','大安運動中心','1',1,100,'2','會基本接發',1,9,3,'我要揪團',0),(17,2,'我要揪團','2022-11-09 16:00:00',180,'0','台北市大安區','大安運動中心','1',1,100,'2','會基本接發',4,9,9,'我要揪團',1),(18,3,'我要揪團','2022-11-06 09:00:00',180,'0','台北市中正區','大安運動中心','0',1,100,'2','會基本接發',2,9,8,'我要揪團',1),(19,4,'我要揪團','2022-11-09 09:00:00',180,'1','台北市大安區','大安運動中心','0',1,100,'2','會基本接發',7,9,3,'我要揪團',1),(20,2,'我要揪團','2022-11-09 20:00:00',180,'1','台北市大安區','大安運動中心','0',1,100,'2','會基本接發',5,9,2,'我要揪團',1),(21,1,'我要揪團','2022-11-09 17:00:00',180,'1','台北市大安區','大安運動中心','0',1,100,'2','會基本接發',7,9,0,'我要揪團',1);
/*!40000 ALTER TABLE `group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `member`
--

DROP TABLE IF EXISTS `member`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `member` (
  `user_id` int unsigned NOT NULL,
  `group_id` int unsigned NOT NULL,
  `signup_status` char(1) DEFAULT NULL,
  PRIMARY KEY (`user_id`,`group_id`),
  KEY `group_id` (`group_id`),
  CONSTRAINT `member_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  CONSTRAINT `member_ibfk_2` FOREIGN KEY (`group_id`) REFERENCES `group` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `member`
--

LOCK TABLES `member` WRITE;
/*!40000 ALTER TABLE `member` DISABLE KEYS */;
INSERT INTO `member` VALUES (2,1,'2'),(2,5,'2'),(2,19,'2'),(2,21,'2'),(3,1,'2'),(4,1,'0');
/*!40000 ALTER TABLE `member` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `msg_board`
--

DROP TABLE IF EXISTS `msg_board`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `msg_board` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned DEFAULT NULL,
  `group_id` int unsigned DEFAULT NULL,
  `content` varchar(45) DEFAULT NULL,
  `time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `group_id` (`group_id`),
  CONSTRAINT `msg_board_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  CONSTRAINT `msg_board_ibfk_2` FOREIGN KEY (`group_id`) REFERENCES `group` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `msg_board`
--

LOCK TABLES `msg_board` WRITE;
/*!40000 ALTER TABLE `msg_board` DISABLE KEYS */;
INSERT INTO `msg_board` VALUES (11,2,1,'有人有球嗎?','2022-11-05 21:14:06'),(12,2,1,'明天天氣好像不錯!!!','2022-11-05 21:14:20'),(13,2,5,'嗨有人在嘛?','2022-11-05 21:16:14'),(14,2,13,'可以留言了','2022-11-05 21:26:13'),(15,2,13,'多留幾個~~\n讚','2022-11-05 21:26:41'),(16,2,13,'好唷','2022-11-05 21:27:27'),(17,2,21,'我報名了!!','2022-11-06 11:45:05'),(18,3,1,'報起來!!','2022-11-07 11:09:15'),(20,2,1,'天氣可以!!','2022-11-07 13:27:20'),(24,2,1,'HIII','2022-11-07 13:34:12');
/*!40000 ALTER TABLE `msg_board` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(20) DEFAULT NULL,
  `email` varchar(45) DEFAULT NULL,
  `password` varchar(45) DEFAULT NULL,
  `gender` char(1) DEFAULT NULL,
  `intro` varchar(255) DEFAULT NULL,
  `county` char(3) DEFAULT NULL,
  `my_level` char(1) DEFAULT NULL,
  `my_level_description` varchar(45) DEFAULT NULL,
  `fans` int unsigned DEFAULT NULL,
  `follow` int unsigned DEFAULT NULL,
  `position_1` char(1) DEFAULT NULL,
  `position_2` char(1) DEFAULT NULL,
  `confirm_status` char(1) DEFAULT NULL,
  `confirm_code` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'David',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(2,'Lisa',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(3,'Tom',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(4,'Amy',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_chatroom`
--

DROP TABLE IF EXISTS `user_chatroom`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_chatroom` (
  `user_id` int unsigned NOT NULL,
  `chatroom_id` int unsigned NOT NULL,
  PRIMARY KEY (`user_id`,`chatroom_id`),
  KEY `chatroom_id` (`chatroom_id`),
  CONSTRAINT `user_chatroom_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_chatroom_ibfk_2` FOREIGN KEY (`chatroom_id`) REFERENCES `chatroom` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_chatroom`
--

LOCK TABLES `user_chatroom` WRITE;
/*!40000 ALTER TABLE `user_chatroom` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_chatroom` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-11-07 13:52:09
