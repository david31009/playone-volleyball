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
  `user_id` int unsigned DEFAULT NULL,
  `commenter_id` int unsigned NOT NULL,
  `group_id` int unsigned NOT NULL,
  `score` tinyint unsigned DEFAULT NULL,
  `content` varchar(45) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  PRIMARY KEY (`commenter_id`,`group_id`),
  KEY `user_id` (`user_id`),
  KEY `group_id` (`group_id`),
  CONSTRAINT `comment_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  CONSTRAINT `comment_ibfk_2` FOREIGN KEY (`commenter_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  CONSTRAINT `comment_ibfk_3` FOREIGN KEY (`group_id`) REFERENCES `group` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comment`
--

LOCK TABLES `comment` WRITE;
/*!40000 ALTER TABLE `comment` DISABLE KEYS */;
INSERT INTO `comment` VALUES (24,22,32,2,'室內的話不希望跟完全打不起來的一起打 都花錢了 還要怕對方跳過來的話 完全不行','2022-11-14 14:24:39'),(24,22,35,1,'Lisa 超讚的，推 推','2022-11-21 20:35:44');
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
  `follow_id` int unsigned NOT NULL,
  PRIMARY KEY (`user_id`,`follow_id`),
  KEY `follow_id` (`follow_id`),
  CONSTRAINT `fans_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fans_ibfk_2` FOREIGN KEY (`follow_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fans`
--

LOCK TABLES `fans` WRITE;
/*!40000 ALTER TABLE `fans` DISABLE KEYS */;
INSERT INTO `fans` VALUES (22,23),(22,24);
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
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `group`
--

LOCK TABLES `group` WRITE;
/*!40000 ALTER TABLE `group` DISABLE KEYS */;
INSERT INTO `group` VALUES (21,22,'一起打球囉 !!!','2022-12-01 10:00:00',180,'1','台北市大安區','大安運動中心','1',1,250,'2','站位觀念、防守、攻擊中等以上(非初學者)\nPS:\n•滿15人成團，上限18人，額滿候補（他團同步徵人，有回覆才算唷！）\n•請先確定不會臨時有狀況沒辦法來再加，避免影響他人權益⚠️\n•現場開放飲食區🍱，另有🥤Coca-Cola自動販賣機🤩\n•請將垃圾分類丟棄',7,9,9,'•本場次徵人以男生不超過半數為前提⚠️',1),(25,24,'《徵女生練球臨打1-5名》','2022-11-16 00:30:00',180,'0','新北市中和區','藍鵲排球館','1',0,0,'2','校隊中上 (歡迎強者來挑戰)',7,9,9,'全女練球(有教練帶)\n<br>\n我們很和善，有興趣一起來練球的請👇留言\n<br>\n謝謝！\n<br>\n*他處同步徵人～\n',1),(26,24,'一起打球囉!!!','2022-11-18 10:00:00',180,'1','新北市中和區','藍鵲排球館','1',1,100,'2','校隊中上 (歡迎強者來挑戰)',7,9,9,'全女練球(有教練帶)',1),(27,22,'《徵女生練球臨打1-5名》','2022-11-19 10:00:00',180,'0','新北市板橋區','65volleyball 球場','1',1,240,'2','站位觀念、防守、攻擊中等以上(非初學者)',7,18,9,'•本場次徵人以男生不超過半數為前提⚠️\n<br>\n•滿15人成團，上限18人，額滿候補（他團同步徵人，有回覆才算唷！）\n<br>\n•請先確定不會臨時有狀況沒辦法來再加，避免影響他人權益⚠️\n<br>\n•現場開放飲食區🍱，另有🥤Coca-Cola自動販賣機🤩\n<br>\n•請將垃圾分類丟棄\n<br>\n️•自備毛巾、水壺（現場有飲水機）\n<br>\n•進入球場須穿著室內鞋\n<br>\n•11/17 19:00前未滿15人流團！',1),(28,24,'《徵6女2男 女網混排》','2022-11-21 10:00:00',180,'1','新北市板橋區','65volleyball','1',0,0,'2','會基本接發',7,9,7,'•本場次徵人以男生不超過半數為前提⚠️',1),(29,24,'一起打球囉!!!','2022-11-22 10:00:00',180,'0','台北市大安區','大安運動中心','0',1,240,'2','站位觀念、防守、攻擊中等以上(非初學者)',7,9,9,'•本場次徵人以男生不超過半數為前提⚠️',1),(30,24,'《徵女生練球臨打1-5名》','2022-11-23 10:00:00',180,'1','台北市大安區','大安運動中心','1',1,240,'2','會基本接發',7,9,9,'補上會回覆(補上)或是私訊，請注意訊息 謝謝，另外如候補順序太後面，覺得補不上，請提早來文上留言-1-2',1),(31,23,'D.B週日午排團徵人中','2022-11-24 10:00:00',180,'1','台北市大安區','大安運動中心','1',0,0,'2','基本接發，穩接就好',7,9,6,'po文下留言告知姓名&性別',1),(32,24,'一起打球囉!!!','2022-11-12 20:00:00',180,'0','台北市中山區','實踐大學','0',1,180,'2','基本接發，穩接就好',7,9,8,'補上會回覆(補上)或是私訊，請注意訊息 謝謝，另外如候補順序太後面，覺得補不上，請提早來文上留言-1-2',1),(33,24,'我要揪團','2022-11-30 10:00:00',180,'1','新北市汐止區','汐止球魔方排球館','1',0,0,'2','會基本接發',7,9,6,'希望是至少大專校隊一般組以上，抑或有在報名菜市場盃的系隊等級',1),(34,24,'《徵6女2男 女網混排 可一起報名》','2022-11-12 10:00:00',180,'1','新北市汐止區','汐止球魔方排球館','1',0,0,'3','校隊中上 (歡迎強者來挑戰)',7,9,9,'po文下留言告知姓名&性別',1),(35,24,'D.B週日午排團徵人中','2022-11-12 10:00:00',180,'1','台南市安定區','歐萊排球角落','0',1,100,'3','舉球：具組織進攻能力<br>快攻：熟悉ABC式快攻<br>邊攻：攻守兼備',7,9,8,'希望是至少大專校隊一般組以上，抑或有在報名菜市場盃的系隊等級',1),(36,22,'D.B週日午排團徵人中','2022-11-30 10:00:00',180,'1','台北市大安區','大安運動中心','1',1,250,'2','站位觀念、防守、攻擊中等以上(非初學者)\nPS:\n•滿15人成團，上限18人，額滿候補（他團同步徵人，有回覆才算唷！）\n•請先確定不會臨時有狀況沒辦法來再加，避免影響他人權益⚠️\n•現場開放飲食區🍱，另有🥤Coca-Cola自動販賣機🤩\n•請將垃圾分類丟棄',7,9,9,'全女練球(有教練帶)全女練球(有教練帶)全女練球(有教練帶)全女練球(有教練帶)全女練球(有教練帶) 全女練球(有教練帶)\n我在測試\n好煩\n全女練球(有教練帶)\n全女練球(有教練帶)\n全女練球(有教練帶)\n全女練球(有教練帶)\n全女練球(有教練帶)',1),(37,22,'一起打球囉 !!!','2022-11-30 10:00:00',180,'1','台北市大安區','大安運動中心','1',1,250,'2','站位觀念、防守、攻擊中等以上(非初學者)\nPS:\n•滿15人成團，上限18人，額滿候補（他團同步徵人，有回覆才算唷！）\n•請先確定不會臨時有狀況沒辦法來再加，避免影響他人權益⚠️\n•現場開放飲食區🍱，另有🥤Coca-Cola自動販賣機🤩\n•請將垃圾分類丟棄',7,9,9,'全女練球(有教練帶)全女練球(有教練帶)全女練球(有教練帶)全女練球(有教練帶)全女練球(有教練帶) 全女練球(有教練帶)\n我在測試\n好煩\n全女練球(有教練帶)\n全女練球(有教練帶)\n全女練球(有教練帶)\n全女練球(有教練帶)\n全女練球(有教練帶)',1),(38,22,'《徵女生練球臨打1-5名》','2022-11-30 10:00:00',180,'1','台北市大安區','大安運動中心','1',1,250,'2','站位觀念、防守、攻擊中等以上(非初學者)\nPS:\n•滿15人成團，上限18人，額滿候補（他團同步徵人，有回覆才算唷！）\n•請先確定不會臨時有狀況沒辦法來再加，避免影響他人權益⚠️\n•現場開放飲食區🍱，另有🥤Coca-Cola自動販賣機🤩\n•請將垃圾分類丟棄',7,9,9,'全女練球(有教練帶)全女練球(有教練帶)全女練球(有教練帶)全女練球(有教練帶)全女練球(有教練帶) 全女練球(有教練帶)\n我在測試\n好煩\n全女練球(有教練帶)\n全女練球(有教練帶)\n全女練球(有教練帶)\n全女練球(有教練帶)\n全女練球(有教練帶)',1),(39,22,'一起打球囉 !!!','2022-11-30 10:00:00',180,'1','台北市大安區','大安運動中心','1',1,250,'2','站位觀念、防守、攻擊中等以上(非初學者)\nPS:\n•滿15人成團，上限18人，額滿候補（他團同步徵人，有回覆才算唷！）\n•請先確定不會臨時有狀況沒辦法來再加，避免影響他人權益⚠️\n•現場開放飲食區🍱，另有🥤Coca-Cola自動販賣機🤩\n•請將垃圾分類丟棄',7,9,9,'全女練球(有教練帶)全女練球(有教練帶)全女練球(有教練帶)全女練球(有教練帶)全女練球(有教練帶) 全女練球(有教練帶)\n我在測試\n好煩\n全女練球(有教練帶)\n全女練球(有教練帶)\n全女練球(有教練帶)\n全女練球(有教練帶)\n全女練球(有教練帶)',1),(40,22,'D.B週日午排團徵人中','2022-11-30 10:00:00',180,'1','台北市大安區','大安運動中心','1',1,250,'2','站位觀念、防守、攻擊中等以上(非初學者)\nPS:\n•滿15人成團，上限18人，額滿候補（他團同步徵人，有回覆才算唷！）\n•請先確定不會臨時有狀況沒辦法來再加，避免影響他人權益⚠️\n•現場開放飲食區🍱，另有🥤Coca-Cola自動販賣機🤩\n•請將垃圾分類丟棄',7,9,9,'全女練球(有教練帶)全女練球(有教練帶)全女練球(有教練帶)全女練球(有教練帶)全女練球(有教練帶) 全女練球(有教練帶)\n我在測試\n好煩\n全女練球(有教練帶)\n全女練球(有教練帶)\n全女練球(有教練帶)\n全女練球(有教練帶)\n全女練球(有教練帶)',1);
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
INSERT INTO `member` VALUES (22,28,'0'),(22,31,'0'),(22,32,'1'),(22,35,'1'),(23,21,'2'),(24,21,'0'),(25,21,'1'),(26,21,'0'),(27,21,'2'),(27,25,'1');
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
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `msg_board`
--

LOCK TABLES `msg_board` WRITE;
/*!40000 ALTER TABLE `msg_board` DISABLE KEYS */;
INSERT INTO `msg_board` VALUES (7,22,28,'請問還有多少人可以報名?','2022-11-14 15:48:04'),(8,22,28,'主揪人超讚','2022-11-14 15:50:27'),(9,22,31,'a','2022-11-18 18:01:24'),(10,22,31,'as','2022-11-18 18:21:57'),(11,22,31,'as','2022-11-18 18:22:10'),(12,22,31,'as','2022-11-18 18:23:04'),(13,22,31,'sd','2022-11-18 18:41:31'),(14,22,31,'sd','2022-11-18 18:41:33'),(15,22,31,'sd','2022-11-18 18:41:35'),(16,22,31,'dfdfdf','2022-11-18 18:41:36'),(17,22,31,'dfdf','2022-11-18 18:41:38'),(18,22,31,'df','2022-11-18 18:41:48'),(19,22,31,'as','2022-11-18 18:43:19'),(20,22,31,'dfdfdfdf','2022-11-18 18:43:22'),(21,22,27,'asaasa','2022-11-18 18:51:33'),(22,22,27,'asasas','2022-11-18 18:51:34'),(23,22,27,'dfdfdfdf','2022-11-18 18:53:36'),(24,22,27,'dfdfdfdf','2022-11-18 18:53:39'),(25,22,21,'hi\n','2022-11-11 18:12:12'),(26,22,21,'請問還有多少人可以報名?','2022-11-21 11:55:46'),(27,22,21,'主揪人超讚，推推','2022-11-21 11:56:33'),(28,22,21,'今天颱風好像要來ㄟ','2022-11-21 12:00:00'),(29,22,21,'清問有成團嗎?','2022-11-21 12:00:25'),(30,22,21,'感覺很激烈','2022-11-22 09:10:56');
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
  `password` char(60) DEFAULT NULL,
  `gender` char(1) DEFAULT NULL,
  `intro` varchar(255) DEFAULT NULL,
  `county` char(3) DEFAULT NULL,
  `my_level` char(1) DEFAULT NULL,
  `my_level_description` varchar(45) DEFAULT NULL,
  `fans` int unsigned DEFAULT '0',
  `follow` int unsigned DEFAULT '0',
  `position_1` char(1) DEFAULT NULL,
  `position_2` char(1) DEFAULT NULL,
  `confirm_status` char(1) DEFAULT NULL,
  `confirm_code` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (22,'David','david@gmail.com','$2b$10$uglX0YP7K2xrB2aCeklffuiQFr.j8J0ZovolRhwMmSzMlVtrXCwJK','1','大家好，我是 David，是後端班的成員，大學跟碩士是生科相關，但有蠻多時間都在寫程式，之前在學術界從事科學研究，後來覺得自己不是當科學家的料，所以決定轉往軟體業，希望未來能往Web3 的產業發展～\n希望大家明年初都能找到軟體業的工作！','苗栗縣','2','那麼攔中呢？\n攔中的責任就是要能夠帶動攔網，\n俗話說攔網就是最好的攻擊嘛！',0,2,'1','2',NULL,NULL),(23,'Amy','amy@gmail.com','$2b$10$r4VPgxURPBNJ9eDnDf8KiumIm0pLR9Z98Zde2PECypev.wwG6loQe',NULL,'大家好，我是 Amy，是後端班的成員，大學跟碩士是生科相關，但有蠻多時間都在寫程式，之前在學術界從事科學研究，後來覺得自己不是當科學家的料，所以決定轉往軟體業，希望未來能往Web3 的產業發展～','苗栗縣','3','身為一個大砲手，我的職責就是得分，第三球來了不論是好球或是修正，我都必須處理過去。',1,0,'2','0',NULL,NULL),(24,'Lisa','lisa@gmail.com','$2b$10$/qAWynV2IG8FVColdEyPNuhio0Rciy4eeCfTTTLpqkKYH7kEwGD72','0','Hi 的大家！\n我是 Lisa，背景是營養與生科領域，也有一點 machine/deep learning 的基礎；過去寫過 R 跟 Python，對 data 領域很有興趣。\n近半年來研究所休學+當完兵剛退伍，非常期待接下來在School 認識大家與大家一起學習，一起轉職工程師！','台北市','0','身為一個大砲手，我的職責就是得分，第三球來了不論是好球或是修正，我都必須處理過去。',1,0,'0','1',NULL,NULL),(25,'Jack','jack@gmail.com','$2b$10$HXQStvFsEBKzZAKLM766uuCD04zQHDf6T4JuLQcowyw0Qu0nxBKA2',NULL,'大家好，我是 Jack，是後端班的成員，大學跟碩士是生科相關，但有蠻多時間都在寫程式，之前在學術界從事科學研究，後來覺得自己不是當科學家的料，所以決定轉往軟體業，希望未來能往Web3 的產業發展～','台北市','1','身為一個大砲手，我的職責就是得分，第三球來了不論是好球或是修正，我都必須處理過去。',0,0,'4','3',NULL,NULL),(26,'Rita','rita@gmail.com','$2b$10$KUoPK2S/sFvVEpNOyCmSbu8LOFXSU8qZd.UkqD/t0AguMN9KU5ojy',NULL,'大家好，我是 Rita，是後端班的成員，大學跟碩士是生科相關，但有蠻多時間都在寫程式，之前在學術界從事科學研究，後來覺得自己不是當科學家的料，所以決定轉往軟體業，希望未來能往Web3 的產業發展～','台北市','4','身為一個大砲手，我的職責就是得分，第三球來了不論是好球或是修正，我都必須處理過去。',0,0,'3','4',NULL,NULL),(27,'Tony','tony@gmail.com','$2b$10$4m.FLkrbFpDL0b8eHTHJ3OoPc1Cc0D5KCEFbzUIpuSLpMN4K1DvXO',NULL,'大家好，我是 Tony，是後端班的成員，大學跟碩士是生科相關，但有蠻多時間都在寫程式，之前在學術界從事科學研究，後來覺得自己不是當科學家的料，所以決定轉往軟體業，希望未來能往Web3 的產業發展～','台北市','1','身為一個大砲手，我的職責就是得分，第三球來了不論是好球或是修正，我都必須處理過去。',0,0,'2','1',NULL,NULL),(28,'Yuli','yuli@gmail.com','$2b$10$kS7XRvsapKVSzppXH/zrQuGO.JnHnwVn.t67TrpfWt0s6vFRzICO.',NULL,'大家好，我是 Yuli，是後端班的成員，大學跟碩士是生科相關，但有蠻多時間都在寫程式，之前在學術界從事科學研究，後來覺得自己不是當科學家的料，所以決定轉往軟體業，希望未來能往Web3 的產業發展～','台北市','2','身為一個大砲手，我的職責就是得分，第三球來了不論是好球或是修正，我都必須處理過去。',0,0,'1','2',NULL,NULL);
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

-- Dump completed on 2022-11-22  2:38:03
