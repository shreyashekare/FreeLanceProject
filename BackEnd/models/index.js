const { Sequelize, DataTypes } = require("sequelize");
const assignTask = require("./assignTask");

const sequelize = new Sequelize("taskmanager", "root", "", {
  host: "localhost",
  dialect:
    "mysql" /* one of 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle' */,
});

try {
  sequelize.authenticate();
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// db.login = require("./login")(sequelize, DataTypes);

db.designation = require("./designation")(sequelize, DataTypes);
db.employee = require("./employee")(sequelize, DataTypes);
db.task = require("./task")(sequelize, DataTypes);
db.project = require("./project")(sequelize, DataTypes);
db.assignTask = require("./assignTask")(sequelize, DataTypes);
db.clientName = require("./clientname")(sequelize, DataTypes);
db.purchaseOrder = require("./purchaseOrder")(sequelize, DataTypes);
db.project_planning_activities = require('./project_planning_activities')(sequelize, DataTypes);
db.project_planning = require('./project_planning')(sequelize, DataTypes);


db.purchase_order_milestone = require("./purchase_order_milestone")(
  sequelize,
  DataTypes
);
db.purchase_order_attachment = require("./purchase_order_attachment")(
  sequelize,
  DataTypes
);
db.project_planning = require("./project_planning")(sequelize, DataTypes);
db.project_planning_projectFile = require("./project_planning_projectFile")(
  sequelize,
  DataTypes
);

db.project_planning_modules = require("./project_planning_modules")(
  sequelize,
  DataTypes
);

db.project_planning_task = require("./project_planning_tasks")(
  sequelize,
  DataTypes
);

db.project_planning_subTask = require("./project_planning_subTasks")(
  sequelize,
  DataTypes
);

db.project_planning_activitie = require("./project_planning_activities")(
  sequelize,
  DataTypes
);
db.activity_time_tracking = require("./activity_time_tracking")(
  sequelize,
  DataTypes
)
db.Work_description_details = require("./work_description_details")(
  sequelize,
  DataTypes
)
db.activity_change_log = require("./activity_change_log")(
  sequelize,
  DataTypes
);
db.tester_issues = require("./tester_issues")(
  sequelize,
  DataTypes
);
db.Project_planning_employees = require("./project_planning_employees")
  (
    sequelize,
    DataTypes
  );
db.user_access_rights = require("./user_access_rights")(
  sequelize,
  DataTypes
)
db.user_access_designations = require("./user_access_designations")(
  sequelize,
  DataTypes
)
db.Activity_Files = require("./activity_files")(
  sequelize,
  DataTypes
)
db.Activity_Timer = require("./activity_timer")(
  sequelize,
  DataTypes
)
db.IssueAttachment = require("./IssueAttachment")
(
  sequelize,
  DataTypes
)
db.IssueComments = require("./IssueComments")
(
  sequelize,
  DataTypes
)

//////////// associate ////////////////////
db.designation.associate(db);
db.employee.associate(db);
db.task.associate(db);
db.project.associate(db);
db.assignTask.associate(db);
db.clientName.associate(db);
db.purchaseOrder.associate(db);
db.purchase_order_milestone.associate(db);
db.purchase_order_attachment.associate(db);
db.project_planning.associate(db);
db.project_planning_projectFile.associate(db);
db.project_planning_modules.associate(db);
db.project_planning_task.associate(db);
db.project_planning_subTask.associate(db);
db.project_planning_activitie.associate(db);
db.activity_time_tracking.associate(db);
db.user_access_designations.associate(db);
db.user_access_rights.associate(db)
db.sequelize.sync({ force: false });

module.exports = db;
