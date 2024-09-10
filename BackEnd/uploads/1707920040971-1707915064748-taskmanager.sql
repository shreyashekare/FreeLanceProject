-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 12, 2024 at 02:32 PM
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
-- Database: `taskmanager`
--

-- --------------------------------------------------------

--
-- Table structure for table `assigntasks`
--

CREATE TABLE `assigntasks` (
  `id` int(11) NOT NULL,
  `project_id` int(11) NOT NULL,
  `parentTask` int(11) DEFAULT NULL,
  `task` varchar(255) NOT NULL,
  `taskDetail` varchar(255) NOT NULL,
  `startDate` varchar(255) NOT NULL,
  `endDate` varchar(255) NOT NULL,
  `estimatedHour` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL,
  `employee_id` int(11) NOT NULL,
  `attachment` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `assigntasks`
--

INSERT INTO `assigntasks` (`id`, `project_id`, `parentTask`, `task`, `taskDetail`, `startDate`, `endDate`, `estimatedHour`, `status`, `employee_id`, `attachment`, `createdAt`, `updatedAt`) VALUES
(1, 1, 0, 'sdadadas', 'ssdsad d ddssd', '2024-02-02', '2024-02-06', '4', 'open', 1, NULL, '2024-02-10 10:43:18', '2024-02-10 10:43:18'),
(2, 1, 0, 'dfdacd', 'wsdsaddx sx xsx', '2024-02-01', '2024-02-03', '4', 'open', 1, NULL, '2024-02-10 10:44:46', '2024-02-10 10:44:46'),
(3, 1, 0, 'saxaes', ' wq dqwdqwd d qdqwd d de  e ee', '2024-02-14', '2024-02-23', '4', 'open', 1, NULL, '2024-02-10 11:05:46', '2024-02-10 11:05:46'),
(4, 1, 0, 'dsdasd', 'ed d qexex qx e', '2024-02-07', '2024-02-13', '4', 'open', 1, NULL, '2024-02-10 11:06:05', '2024-02-10 11:06:05'),
(5, 1, 0, 'eeee', 'ee dxex rvfv cx x', '2024-02-08', '2024-02-14', '4', 'open', 1, NULL, '2024-02-10 11:06:23', '2024-02-10 11:06:23'),
(6, 1, 0, 'dds ssaasx ', 'sdas xxsx sx sxeddv cc ', '2024-02-08', '2024-02-15', '4', 'open', 2, NULL, '2024-02-12 07:40:20', '2024-02-12 07:40:20'),
(7, 1, 0, 'form', 'ghfufui kjb bb', '2024-02-15', '2024-02-23', '4', 'open', 2, NULL, '2024-02-12 10:12:45', '2024-02-12 10:12:45');

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
(1, 'dsdss', 1, '2024-02-09 07:40:16', '2024-02-12 12:55:48'),
(2, 'sdfsd', 0, '2024-02-09 08:01:31', '2024-02-12 12:57:32');

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
  `joiningDate` varchar(255) NOT NULL,
  `relievingDate` varchar(255) DEFAULT NULL,
  `gender` varchar(255) NOT NULL,
  `status` tinyint(1) NOT NULL,
  `designation_id` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employees`
--

INSERT INTO `employees` (`id`, `firstName`, `midName`, `lastName`, `email`, `contact`, `address`, `panCard`, `adhar`, `dob`, `joiningDate`, `relievingDate`, `gender`, `status`, `designation_id`, `createdAt`, `updatedAt`) VALUES
(1, 'Suyog', 'Madhukar', 'Karemore', 'hhhg@gm.com', 323323322, 'Wadoda, Behind PNB Wadoda', '4xd23', 2147483647, '2024-02-13', '2024-02-29', NULL, 'male', 1, 2, '2024-02-09 09:50:20', '2024-02-09 12:26:04'),
(2, 'Dilip', 'Sabhajeet', 'Verma', 'dfds@k.com', 345443545, 'dsdssccc dc sc', 'd2d23', 2147483647, '2024-02-08', '2024-02-08', NULL, 'male', 1, 1, '2024-02-12 06:41:13', '2024-02-12 12:58:02'),
(3, 'Saurab', 'shjsjcb', 'Patil', 'sajs@g.com', 2147483647, 'hbbdhicb bicbi bchdb icb', '3e3dn3', 2147483647, '2024-02-14', '2024-02-22', NULL, 'male', 1, 1, '2024-02-12 12:57:22', '2024-02-12 12:57:22');

-- --------------------------------------------------------

--
-- Table structure for table `projects`
--

CREATE TABLE `projects` (
  `id` int(11) NOT NULL,
  `project` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `status` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `projects`
--

INSERT INTO `projects` (`id`, `project`, `description`, `status`, `createdAt`, `updatedAt`) VALUES
(1, 'eedededsss', 'qwdwqd wd wdwdwqd  w swsww  ssss', 1, '2024-02-10 09:26:54', '2024-02-10 10:29:34');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `assigntasks`
--
ALTER TABLE `assigntasks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `employee_id` (`employee_id`);

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
-- Indexes for table `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `assigntasks`
--
ALTER TABLE `assigntasks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `designations`
--
ALTER TABLE `designations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `employees`
--
ALTER TABLE `employees`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `projects`
--
ALTER TABLE `projects`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `assigntasks`
--
ALTER TABLE `assigntasks`
  ADD CONSTRAINT `assigntasks_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `employees`
--
ALTER TABLE `employees`
  ADD CONSTRAINT `employees_ibfk_1` FOREIGN KEY (`designation_id`) REFERENCES `designations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
