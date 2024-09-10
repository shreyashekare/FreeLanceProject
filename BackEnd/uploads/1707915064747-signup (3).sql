-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 14, 2024 at 07:58 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `signup`
--

-- --------------------------------------------------------

--
-- Table structure for table `dailyexpenses`
--

CREATE TABLE `dailyexpenses` (
  `id` int(11) NOT NULL,
  `expenses_id` int(11) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `date` datetime NOT NULL,
  `expenseBy_id` int(11) NOT NULL,
  `selectedFile` varchar(255) DEFAULT NULL,
  `status` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `dailyexpenses`
--

INSERT INTO `dailyexpenses` (`id`, `expenses_id`, `amount`, `date`, `expenseBy_id`, `selectedFile`, `status`, `createdAt`, `updatedAt`) VALUES
(1, 3, 8888.00, '2024-01-13 00:00:00', 1, '1706791243197-arrytech.png', 1, '2024-01-31 10:57:49', '2024-02-05 13:45:39'),
(2, 2, 3333.00, '2024-01-11 00:00:00', 1, '1706793429895-ass3.png', 1, '2024-01-31 12:01:22', '2024-02-07 13:19:07'),
(3, 1, 20.00, '2024-01-20 00:00:00', 1, '1706793453057-BIRD.JPG', 1, '2024-01-31 12:02:19', '2024-02-05 13:53:19'),
(4, 3, 23244.00, '2024-01-07 00:00:00', 1, '1706793461891-Happy-Diwali-2013-laxmi-ganesha-Wallpaper.jpg', 1, '2024-01-31 12:07:01', '2024-02-01 13:19:56'),
(5, 3, 2222.00, '2024-01-06 00:00:00', 1, '1706793470874-happy-diwali-2013-laxmi-ganesha-wallpaper_001.jpg', 1, '2024-01-31 12:11:13', '2024-02-05 13:53:20'),
(6, 1, 222222.00, '2023-03-02 00:00:00', 5, NULL, 1, '2024-02-02 10:07:17', '2024-02-02 10:07:17'),
(7, 2, 3333.00, '2024-01-11 00:00:00', 1, '1706793429895-ass3.png', 1, '2024-01-31 12:01:22', '2024-02-07 13:19:47'),
(8, 2, 3333.00, '2024-01-11 00:00:00', 1, '1706793429895-ass3.png', 1, '2024-01-31 12:01:22', '2024-02-07 13:19:48'),
(9, 2, 3333.00, '2024-01-11 00:00:00', 1, '1706793429895-ass3.png', 1, '2024-01-31 12:01:22', '2024-02-05 13:53:40'),
(10, 2, 3333.00, '2024-01-11 00:00:00', 1, '1706793429895-ass3.png', 1, '2024-01-31 12:01:22', '2024-02-05 13:53:40'),
(11, 2, 3333.00, '2024-01-11 00:00:00', 1, '1706793429895-ass3.png', 1, '2024-01-31 12:01:22', '2024-02-05 13:53:40'),
(12, 2, 3333.00, '2024-01-11 00:00:00', 1, '1706793429895-ass3.png', 1, '2024-01-31 12:01:22', '2024-02-05 13:53:40'),
(13, 2, 3333.00, '2024-01-11 00:00:00', 1, '1706793429895-ass3.png', 1, '2024-01-31 12:01:22', '2024-02-05 13:53:40'),
(14, 2, 3333.00, '2024-01-11 00:00:00', 1, '1706793429895-ass3.png', 1, '2024-01-31 12:01:22', '2024-02-05 13:53:40'),
(15, 2, 3333.00, '2024-01-11 00:00:00', 1, '1706793429895-ass3.png', 1, '2024-01-31 12:01:22', '2024-02-05 13:53:40'),
(16, 2, 3333.00, '2024-01-11 00:00:00', 1, '1706793429895-ass3.png', 1, '2024-01-31 12:01:22', '2024-02-05 13:53:40'),
(17, 2, 3333.00, '2024-01-11 00:00:00', 1, '1706793429895-ass3.png', 1, '2024-01-31 12:01:22', '2024-02-05 13:53:40'),
(18, 2, 3333.00, '2024-01-11 00:00:00', 1, '1706793429895-ass3.png', 1, '2024-01-31 12:01:22', '2024-02-05 13:53:40'),
(19, 2, 3333.00, '2024-01-11 00:00:00', 1, '1706793429895-ass3.png', 1, '2024-01-31 12:01:22', '2024-02-05 13:53:40'),
(20, 2, 3333.00, '2024-01-11 00:00:00', 1, '1706793429895-ass3.png', 1, '2024-01-31 12:01:22', '2024-02-05 13:53:40'),
(21, 2, 3333.00, '2024-01-11 00:00:00', 1, '1706793429895-ass3.png', 1, '2024-01-31 12:01:22', '2024-02-05 13:53:40'),
(22, 2, 3333.00, '2024-01-11 00:00:00', 1, '1706793429895-ass3.png', 1, '2024-01-31 12:01:22', '2024-02-05 13:53:40'),
(23, 2, 3333.00, '2024-01-11 00:00:00', 1, '1706793429895-ass3.png', 1, '2024-01-31 12:01:22', '2024-02-05 13:53:40'),
(24, 2, 3333.00, '2024-01-11 00:00:00', 1, '1706793429895-ass3.png', 1, '2024-01-31 12:01:22', '2024-02-05 13:53:40'),
(25, 2, 3333.00, '2024-01-11 00:00:00', 1, '1706793429895-ass3.png', 1, '2024-01-31 12:01:22', '2024-02-05 13:53:40'),
(26, 2, 3333.00, '2024-01-11 00:00:00', 1, '1706793429895-ass3.png', 1, '2024-01-31 12:01:22', '2024-02-05 13:53:40'),
(27, 2, 3333.00, '2024-01-11 00:00:00', 1, '1706793429895-ass3.png', 1, '2024-01-31 12:01:22', '2024-02-05 13:53:40'),
(28, 2, 3333.00, '2024-01-11 00:00:00', 1, '1706793429895-ass3.png', 1, '2024-01-31 12:01:22', '2024-02-05 13:53:40'),
(29, 2, 3333.00, '2024-01-11 00:00:00', 1, '1706793429895-ass3.png', 1, '2024-01-31 12:01:22', '2024-02-05 13:53:40'),
(30, 2, 3333.00, '2024-01-11 00:00:00', 1, '1706793429895-ass3.png', 1, '2024-01-31 12:01:22', '2024-02-05 13:53:40'),
(31, 2, 3333.00, '2024-01-11 00:00:00', 1, '1706793429895-ass3.png', 1, '2024-01-31 12:01:22', '2024-02-05 13:53:40'),
(32, 2, 3333.00, '2024-01-11 00:00:00', 1, '1706793429895-ass3.png', 1, '2024-01-31 12:01:22', '2024-02-05 13:53:40'),
(33, 2, 3333.00, '2024-01-11 00:00:00', 1, '1706793429895-ass3.png', 1, '2024-01-31 12:01:22', '2024-02-05 13:53:40'),
(34, 2, 3333.00, '2024-01-11 00:00:00', 1, '1706793429895-ass3.png', 1, '2024-01-31 12:01:22', '2024-02-05 13:53:40'),
(35, 2, 3333.00, '2024-01-11 00:00:00', 1, '1706793429895-ass3.png', 1, '2024-01-31 12:01:22', '2024-02-05 13:53:40'),
(36, 2, 3333.00, '2024-01-11 00:00:00', 1, '1706793429895-ass3.png', 1, '2024-01-31 12:01:22', '2024-02-05 13:53:40'),
(37, 2, 3333.00, '2024-01-11 00:00:00', 1, '1706793429895-ass3.png', 1, '2024-01-31 12:01:22', '2024-02-05 13:53:40'),
(38, 2, 3333.00, '2024-01-11 00:00:00', 1, '1706793429895-ass3.png', 1, '2024-01-31 12:01:22', '2024-02-05 13:53:40'),
(39, 2, 3333.00, '2024-01-11 00:00:00', 1, '1706793429895-ass3.png', 1, '2024-01-31 12:01:22', '2024-02-05 13:53:40'),
(40, 2, 3333.00, '2024-01-11 00:00:00', 1, '1706793429895-ass3.png', 1, '2024-01-31 12:01:22', '2024-02-05 13:53:40'),
(41, 2, 3333.00, '2024-01-11 00:00:00', 1, '1706793429895-ass3.png', 1, '2024-01-31 12:01:22', '2024-02-05 13:53:40'),
(42, 2, 3333.00, '2024-01-11 00:00:00', 1, '1706793429895-ass3.png', 1, '2024-01-31 12:01:22', '2024-02-05 13:53:40'),
(43, 2, 3333.00, '2024-01-11 00:00:00', 1, '1706793429895-ass3.png', 1, '2024-01-31 12:01:22', '2024-02-05 13:53:40'),
(44, 2, 3333.00, '2024-01-11 00:00:00', 1, '1706793429895-ass3.png', 1, '2024-01-31 12:01:22', '2024-02-05 13:53:40');

-- --------------------------------------------------------

--
-- Table structure for table `designations`
--

CREATE TABLE `designations` (
  `id` int(11) NOT NULL,
  `designation` varchar(255) NOT NULL,
  `status` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `designations`
--

INSERT INTO `designations` (`id`, `designation`, `status`, `createdAt`, `updatedAt`) VALUES
(1, 'dsdsadd', 1, '2024-01-20 07:51:35', '2024-02-09 08:00:16'),
(2, 'developer', 1, '2024-01-20 07:51:47', '2024-01-24 07:52:52'),
(3, 'Gamer', 0, '2024-01-20 07:51:55', '2024-01-24 07:53:21'),
(4, 'frontenddeveloper', 1, '2024-01-20 07:52:09', '2024-01-23 10:56:56'),
(5, 'backenddeveloper', 1, '2024-01-20 07:52:27', '2024-01-24 07:53:18'),
(6, 'aaaa', 0, '2024-01-20 07:52:36', '2024-01-31 07:38:42'),
(7, 'flutter', 0, '2024-01-20 07:56:20', '2024-01-31 07:38:43'),
(8, 'sasas', 0, '2024-01-20 10:08:24', '2024-01-24 07:53:08'),
(9, 'sasasaa', 0, '2024-01-20 10:10:27', '2024-01-22 06:09:19'),
(10, 'xsx', 1, '2024-01-24 13:29:50', '2024-01-24 13:29:50'),
(11, 'xsxsxasx', 1, '2024-01-24 13:30:13', '2024-01-24 13:30:13');

-- --------------------------------------------------------

--
-- Table structure for table `employees`
--

CREATE TABLE `employees` (
  `id` int(11) NOT NULL,
  `firstName` varchar(255) NOT NULL,
  `midName` varchar(255) DEFAULT NULL,
  `lastName` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `contact` int(11) NOT NULL,
  `address` varchar(255) NOT NULL,
  `panCard` varchar(255) DEFAULT NULL,
  `adhar` int(11) DEFAULT NULL,
  `dob` varchar(255) NOT NULL,
  `gender` varchar(255) NOT NULL,
  `status` tinyint(1) NOT NULL,
  `designation_id` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `joiningDate` varchar(255) NOT NULL,
  `relievingDate` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employees`
--

INSERT INTO `employees` (`id`, `firstName`, `midName`, `lastName`, `email`, `contact`, `address`, `panCard`, `adhar`, `dob`, `gender`, `status`, `designation_id`, `createdAt`, `updatedAt`, `joiningDate`, `relievingDate`) VALUES
(1, 'saaa', 'ss', 'sassa', 'sas@gmail.com', 3432454, 'dfdsds', '3ed2d', 333433332, '2005-02-02', 'male', 1, 6, '2024-01-31 07:50:28', '2024-02-06 07:29:57', '2024-01-03', '2024-07-04'),
(2, 'Suyog', 'Madhukar', 'Karemore', 'hhhg@gm.com', 2147483647, 'Wadoda, Behind PNB Wadoda', '4xd23', 2147483647, '2024-01-18', 'male', 0, 7, '2024-01-31 07:39:11', '2024-02-07 11:38:01', '2024-03-06', NULL),
(3, 'ddcscs', 'dcssdc', 'dcdscdsc', 'cdcds@gmail.com', 34343232, 'dcsccdc', '6776', 2147483647, '2024-01-10', 'male', 0, 6, '2024-01-31 13:25:54', '2024-02-05 13:41:10', '2024-02-15', ''),
(4, 'gudgagy', 'sdac', 'cdscc', 'dfds@k.com', 476543, 'ccdsvfv', '6776', 43423434, '2024-02-07', 'male', 1, 10, '2024-02-01 10:11:47', '2024-02-02 07:20:10', '2024-02-15', NULL),
(5, 'gsgsah', 'dhvxuvu', 'hjvbxjvhjvu', 'vhs@gmail.com', 637635, 'ibknihbci gciv', '363635', 2147483647, '2024-02-01', 'male', 1, 4, '2024-02-02 07:13:15', '2024-02-02 07:13:15', '2024-02-03', '2024-02-08'),
(6, 'sbhsa', 'jsjksb', 'sbibciy', 's@gmail.com', 737378, 'guiudwg', '83y7', 7378838, '2016-02-02', 'male', 1, 2, '2024-02-06 07:04:26', '2024-02-06 07:05:47', '2024-01-02', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `employee_salaries`
--

CREATE TABLE `employee_salaries` (
  `id` int(11) NOT NULL,
  `employee_id` int(11) NOT NULL,
  `year` varchar(255) NOT NULL,
  `month` varchar(255) NOT NULL,
  `salary` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employee_salaries`
--

INSERT INTO `employee_salaries` (`id`, `employee_id`, `year`, `month`, `salary`, `createdAt`, `updatedAt`) VALUES
(3, 3, '2024', '2', '2000', '2024-02-05 07:49:26', '2024-02-05 07:49:26'),
(4, 3, '2024', '4', '5000', '2024-02-05 07:49:26', '2024-02-05 07:49:26'),
(6, 1, '2024', '2', '2000', '2024-02-05 11:19:07', '2024-02-05 11:19:07'),
(7, 1, '2024', '3', '5000', '2024-02-05 11:19:07', '2024-02-05 11:19:07'),
(8, 2, '2023', '1', '2000', '2024-02-05 11:22:24', '2024-02-05 11:22:24'),
(9, 2, '2024', '3', '4444', '2024-02-05 11:22:24', '2024-02-05 11:22:24'),
(10, 4, '2024', '1', '2000', '2024-02-05 11:24:22', '2024-02-05 11:24:22'),
(11, 5, '2024', '2', '2000', '2024-02-05 11:24:51', '2024-02-05 11:24:51'),
(14, 6, '2024', '1', '2000', '2024-02-06 07:06:06', '2024-02-06 07:06:06');

-- --------------------------------------------------------

--
-- Table structure for table `expenses`
--

CREATE TABLE `expenses` (
  `id` int(11) NOT NULL,
  `expenses` varchar(255) NOT NULL,
  `status` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `expenses`
--

INSERT INTO `expenses` (`id`, `expenses`, `status`, `createdAt`, `updatedAt`) VALUES
(1, 'electricBill', 1, '2024-01-23 13:21:16', '2024-02-05 13:43:16'),
(2, 'ssss', 1, '2024-01-23 13:55:53', '2024-02-05 13:46:16'),
(3, 'sssss', 1, '2024-01-23 13:56:11', '2024-02-05 13:46:14'),
(4, 'hh', 1, '2024-01-23 13:57:43', '2024-02-05 13:46:15'),
(5, 'ss', 1, '2024-01-24 05:26:43', '2024-01-31 13:44:14'),
(6, 'dsaaxss', 1, '2024-01-24 06:03:02', '2024-01-31 13:44:15'),
(7, 'dccdc', 1, '2024-01-24 07:41:58', '2024-01-24 13:18:49'),
(8, 'fdfdfd', 1, '2024-01-24 13:18:25', '2024-01-24 13:18:25');

-- --------------------------------------------------------

--
-- Table structure for table `logins`
--

CREATE TABLE `logins` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `logins`
--

INSERT INTO `logins` (`id`, `name`, `email`, `password`, `createdAt`, `updatedAt`) VALUES
(1, 'Sahil', 'sahil@gmail.com', 'e8c8f45019430b6f79862746e96d6e70', '2024-01-17 11:57:24', '2024-01-17 11:57:24');

-- --------------------------------------------------------

--
-- Table structure for table `projecttypes`
--

CREATE TABLE `projecttypes` (
  `id` int(11) NOT NULL,
  `projectType` varchar(255) NOT NULL,
  `status` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `projecttypes`
--

INSERT INTO `projecttypes` (`id`, `projectType`, `status`, `createdAt`, `updatedAt`) VALUES
(1, 'fddss', 0, '2024-01-24 09:51:56', '2024-02-07 10:24:05'),
(2, 'ssj', 0, '2024-01-24 10:04:37', '2024-02-07 10:24:06'),
(3, 'fdds', 1, '2024-01-24 10:33:20', '2024-01-31 13:50:37'),
(4, 'ss', 1, '2024-01-24 11:49:07', '2024-01-24 12:16:56');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `dailyexpenses`
--
ALTER TABLE `dailyexpenses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `expenses_id` (`expenses_id`),
  ADD KEY `expenseBy_id` (`expenseBy_id`);

--
-- Indexes for table `designations`
--
ALTER TABLE `designations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`id`),
  ADD KEY `designation_id` (`designation_id`);

--
-- Indexes for table `employee_salaries`
--
ALTER TABLE `employee_salaries`
  ADD PRIMARY KEY (`id`),
  ADD KEY `employee_id` (`employee_id`);

--
-- Indexes for table `expenses`
--
ALTER TABLE `expenses`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `logins`
--
ALTER TABLE `logins`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `projecttypes`
--
ALTER TABLE `projecttypes`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `dailyexpenses`
--
ALTER TABLE `dailyexpenses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- AUTO_INCREMENT for table `designations`
--
ALTER TABLE `designations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `employees`
--
ALTER TABLE `employees`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `employee_salaries`
--
ALTER TABLE `employee_salaries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `expenses`
--
ALTER TABLE `expenses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `logins`
--
ALTER TABLE `logins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `projecttypes`
--
ALTER TABLE `projecttypes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `dailyexpenses`
--
ALTER TABLE `dailyexpenses`
  ADD CONSTRAINT `dailyexpenses_ibfk_5` FOREIGN KEY (`expenses_id`) REFERENCES `expenses` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `dailyexpenses_ibfk_6` FOREIGN KEY (`expenseBy_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `employees`
--
ALTER TABLE `employees`
  ADD CONSTRAINT `employees_ibfk_1` FOREIGN KEY (`designation_id`) REFERENCES `designations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `employee_salaries`
--
ALTER TABLE `employee_salaries`
  ADD CONSTRAINT `employee_salaries_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
