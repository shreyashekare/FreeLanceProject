const { DataTypes } = require("sequelize");
const { sequelize } = require(".");

module.exports = (sequelize, DataTypes) => {
    const activity_timer = sequelize.define("activity_timer", {

        Activity_ID: {
            type: DataTypes.STRING,
            allowNull: true
        },
        AddedBy_EmployeeID: {
            type: DataTypes.STRING,
            allowNull: true
        },
        Time_Spent: {
            type: DataTypes.STRING,
            allowNull: true
        },
        StartTime: {
            type: DataTypes.STRING,
            allowNull: true
        },
        EndTime: {
            type: DataTypes.STRING,
            allowNull: true
        },
        Date_Of_Entry: {
            type: DataTypes.STRING,
            allowNull: true
        }
    });
    return activity_timer
}