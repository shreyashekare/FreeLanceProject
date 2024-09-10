const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mysql = require("mysql");
const cors = require("cors");
require("./db/conn");
require("./models/index");
const path = require("path");

const port = process.env.port || 8002;
const designationRoutes = require("./Routes/designationRoutes");
const employeeRoutes = require("./Routes/employeeRoutes");
const task = require("./Routes/taskRoutes");
const project = require("./Routes/projectRoutes");
const assignTask = require("./Routes/assignTaskRoutes");
const clientName = require("./Routes/clientnameRoutes");
const purchaseOrder = require("./Routes/purchaseOrderRoutes");
const purchase_order_milestone = require("./Routes/purchase_order_milestoneRoutes");
const project_planning = require("./Routes/project_planning_Routes");
const loginRoutes = require("./Routes/loginRoutes");
const userProjectRoutes = require('./Routes/userProjectRoutes');
const timeTrackingRoutes = require('./Routes/timeTrackingRoutes');
const work_description_details = require('./Routes/workDescriptionDetailsRoutes');
const activity_change_log = require('./Routes/changeLogRoutes');
const tester_issues = require('./Routes/testerIssueRoutes');
const Project_planning_employees = require('./Routes/projectPlanningEmpRoutes');
const User_access_rights = require('./Routes/userAccessRights');
const Activity_Files = require('./Routes/activityFiles')
const Activity_Timer = require('./Routes/activityTimerRoutes')
const Issue_Comments = require('./Routes/IssueCommentsRoutes')
// app.get("/", (req, res) => {
//   res.send("server start");
// });

//middleware
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const multer = require("multer");


// Cookie parsing middleware
// app.use(cookieParser());

// Initialize CSRF protection middleware (cookie-based)
// const csrfProtection = csrf({ cookie: true });

// // Apply CSRF protection to your routes
// app.use(csrfProtection);

// app.use((req, res, next) => {
//   res.cookie('XSRF-TOKEN', req.csrfToken());
//   next();
// });

app.use(cors({
  origin: 'http://localhost:3000', // Allow frontend requests from this origin
  credentials: true  // Enable this if you're sending cookies or authentication tokens
}));
// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', 'http://localhost:3000'); 
//   res.header('Access-Control-Allow-Origin', '*');// Update this as needed
//   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
//   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
//   next();
// });
app.get('/getCsrfToken', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });


// API route to handle file uploads


// app.post('/addActivityFile', csrfProtection, upload.single('file'), (req, res) => {
//   const csrfToken = req.headers['X-CSRF-Token']; // Extract the CSRF token from the request headers
//    console.log("><><><><><><><><><><",csrfToken)
//   // if (!csrfToken) {
//   //   return res.status(403).json({ error: 'CSRF token missing or invalid' });
//   // }

//   if (!req.file) {
//     return res.status(400).json({ error: 'No file uploaded' });
//   }

//   const file = req.file;

//   res.json({
//     message: 'File uploaded successfully',
//     filePath: `/uploads/${file.filename}`,
//     fileName: file.originalname
//   });
//   // res.send('running')
// });


app.use(cors({
  origin: 'http://localhost:3000', // Set this to your frontend origin
  credentials: true, // Enable credentials
}));

// app.post('/addActivityFile', upload.single('file'), async (req, res) => {
//   try {
//       console.log("Request headers:", req.headers);
//       const csrfToken = req.body.csrfToken || req.headers['csrf-token']; // Adjust based on how you send the CSRF token
//       console.log("CSRF Token:", csrfToken);

//       if (!csrfToken || csrfToken !== '15WpFN7P-zHqqfcSQjjD32pURFUuzG7pdXjA') {
//           return res.status(403).json({ error: 'CSRF token missing or invalid' });
//       }

//       // Continue processing the file upload
//       res.status(200).json({ url: '/path/to/uploaded/file' });
//   } catch (err) {
//       console.error('Error uploading file:', err);
//       res.status(500).json({ error: 'Failed to upload file' });
//   }
// });


  
app.use(express.json());
app.use(bodyParser.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(designationRoutes);
app.use(employeeRoutes);
app.use(loginRoutes)
app.use(task);
app.use(project);
app.use(assignTask);
app.use(clientName);
app.use(purchaseOrder);
app.use(purchase_order_milestone);
app.use(project_planning);
app.use(userProjectRoutes);
app.use(timeTrackingRoutes);
app.use(work_description_details);
app.use(tester_issues);
app.use(activity_change_log);
app.use(User_access_rights);
app.use(Activity_Files)
app.use(Activity_Timer)
app.use(Issue_Comments)

app.listen(port, () => {
  console.log("server start at port no :" + port);
});