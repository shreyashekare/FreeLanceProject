-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 21, 2024 at 07:52 AM
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
  `task_id` int(11) NOT NULL,
  `employee_id` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


--
-- Dumping data for table `assigntasks`
--

INSERT INTO `assigntasks` (`id`, `task_id`, `employee_id`, `createdAt`, `updatedAt`) VALUES
(1, 3, 2, '2024-02-13 13:49:33', '2024-02-13 13:49:33'),
(6, 2, 1, '2024-03-13 15:54:21', '2024-03-13 15:54:21');

-- --------------------------------------------------------

--
-- Table structure for table `clientnames`
--

CREATE TABLE `clientnames` (
  `id` int(11) NOT NULL,
  `clientName` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `clientnames`
--

INSERT INTO `clientnames` (`id`, `clientName`, `createdAt`, `updatedAt`) VALUES
(1, 'Suyog', '2024-02-14 10:00:02', '2024-02-14 10:00:02'),
(2, 'Dilip', '2024-02-14 10:07:14', '2024-02-14 10:07:14'),
(3, 'Saurabh', '2024-02-14 10:15:33', '2024-02-14 10:15:33'),
(4, 'Pradeep', '2024-02-14 10:16:25', '2024-02-14 10:16:25'),
(8, 'Nilesh ', '2024-02-15 11:54:38', '2024-02-15 11:54:38');

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
(1, 'Manager', 1, '2024-02-09 07:40:16', '2024-03-14 06:09:15'),
(2, 'sdfsd', 0, '2024-02-09 08:01:31', '2024-02-12 12:57:32'),
(3, 'software developer', 1, '2024-03-07 10:00:24', '2024-03-07 10:00:24');

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
(1, 'Suyog', 'Madhukar', 'Karemore', 'hhhg@gm.com', 323323322, 'Wadoda, Behind PNB Wadoda', '4xd23', 2147483647, '2024-02-13', '2024-02-29', NULL, 'male', 1, 1, '2024-02-09 09:50:20', '2024-03-14 06:09:47'),
(2, 'Dilip', 'Sabhajeet', 'Verma', 'dfds@k.com', 345443545, 'dsdssccc dc sc', 'd2d23', 2147483647, '2024-02-08', '2024-02-08', NULL, 'male', 1, 3, '2024-02-12 06:41:13', '2024-03-14 06:09:54'),
(3, 'Saurab', 'vilas', 'Patil', 'sajs@g.com', 2147483647, 'hbbdhicb bicbi bchdb icb', '3e3dn3', 2147483647, '2024-02-14', '2024-02-22', NULL, 'male', 1, 3, '2024-02-12 12:57:22', '2024-03-14 06:10:01');

-- --------------------------------------------------------

--
-- Table structure for table `models`
--

CREATE TABLE `models` (
  `id` int(11) NOT NULL,
  `clientName_id` int(11) NOT NULL,
  `purchaseOrderNo` varchar(255) NOT NULL,
  `startDate` varchar(255) NOT NULL,
  `endDate` varchar(255) NOT NULL,
  `attachment` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
(1, 'eedededsss', 'qwdwqd wd wdwdwqd  w swsww  ssss', 1, '2024-02-10 09:26:54', '2024-03-14 10:10:23');

-- --------------------------------------------------------

--
-- Table structure for table `project_plannings`
--

CREATE TABLE `project_plannings` (
  `id` int(11) NOT NULL,
  `project_name` varchar(255) NOT NULL,
  `purchaseOrder_id` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `project_plannings`
--

INSERT INTO `project_plannings` (`id`, `project_name`, `purchaseOrder_id`, `createdAt`, `updatedAt`) VALUES
(1, 'well played', 1, '2024-02-28 11:21:20', '2024-03-12 10:18:12'),
(3, 'cricket', 2, '2024-03-04 13:32:36', '2024-03-12 12:05:20');

-- --------------------------------------------------------

--
-- Table structure for table `project_planning_activities`
--

CREATE TABLE `project_planning_activities` (
  `id` int(11) NOT NULL,
  `project_planning_subTasks_id` int(11) NOT NULL,
  `project_modules_activities` varchar(255) NOT NULL,
  `activities_planned_startDate` varchar(255) NOT NULL,
  `activities_planned_endDate` varchar(255) NOT NULL,
  `activities_planned_Hrs` varchar(255) NOT NULL,
  `activities_actual_startDate` varchar(255) NOT NULL,
  `activities_actual_endDate` varchar(255) NOT NULL,
  `activities_actual_hrs` varchar(255) NOT NULL,
  `assignedTo_employeeID` int(11) DEFAULT NULL,
  `assigned_hrs` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `project_planning_activities`
--

INSERT INTO `project_planning_activities` (`id`, `project_planning_subTasks_id`, `project_modules_activities`, `activities_planned_startDate`, `activities_planned_endDate`, `activities_planned_Hrs`, `activities_actual_startDate`, `activities_actual_endDate`, `activities_actual_hrs`, `assignedTo_employeeID`, `assigned_hrs`, `createdAt`, `updatedAt`) VALUES
(30, 81, 'saasasassa', '2024-03-08', '2024-03-09', '4', '2024-03-15', '2024-03-16', '3', 1, '9', '2024-03-11 07:59:45', '2024-03-16 08:03:14'),
(36, 86, 'cdcdcd', '2024-03-08', '2024-03-08', '4', '2024-03-15', '2024-03-15', '3', NULL, NULL, '2024-03-12 10:04:13', '2024-03-12 10:04:13'),
(37, 88, 'dsdcd', '2024-03-01', '2024-03-01', '3', '2024-03-01', '2024-03-01', '3', NULL, NULL, '2024-03-12 10:17:57', '2024-03-12 10:17:57'),
(40, 90, 'login functionality', '2024-03-15', '2024-03-16', '3', '2024-03-15', '2024-03-16', '3', 1, '4', '2024-03-12 11:37:32', '2024-03-12 11:37:59'),
(41, 90, 'log out functionality', '2024-03-16', '2024-03-17', '3', '2024-03-16', '2024-03-17', '4', 2, '8', '2024-03-12 11:37:32', '2024-03-12 11:38:06');

-- --------------------------------------------------------

--
-- Table structure for table `project_planning_modules`
--

CREATE TABLE `project_planning_modules` (
  `id` int(11) NOT NULL,
  `project_modules` varchar(255) NOT NULL,
  `project_planning_id` int(11) NOT NULL,
  `module_planned_startDate` varchar(255) NOT NULL,
  `module_planned_endDate` varchar(255) NOT NULL,
  `module_planned_Hrs` varchar(255) NOT NULL,
  `module_actual_startDate` varchar(255) NOT NULL,
  `module_actual_endDate` varchar(255) NOT NULL,
  `module_actual_hrs` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `project_planning_modules`
--

INSERT INTO `project_planning_modules` (`id`, `project_modules`, `project_planning_id`, `module_planned_startDate`, `module_planned_endDate`, `module_planned_Hrs`, `module_actual_startDate`, `module_actual_endDate`, `module_actual_hrs`, `createdAt`, `updatedAt`) VALUES
(53, 'module for sign in', 1, '2024-03-07', '2024-03-09', '2', '2024-03-09', '2024-03-10', '3', '2024-03-08 12:11:08', '2024-03-12 05:47:56'),
(58, 'module 1', 3, '2024-03-01', '2024-03-03', '2', '2024-03-01', '2024-03-08', '2', '2024-03-11 07:59:45', '2024-03-12 11:54:21'),
(66, 'module 2', 3, '2024-03-01', '2024-03-02', '2', '2024-03-01', '2024-03-02', '2', '2024-03-12 11:37:32', '2024-03-12 11:37:32');

-- --------------------------------------------------------

--
-- Table structure for table `project_planning_projectfiles`
--

CREATE TABLE `project_planning_projectfiles` (
  `id` int(11) NOT NULL,
  `project_file` varchar(255) NOT NULL,
  `project_planning_id` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `project_planning_projectfiles`
--

INSERT INTO `project_planning_projectfiles` (`id`, `project_file`, `project_planning_id`, `createdAt`, `updatedAt`) VALUES
(2, '1709119280840-12thmark.pdf', 1, '2024-02-28 11:21:20', '2024-02-28 11:21:20'),
(7, '1709555393935-IMG-20200501-WA0008.jpg', 1, '2024-03-04 12:29:53', '2024-03-04 12:29:53'),
(10, '1709559156163-IMG-20200501-WA0007.jpg', 3, '2024-03-04 13:32:36', '2024-03-04 13:32:36'),
(11, '1709559156196-IMG-20200616-WA0003.jpg', 3, '2024-03-04 13:32:36', '2024-03-04 13:32:36'),
(12, '1709559156202-IMG-20200616-WA0004.jpg', 3, '2024-03-04 13:32:36', '2024-03-04 13:32:36'),
(13, '1709646153805-IMG-20200501-WA0008.jpg', 3, '2024-03-05 13:42:33', '2024-03-05 13:42:33'),
(14, '1709646153816-IMG-20200310-WA0013.jpg', 3, '2024-03-05 13:42:33', '2024-03-05 13:42:33');

-- --------------------------------------------------------

--
-- Table structure for table `project_planning_subtasks`
--

CREATE TABLE `project_planning_subtasks` (
  `id` int(11) NOT NULL,
  `project_planning_tasks_id` int(11) NOT NULL,
  `project_modules_subTasks` varchar(255) NOT NULL,
  `subTasks_planned_startDate` varchar(255) NOT NULL,
  `subTasks_planned_endDate` varchar(255) NOT NULL,
  `subTasks_planned_Hrs` varchar(255) NOT NULL,
  `subTasks_actual_startDate` varchar(255) NOT NULL,
  `subTasks_actual_endDate` varchar(255) NOT NULL,
  `subTasks_actual_hrs` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `project_planning_subtasks`
--

INSERT INTO `project_planning_subtasks` (`id`, `project_planning_tasks_id`, `project_modules_subTasks`, `subTasks_planned_startDate`, `subTasks_planned_endDate`, `subTasks_planned_Hrs`, `subTasks_actual_startDate`, `subTasks_actual_endDate`, `subTasks_actual_hrs`, `createdAt`, `updatedAt`) VALUES
(81, 83, 'sign in form', '2024-03-01', '2024-03-02', '3', '2024-03-01', '2024-03-02', '4', '2024-03-11 07:59:45', '2024-03-12 11:54:21'),
(86, 91, 'dsdsdffsaasddefess', '2024-03-01', '2024-03-08', '3', '2024-03-08', '2024-03-16', '3', '2024-03-12 10:02:27', '2024-03-12 10:02:27'),
(88, 89, 'sign up button', '2024-03-08', '2024-03-08', '3', '2024-03-01', '2024-02-29', '3', '2024-03-12 10:17:57', '2024-03-12 10:17:57'),
(90, 92, 'login in form', '2024-03-08', '2024-03-09', '5', '2024-03-08', '2024-03-09', '5', '2024-03-12 11:37:32', '2024-03-12 11:37:32');

-- --------------------------------------------------------

--
-- Table structure for table `project_planning_tasks`
--

CREATE TABLE `project_planning_tasks` (
  `id` int(11) NOT NULL,
  `project_planning_module_id` int(11) NOT NULL,
  `project_modules_tasks` varchar(255) NOT NULL,
  `tasks_planned_startDate` varchar(255) NOT NULL,
  `tasks_planned_endDate` varchar(255) NOT NULL,
  `tasks_planned_Hrs` varchar(255) NOT NULL,
  `tasks_actual_startDate` varchar(255) NOT NULL,
  `tasks_actual_endDate` varchar(255) NOT NULL,
  `tasks_actual_hrs` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `project_planning_tasks`
--

INSERT INTO `project_planning_tasks` (`id`, `project_planning_module_id`, `project_modules_tasks`, `tasks_planned_startDate`, `tasks_planned_endDate`, `tasks_planned_Hrs`, `tasks_actual_startDate`, `tasks_actual_endDate`, `tasks_actual_hrs`, `createdAt`, `updatedAt`) VALUES
(83, 58, 'sign in', '2024-03-01', '2024-03-02', '2', '2024-03-02', '2024-03-03', '3', '2024-03-11 07:59:45', '2024-03-11 07:59:45'),
(89, 53, 'sign in', '2024-03-01', '2024-03-01', '2', '2024-03-07', '2024-03-08', '3', '2024-03-12 10:02:06', '2024-03-12 10:02:06'),
(91, 53, 'sign in', '2024-03-01', '2024-03-01', '2', '2024-03-07', '2024-03-08', '3', '2024-03-12 10:02:27', '2024-03-12 10:02:27'),
(92, 66, 'login', '2024-03-02', '2024-03-03', '6', '2024-03-02', '2024-03-03', '3', '2024-03-12 11:37:32', '2024-03-12 11:37:32');

-- --------------------------------------------------------

--
-- Table structure for table `purchaseorders`
--

CREATE TABLE `purchaseorders` (
  `id` int(11) NOT NULL,
  `clientName_id` int(11) NOT NULL,
  `purchaseOrderNo` varchar(255) NOT NULL,
  `startDate` varchar(255) NOT NULL,
  `endDate` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `purchaseorders`
--

INSERT INTO `purchaseorders` (`id`, `clientName_id`, `purchaseOrderNo`, `startDate`, `endDate`, `createdAt`, `updatedAt`) VALUES
(1, 1, '22', '2024-02-06', '2024-01-21', '2024-02-15 13:28:47', '2024-02-19 05:48:45'),
(2, 2, '1', '2024-02-11', '2024-02-14', '2024-02-15 13:37:13', '2024-02-19 05:49:09');

-- --------------------------------------------------------

--
-- Table structure for table `purchase_order_attachments`
--

CREATE TABLE `purchase_order_attachments` (
  `id` int(11) NOT NULL,
  `purchaseOrder_id` int(11) NOT NULL,
  `attachment` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `purchase_order_attachments`
--

INSERT INTO `purchase_order_attachments` (`id`, `purchaseOrder_id`, `attachment`, `createdAt`, `updatedAt`) VALUES
(9, 1, '1708079582601-1707979249594-1707919840759-WhatsApp Image 2023-07-18 at 2.27.27 PM.jpeg', '2024-02-16 10:33:02', '2024-02-16 10:33:02'),
(12, 2, '1708079702237-1707919840752-WhatsApp Image 2023-07-18 at 2.27.26 PM.jpeg', '2024-02-16 10:35:02', '2024-02-16 10:35:02'),
(13, 2, '1708079702280-1707919840759-WhatsApp Image 2023-07-18 at 2.27.27 PM.jpeg', '2024-02-16 10:35:02', '2024-02-16 10:35:02'),
(22, 1, '1708083075916-1707996616388-1707920041023-1707919840726-preferencereport.pdf', '2024-02-16 11:31:16', '2024-02-16 11:31:16'),
(23, 2, '1708321749225-1707919840759-WhatsApp Image 2023-07-18 at 2.27.27 PM.jpeg', '2024-02-19 05:49:09', '2024-02-19 05:49:09');

-- --------------------------------------------------------

--
-- Table structure for table `purchase_order_milestones`
--

CREATE TABLE `purchase_order_milestones` (
  `id` int(11) NOT NULL,
  `purchaseOrder_id` int(11) NOT NULL,
  `milestone` varchar(255) NOT NULL,
  `milestoneValue` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `purchase_order_milestones`
--

INSERT INTO `purchase_order_milestones` (`id`, `purchaseOrder_id`, `milestone`, `milestoneValue`, `createdAt`, `updatedAt`) VALUES
(182, 1, 'milestone1', '3000', '2024-02-19 05:48:45', '2024-02-19 05:48:45'),
(183, 1, 'milestone2', '4000', '2024-02-19 05:48:45', '2024-02-19 05:48:45'),
(184, 1, 'milestone3', '2222', '2024-02-19 05:48:45', '2024-02-19 05:48:45'),
(185, 2, 'milestone2', '3000', '2024-02-19 05:49:09', '2024-02-19 05:49:09'),
(186, 2, 'milestone3', '4000', '2024-02-19 05:49:09', '2024-02-19 05:49:09');

-- --------------------------------------------------------

--
-- Table structure for table `tasks`
--

CREATE TABLE `tasks` (
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
-- Dumping data for table `tasks`
--

INSERT INTO `tasks` (`id`, `project_id`, `parentTask`, `task`, `taskDetail`, `startDate`, `endDate`, `estimatedHour`, `status`, `employee_id`, `attachment`, `createdAt`, `updatedAt`) VALUES
(1, 1, 0, 'ddsf ef', 'df fdfsgtg g v  efv e', '2024-02-07', '2024-02-13', '4', 'open', 1, NULL, '2024-02-13 05:44:44', '2024-02-13 10:16:29'),
(2, 1, 2, 'saxaes', 'euhn ch9hnnuheu nuhucucssbhjbhsbjabsxjshxsxbhxsxsrrc', '2024-06-01', '2024-02-08', '3', 'assigned', 2, NULL, '2024-02-13 05:45:47', '2024-03-13 15:54:21'),
(3, 1, 0, 'dsdasd', 'ddef rfcdc rfrgv evds df fv', '2024-02-08', '2024-02-16', '3', 'open', 3, NULL, '2024-02-13 05:46:07', '2024-02-13 13:49:33'),
(4, 1, 0, 'ddsf rfvfvfvvd', 'fvfdvdfvvdv d vdfv v', '2024-02-09', '2024-02-10', '3', 'open', 1, NULL, '2024-02-13 05:46:54', '2024-03-06 08:26:32'),
(5, 1, 1, 'ffvdfv', 'fvdfv v dvfvdvvs v', '2024-02-03', '2024-02-06', '3', 'open', 1, NULL, '2024-02-13 05:47:38', '2024-03-06 06:41:46'),
(6, 1, 2, 'eeee', 'fuffvyuff ufuyu', '2024-02-15', '2024-02-23', '3', 'open', 2, NULL, '2024-02-13 10:17:30', '2024-03-06 06:41:43');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `assigntasks`
--
ALTER TABLE `assigntasks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `task_id` (`task_id`),
  ADD KEY `employee_id` (`employee_id`);

--
-- Indexes for table `clientnames`
--
ALTER TABLE `clientnames`
  ADD PRIMARY KEY (`id`);

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
-- Indexes for table `models`
--
ALTER TABLE `models`
  ADD PRIMARY KEY (`id`),
  ADD KEY `clientName_id` (`clientName_id`);

--
-- Indexes for table `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `project_plannings`
--
ALTER TABLE `project_plannings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `purchaseOrder_id` (`purchaseOrder_id`);

--
-- Indexes for table `project_planning_activities`
--
ALTER TABLE `project_planning_activities`
  ADD PRIMARY KEY (`id`),
  ADD KEY `project_planning_subTasks_id` (`project_planning_subTasks_id`);

--
-- Indexes for table `project_planning_modules`
--
ALTER TABLE `project_planning_modules`
  ADD PRIMARY KEY (`id`),
  ADD KEY `project_planning_id` (`project_planning_id`);

--
-- Indexes for table `project_planning_projectfiles`
--
ALTER TABLE `project_planning_projectfiles`
  ADD PRIMARY KEY (`id`),
  ADD KEY `project_planning_id` (`project_planning_id`);

--
-- Indexes for table `project_planning_subtasks`
--
ALTER TABLE `project_planning_subtasks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `project_planning_tasks_id` (`project_planning_tasks_id`);

--
-- Indexes for table `project_planning_tasks`
--
ALTER TABLE `project_planning_tasks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `project_planning_module_id` (`project_planning_module_id`);

--
-- Indexes for table `purchaseorders`
--
ALTER TABLE `purchaseorders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `clientName_id` (`clientName_id`);

--
-- Indexes for table `purchase_order_attachments`
--
ALTER TABLE `purchase_order_attachments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `purchaseOrder_id` (`purchaseOrder_id`);

--
-- Indexes for table `purchase_order_milestones`
--
ALTER TABLE `purchase_order_milestones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `purchaseOrder_id` (`purchaseOrder_id`);

--
-- Indexes for table `tasks`
--
ALTER TABLE `tasks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `project_id` (`project_id`),
  ADD KEY `employee_id` (`employee_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `assigntasks`
--
ALTER TABLE `assigntasks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `clientnames`
--
ALTER TABLE `clientnames`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `designations`
--
ALTER TABLE `designations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `employees`
--
ALTER TABLE `employees`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `models`
--
ALTER TABLE `models`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `projects`
--
ALTER TABLE `projects`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `project_plannings`
--
ALTER TABLE `project_plannings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `project_planning_activities`
--
ALTER TABLE `project_planning_activities`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT for table `project_planning_modules`
--
ALTER TABLE `project_planning_modules`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=67;

--
-- AUTO_INCREMENT for table `project_planning_projectfiles`
--
ALTER TABLE `project_planning_projectfiles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `project_planning_subtasks`
--
ALTER TABLE `project_planning_subtasks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=91;

--
-- AUTO_INCREMENT for table `project_planning_tasks`
--
ALTER TABLE `project_planning_tasks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=93;

--
-- AUTO_INCREMENT for table `purchaseorders`
--
ALTER TABLE `purchaseorders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `purchase_order_attachments`
--
ALTER TABLE `purchase_order_attachments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `purchase_order_milestones`
--
ALTER TABLE `purchase_order_milestones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=187;

--
-- AUTO_INCREMENT for table `tasks`
--
ALTER TABLE `tasks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `assigntasks`
--
ALTER TABLE `assigntasks`
  ADD CONSTRAINT `assigntasks_ibfk_1` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `assigntasks_ibfk_2` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `employees`
--
ALTER TABLE `employees`
  ADD CONSTRAINT `employees_ibfk_1` FOREIGN KEY (`designation_id`) REFERENCES `designations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `models`
--
ALTER TABLE `models`
  ADD CONSTRAINT `models_ibfk_1` FOREIGN KEY (`clientName_id`) REFERENCES `clientnames` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `project_plannings`
--
ALTER TABLE `project_plannings`
  ADD CONSTRAINT `project_plannings_ibfk_1` FOREIGN KEY (`purchaseOrder_id`) REFERENCES `purchaseorders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `project_planning_activities`
--
ALTER TABLE `project_planning_activities`
  ADD CONSTRAINT `project_planning_activities_ibfk_1` FOREIGN KEY (`project_planning_subTasks_id`) REFERENCES `project_planning_subtasks` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `project_planning_modules`
--
ALTER TABLE `project_planning_modules`
  ADD CONSTRAINT `project_planning_modules_ibfk_1` FOREIGN KEY (`project_planning_id`) REFERENCES `project_plannings` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `project_planning_projectfiles`
--
ALTER TABLE `project_planning_projectfiles`
  ADD CONSTRAINT `project_planning_projectfiles_ibfk_1` FOREIGN KEY (`project_planning_id`) REFERENCES `project_plannings` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `project_planning_subtasks`
--
ALTER TABLE `project_planning_subtasks`
  ADD CONSTRAINT `project_planning_subtasks_ibfk_1` FOREIGN KEY (`project_planning_tasks_id`) REFERENCES `project_planning_tasks` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `project_planning_tasks`
--
ALTER TABLE `project_planning_tasks`
  ADD CONSTRAINT `project_planning_tasks_ibfk_1` FOREIGN KEY (`project_planning_module_id`) REFERENCES `project_planning_modules` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `purchaseorders`
--
ALTER TABLE `purchaseorders`
  ADD CONSTRAINT `purchaseorders_ibfk_1` FOREIGN KEY (`clientName_id`) REFERENCES `clientnames` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `purchase_order_attachments`
--
ALTER TABLE `purchase_order_attachments`
  ADD CONSTRAINT `purchase_order_attachments_ibfk_1` FOREIGN KEY (`purchaseOrder_id`) REFERENCES `purchaseorders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `purchase_order_milestones`
--
ALTER TABLE `purchase_order_milestones`
  ADD CONSTRAINT `purchase_order_milestones_ibfk_1` FOREIGN KEY (`purchaseOrder_id`) REFERENCES `purchaseorders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tasks`
--
ALTER TABLE `tasks`
  ADD CONSTRAINT `tasks_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `tasks_ibfk_2` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
