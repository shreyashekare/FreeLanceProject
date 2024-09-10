const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mysql = require('mysql')
const cors = require('cors')
require('./db/conn')
require('./models/index')
const path = require('path')

const port = 8002
const designationRoutes = require('./Routes/designationRoutes')
const employeeRoutes = require('./Routes/employeeRoutes')
const task = require('./Routes/taskRoutes')
const project = require('./Routes/projectRoutes')
const assignTask = require('./Routes/assignTaskRoutes')
const clientName = require('./Routes/clientnameRoutes')
const purchaseOrder = require('./Routes/purchaseOrderRoutes')
const purchase_order_milestone = require('./Routes/purchase_order_milestoneRoutes')
const project_planning = require('./Routes/project_planning_Routes')
const loginRoutes = require('./Routes/loginRoutes')
const userProjectRoutes = require('./Routes/userProjectRoutes')
const timeTrackingRoutes = require('./Routes/timeTrackingRoutes')
const work_description_details = require('./Routes/workDescriptionDetailsRoutes')
const activity_change_log = require('./Routes/changeLogRoutes')

// app.get("/", (req, res) => {
//   res.send("server start");
// });

//middleware

app.use(cors())
app.use(express.json())
app.use(bodyParser.json())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use(designationRoutes)
app.use(employeeRoutes)
app.use(loginRoutes)
app.use(task)
app.use(project)
app.use(assignTask)
app.use(clientName)
app.use(purchaseOrder)
app.use(purchase_order_milestone)
app.use(project_planning)
app.use(userProjectRoutes)
app.use(timeTrackingRoutes)
app.use(work_description_details)
app.use(activity_change_log)
app.listen(port, () => {
  console.log('server start at port no :' + port)
})
