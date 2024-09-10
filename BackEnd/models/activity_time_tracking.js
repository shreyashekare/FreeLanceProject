// module.exports = (sequelize, DataTypes) => {
//     const activity_time_tracking = sequelize.define("activityTimeTracking", {

const { STRING } = require("sequelize");

//         Allotted_time: {
//             type: DataTypes.STRING,
//             allowNull: true,
//         },
//         Time_spent: {
//             type: DataTypes.STRING,
//             allowNull: true,
//         },
//         Time_remaining: {
//             type: DataTypes.STRING,
//             allowNull: true,
//         },
//         time_Logged: {
//             type: DataTypes.STRING,
//             allowNull: true,
//         },
//         Start_Date: {
//             type: DataTypes.STRING,
//             allowNull: true,
//         },
//         Work_Description: {
//             type: DataTypes.STRING,
//             allowNull: true,
//         },
//         Status: {
//             type: DataTypes.STRING,
//             allowNull: true,
//         },
//         Activity_Type: {
//             type: DataTypes.STRING,
//             allowNull: true,
//         },

//         activity_ID: {
//             type: DataTypes.STRING,
//             allowNull: true,
//         },
//         AddedBy_EmployeeID: {
//             type: DataTypes.STRING,
//             allowNull: true,
//         },

//     });

//     return activity_time_tracking;
// };
module.exports = (sequelize, DataTypes) => {
    const activity_time_tracking = sequelize.define("activityTimeTracking", {

        Allotted_time: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        Time_spent: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Time_remaining: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        time_Logged: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        Start_Date: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Work_Description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Status: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Activity_Type: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        activity_ID: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        AddedBy_EmployeeID: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Priority: {
            type: DataTypes.STRING,
            allowNull: true
        }

    });

    activity_time_tracking.associate = (models) => {
        activity_time_tracking.belongsTo(models.employee, {
            foreignKey: 'AddedBy_EmployeeID',
            as: 'employeeName',
        });

        activity_time_tracking.belongsTo(models.project_planning_activities,{
            foreignKey: 'activity_ID',
            as: 'projectActivity',
        })

        activity_time_tracking.belongsTo(models.project_planning, {
            foreignKey: 'AddedBy_EmployeeID',  // This should link to project_planning
            as: 'projectPlanning',
        });
    };

    return activity_time_tracking;
};