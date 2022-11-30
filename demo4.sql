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
  `content` varchar(255) DEFAULT NULL,
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
INSERT INTO `comment` VALUES (13,12,14,5,'第二次參加阿義的團了，真的好讚~~新人友善喔','2022-11-28 20:30:43'),(13,12,20,3,'阿逸，人帥又會打球!! (我是迷妹)','2022-11-28 20:29:56'),(12,13,7,3,'Lisa 雖然沒有到超強，但人很好~~','2022-11-28 20:35:13'),(15,13,18,4,'Mark 人超 nice，打球也超猛','2022-11-28 20:24:46'),(15,13,21,5,'Mark 大腿啊 !! 有一球差點被打到臉，還好他幫我擋掉了','2022-11-28 20:26:52'),(12,15,7,4,'Lisa 太謙虛啦，明明很猛~~','2022-11-28 20:41:35'),(13,15,20,2,'阿逸雖然很猛，但在場上有點嚴肅，但私底下人還是蠻好的','2022-11-28 20:40:41');
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
INSERT INTO `fans` VALUES (13,12),(12,13);
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
  `title` varchar(20) DEFAULT NULL,
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
) ENGINE=InnoDB AUTO_INCREMENT=79 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `group`
--

LOCK TABLES `group` WRITE;
/*!40000 ALTER TABLE `group` DISABLE KEYS */;
INSERT INTO `group` VALUES (1,12,'連假早起頭前團（他團同步徵人）','2022-12-01 19:00:00',240,'1','新北市新莊區','頭前國中','0',1,250,'2','社團強度：不跑戰術居多，系隊以上',7,16,6,'可以早點到暖身唷！',1),(2,13,'[徵女性臨打]','2022-11-26 20:00:00',150,'0','台北市萬華區','華江國小4F活動中心','0',1,100,'0','※ 程度中上者佳，須有穩定接發接扣防守站位觀念及攻擊能力。來回多，球友友善包容，非歡樂場！',4,2,7,'(如果臨打程度及球風可適應，歡迎加入固定臨打人員或之後季打甚至是主揪其他場地。)\n※ 同步徵人中。',1),(3,15,'揪臨打12人 內建12人','2022-12-01 21:00:00',180,'1','台北市松山區','敦化國中室外排球場','1',0,0,'1','社團強度：不跑戰術居多，系隊以上',7,9,9,'場地特色：全日自然空調、水泥地板、附飲水機、廁所，視野好場地佳。\n機車可免費停校門口人行道。\n\n男網混排，24-30人制，連2勝下play1，有基礎攻防概念佳，氣氛歡樂。\n下雨流團，會在此文同步。\n\n有興趣的球友可以私訊或底下留言報名喔~他團同步徵人中，先搶先贏，額滿為止。',1),(4,12,'～徵臨打 5人 男女不拘～','2022-11-27 22:00:00',90,'0','新北市板橋區','板橋國中室內體育館','0',1,75,'3','※ 程度中上者佳，須有穩定接發接扣防守站位觀念及攻擊能力。來回多，球友友善包容，非歡樂場！',7,9,4,'※在需求人數公告額滿後如不排候補者，還請幫忙在原留言串下取消。\n※1930前禁止進入校園\n※如出席有異動請幫忙提早告知\n※請跟警衛打招呼，表明來意，本場負責人:張大哥\n※如有生病發燒請勿入校，進校門須量額溫。\n※校區全面禁止吸菸，垃圾帶走\n※場地提供汽機車停車場、飲水機\n=為配合校園安全管制措施以下幾點務必留意並遵守=\n※活動開始後30分鐘，校門隨即關閉，校園即不得再任意進出\n※結束前10分鐘方可開放離校\n※活動結束後請於10分鐘之內離開校園\n~感謝各位的配合~如果有興趣的朋友，請於底下留言~',1),(5,13,'🏐誠徵臨打🏐','2022-12-01 18:00:00',180,'1','新北市汐止區','球魔方排球館','0',1,230,'4','會基本接發',7,2,2,'⚠️多團徵人確定補上會留言通知臨打',0),(6,15,'連假早起頭前團（他團同步徵人）','2022-12-01 19:00:00',240,'1','新北市新莊區','頭前國中','0',1,250,'0','社團強度：不跑戰術居多，系隊以上',7,16,8,'可以早點到暖身唷！',1),(7,12,'[徵女性臨打]','2022-12-01 20:00:00',150,'0','台北市萬華區','華江國小4F活動中心','0',1,100,'1','※ 程度中上者佳，須有穩定接發接扣防守站位觀念及攻擊能力。來回多，球友友善包容，非歡樂場！',4,2,9,'(如果臨打程度及球風可適應，歡迎加入固定臨打人員或之後季打甚至是主揪其他場地。)\n※ 同步徵人中。',0),(8,13,'揪臨打12人 內建12人','2022-12-01 21:00:00',180,'1','台北市松山區','敦化國中室外排球場','1',0,0,'3','社團強度：不跑戰術居多，系隊以上',7,9,3,'場地特色：全日自然空調、水泥地板、附飲水機、廁所，視野好場地佳。\n機車可免費停校門口人行道。\n\n男網混排，24-30人制，連2勝下play1，有基礎攻防概念佳，氣氛歡樂。\n下雨流團，會在此文同步。\n\n有興趣的球友可以私訊或底下留言報名喔~他團同步徵人中，先搶先贏，額滿為止。',1),(9,15,'～徵臨打 5人 男女不拘～','2022-12-01 22:00:00',90,'0','新北市板橋區','板橋國中室內體育館','0',1,75,'2','※ 程度中上者佳，須有穩定接發接扣防守站位觀念及攻擊能力。來回多，球友友善包容，非歡樂場！',7,9,8,'※在需求人數公告額滿後如不排候補者，還請幫忙在原留言串下取消。\n※1930前禁止進入校園\n※如出席有異動請幫忙提早告知\n※請跟警衛打招呼，表明來意，本場負責人:張大哥\n※如有生病發燒請勿入校，進校門須量額溫。\n※校區全面禁止吸菸，垃圾帶走\n※場地提供汽機車停車場、飲水機\n=為配合校園安全管制措施以下幾點務必留意並遵守=\n※活動開始後30分鐘，校門隨即關閉，校園即不得再任意進出\n※結束前10分鐘方可開放離校\n※活動結束後請於10分鐘之內離開校園\n~感謝各位的配合~如果有興趣的朋友，請於底下留言~',0),(10,12,'🏐誠徵臨打🏐','2022-12-01 18:30:00',180,'1','新北市汐止區','球魔方排球館','0',1,230,'1','會基本接發',7,2,1,'⚠️多團徵人確定補上會留言通知臨打',1),(11,13,'連假早起頭前團（他團同步徵人）','2022-12-01 19:00:00',240,'1','新北市新莊區','頭前國中','0',1,250,'0','社團強度：不跑戰術居多，系隊以上',7,4,4,'可以早點到暖身唷！',1),(12,15,'連假早起頭前團（他團同步徵人）','2022-12-01 19:00:00',240,'1','新北市新莊區','頭前國中','0',1,250,'1','社團強度：不跑戰術居多，系隊以上',7,16,7,'可以早點到暖身唷！',1),(13,12,'[徵女性臨打]','2022-12-01 20:00:00',150,'0','台北市萬華區','華江國小4F活動中心','0',1,100,'2','※ 程度中上者佳，須有穩定接發接扣防守站位觀念及攻擊能力。來回多，球友友善包容，非歡樂場！',4,2,8,'(如果臨打程度及球風可適應，歡迎加入固定臨打人員或之後季打甚至是主揪其他場地。)\n※ 同步徵人中。',0),(14,13,'揪臨打12人 內建12人','2022-12-01 21:00:00',180,'1','台北市松山區','敦化國中室外排球場','1',0,0,'4','會基本接發',7,9,4,'場地特色：全日自然空調、水泥地板、附飲水機、廁所，視野好場地佳。\n機車可免費停校門口人行道。\n\n男網混排，24-30人制，連2勝下play1，有基礎攻防概念佳，氣氛歡樂。\n下雨流團，會在此文同步。\n\n有興趣的球友可以私訊或底下留言報名喔~他團同步徵人中，先搶先贏，額滿為止。',0),(15,15,'～徵臨打 5人 男女不拘～','2022-12-01 22:00:00',90,'0','新北市板橋區','板橋國中室內體育館','0',1,75,'0','會基本接發',7,9,9,'※在需求人數公告額滿後如不排候補者，還請幫忙在原留言串下取消。\n※1930前禁止進入校園\n※如出席有異動請幫忙提早告知\n※請跟警衛打招呼，表明來意，本場負責人:張大哥\n※如有生病發燒請勿入校，進校門須量額溫。\n※校區全面禁止吸菸，垃圾帶走\n※場地提供汽機車停車場、飲水機\n=為配合校園安全管制措施以下幾點務必留意並遵守=\n※活動開始後30分鐘，校門隨即關閉，校園即不得再任意進出\n※結束前10分鐘方可開放離校\n※活動結束後請於10分鐘之內離開校園\n~感謝各位的配合~如果有興趣的朋友，請於底下留言~',1),(16,12,'🏐誠徵臨打🏐','2022-12-01 17:30:00',180,'1','新北市汐止區','球魔方排球館','0',1,230,'1','會基本接發',7,2,2,'⚠️多團徵人確定補上會留言通知臨打',0),(17,13,'[徵女性臨打]','2022-12-01 20:00:00',150,'0','台北市萬華區','華江國小4F活動中心','0',1,100,'0','※ 程度中上者佳，須有穩定接發接扣防守站位觀念及攻擊能力。來回多，球友友善包容，非歡樂場！',4,2,9,'(如果臨打程度及球風可適應，歡迎加入固定臨打人員或之後季打甚至是主揪其他場地。)\n※ 同步徵人中。',1),(18,15,'揪臨打12人 內建12人','2022-12-01 21:00:00',180,'1','台北市松山區','敦化國中室外排球場','1',0,0,'3','會基本接發',7,9,8,'場地特色：全日自然空調、水泥地板、附飲水機、廁所，視野好場地佳。\n機車可免費停校門口人行道。\n\n男網混排，24-30人制，連2勝下play1，有基礎攻防概念佳，氣氛歡樂。\n下雨流團，會在此文同步。\n\n有興趣的球友可以私訊或底下留言報名喔~他團同步徵人中，先搶先贏，額滿為止。',0),(19,12,'～徵臨打 5人 男女不拘～','2022-12-01 22:00:00',90,'0','新北市板橋區','板橋國中室內體育館','0',1,75,'4','※ 程度中上者佳，須有穩定接發接扣防守站位觀念及攻擊能力。來回多，球友友善包容，非歡樂場！',7,9,7,'※在需求人數公告額滿後如不排候補者，還請幫忙在原留言串下取消。\n※1930前禁止進入校園\n※如出席有異動請幫忙提早告知\n※請跟警衛打招呼，表明來意，本場負責人:張大哥\n※如有生病發燒請勿入校，進校門須量額溫。\n※校區全面禁止吸菸，垃圾帶走\n※場地提供汽機車停車場、飲水機\n\n=為配合校園安全管制措施以下幾點務必留意並遵守=\n※活動開始後30分鐘，校門隨即關閉，校園即不得再任意進出\n※結束前10分鐘方可開放離校\n※活動結束後請於10分鐘之內離開校園\n~感謝各位的配合~如果有興趣的朋友，請於底下留言~',1),(20,13,'🏐誠徵臨打🏐','2022-12-01 23:00:00',180,'1','新北市汐止區','球魔方排球館','0',1,230,'2','會基本接發',7,2,2,'⚠️多團徵人確定補上會留言通知臨打',0),(21,15,'[🏐徵女網混排臨打🏐]','2022-11-27 23:00:00',180,'1','台北市萬華區','華江高中體育館2樓','0',1,200,'1','社團強度：不跑戰術居多，系隊以上',7,10,2,'賽制：女網混排打二休一、上限18人\n器材：MVA200或MVA300、記分板、飲水機\n註：此為混排，男性名額優先給同時報名女性者補滿女性，且由於在多版徵人，請以原po回覆為準，經回覆者亦請勿任意退出，還請協助配合，感恩感恩！🙏',1),(22,13,'[徵女性臨打]','2022-12-01 20:00:00',150,'0','台北市萬華區','華江國小4F活動中心','0',1,100,'2','※ 程度中上者佳，須有穩定接發接扣防守站位觀念及攻擊能力。來回多，球友友善包容，非歡樂場！',4,2,1,'(如果臨打程度及球風可適應，歡迎加入固定臨打人員或之後季打甚至是主揪其他場地。)\n※ 同步徵人中。',1),(23,13,'[徵女性臨打]','2022-12-01 21:00:00',150,'0','台北市萬華區','華江國小4F活動中心','0',1,100,'2','※ 程度中上者佳，須有穩定接發接扣防守站位觀念及攻擊能力。來回多，球友友善包容，非歡樂場！',4,2,2,'(如果臨打程度及球風可適應，歡迎加入固定臨打人員或之後季打甚至是主揪其他場地。)\n※ 同步徵人中。',1),(24,15,'[🏐徵女網混排臨打🏐]','2022-11-27 22:00:00',180,'1','台北市萬華區','華江高中體育館2樓','0',1,200,'1','社團強度：不跑戰術居多，系隊以上',7,10,2,'賽制：女網混排打二休一、上限18人\n器材：MVA200或MVA300、記分板、飲水機\n註：此為混排，男性名額優先給同時報名女性者補滿女性，且由於在多版徵人，請以原po回覆為準，經回覆者亦請勿任意退出，還請協助配合，感恩感恩！🙏',1),(25,12,'連假早起頭前團（他團同步徵人）','2022-12-01 19:00:00',240,'1','新北市新莊區','頭前國中','0',1,250,'2','社團強度：不跑戰術居多，系隊以上',7,16,6,'可以早點到暖身唷！',1),(26,15,'連假早起頭前團（他團同步徵人）','2022-12-01 19:00:00',240,'1','新北市新莊區','頭前國中','0',1,250,'0','社團強度：不跑戰術居多，系隊以上',7,16,8,'可以早點到暖身唷！',1),(27,13,'[徵女性臨打]','2022-12-01 20:00:00',150,'0','台北市萬華區','華江國小4F活動中心','0',1,100,'0','※ 程度中上者佳，須有穩定接發接扣防守站位觀念及攻擊能力。來回多，球友友善包容，非歡樂場！',4,2,9,'(如果臨打程度及球風可適應，歡迎加入固定臨打人員或之後季打甚至是主揪其他場地。)\n※ 同步徵人中。',1),(28,15,'～徵臨打 5人 男女不拘～','2022-12-01 22:00:00',90,'0','新北市板橋區','板橋國中室內體育館','0',1,75,'0','會基本接發',7,9,9,'※在需求人數公告額滿後如不排候補者，還請幫忙在原留言串下取消。\n※1930前禁止進入校園\n※如出席有異動請幫忙提早告知\n※請跟警衛打招呼，表明來意，本場負責人:張大哥\n※如有生病發燒請勿入校，進校門須量額溫。\n※校區全面禁止吸菸，垃圾帶走\n※場地提供汽機車停車場、飲水機\n=為配合校園安全管制措施以下幾點務必留意並遵守=\n※活動開始後30分鐘，校門隨即關閉，校園即不得再任意進出\n※結束前10分鐘方可開放離校\n※活動結束後請於10分鐘之內離開校園\n~感謝各位的配合~如果有興趣的朋友，請於底下留言~',1),(72,13,'我要揪團','2022-12-01 23:00:00',180,'1','台北市內湖區','大安運動中心','0',1,12,'2','會基本接發',7,9,9,'我要揪團',1),(78,13,'我要揪團','2022-12-01 19:30:00',180,'1','台北市內湖區','大安運動中心','0',1,100,'2','會基本接發',7,9,9,'我要揪團',1);
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
INSERT INTO `member` VALUES (12,2,'0'),(12,5,'2'),(12,8,'0'),(12,9,'1'),(12,14,'1'),(12,17,'0'),(12,20,'1'),(12,21,'1'),(12,22,'0'),(13,1,'0'),(13,4,'1'),(13,7,'1'),(13,9,'1'),(13,13,'2'),(13,18,'1'),(13,19,'0'),(13,21,'1'),(15,1,'0'),(15,5,'1'),(15,7,'1'),(15,8,'0'),(15,10,'0'),(15,11,'1'),(15,13,'1'),(15,14,'1'),(15,19,'0'),(15,20,'1'),(15,22,'0');
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
  `content` varchar(255) DEFAULT NULL,
  `time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `group_id` (`group_id`),
  CONSTRAINT `msg_board_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  CONSTRAINT `msg_board_ibfk_2` FOREIGN KEY (`group_id`) REFERENCES `group` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `msg_board`
--

LOCK TABLES `msg_board` WRITE;
/*!40000 ALTER TABLE `msg_board` DISABLE KEYS */;
INSERT INTO `msg_board` VALUES (1,13,19,'請問還有位置嗎?','2022-11-28 21:06:32'),(4,13,15,'試試看','2022-11-29 23:41:18'),(18,13,19,'試試看','2022-11-30 14:50:20');
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
  `provider` varchar(10) DEFAULT NULL,
  `username` varchar(20) DEFAULT NULL,
  `email` varchar(45) DEFAULT NULL,
  `password` char(60) DEFAULT NULL,
  `gender` char(1) DEFAULT NULL,
  `intro` varchar(500) DEFAULT NULL,
  `county` char(3) DEFAULT NULL,
  `my_level` char(1) DEFAULT NULL,
  `my_level_description` varchar(500) DEFAULT NULL,
  `fans` int unsigned DEFAULT '0',
  `follow` int unsigned DEFAULT '0',
  `position_1` char(1) DEFAULT NULL,
  `position_2` char(1) DEFAULT NULL,
  `confirm_status` char(1) DEFAULT NULL,
  `confirm_code` char(60) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (12,'native','Lisa','nccusaact16th@gmail.com','$2b$10$g0LGBT8cymhidahO7IzgD.ovXZcWXGz3RaRhJdPYXMGiLf2QDTCpa','0','大家好，我是 Lisa，歡迎加入 PLAYONE 排球團，一起快樂打排球','台北市','0','- 練系隊2年\n- 接發程度普普，最近瘋狂接噴\n- 攻擊成功率 30% (好常掛網好煩)\n- 打大砲攻擊要加強',1,1,'1','3',NULL,NULL),(13,'native','阿逸','david31009@gmail.com','$2b$10$cpwcKU2YcHs0ooW9qlCE/e7hHP3cX9KS4Ox9zNZ26Emj/0lHaOOaW','1',NULL,'台北市','2','- 練系隊四年\n- 接發程度中上，偶爾接噴\n- 攻擊成功率 70%\n- 打攔中攻擊普普',2,1,NULL,NULL,NULL,NULL),(15,'native','Mark','p66084104@gs.ncku.edu.tw','$2b$10$b.2F7jD2NRHljbOVC5RBnOK.8UyXEU/hn11BhwVzKlbIgzJY9uoea','1','大家好，我是 Mark，歡迎加入 PLAYONE 排球團，一起快樂打排球','新北市','3','- 練校隊 3 年\n- 接發程度中上，偶爾接噴\n- 從小打校隊出生\n- 攻擊成功率 80%\n- 積極練習舉球中',0,0,'0','3',NULL,NULL),(17,'native','test','test@gmail.com','$2b$10$z1l0dmRulAC2hAwYYDgXU.Tzn4mYjp3D.EGByB27BEOOb9RBXHJaS',NULL,NULL,NULL,NULL,NULL,0,0,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-11-30 17:41:38
