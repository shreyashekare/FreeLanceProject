module.exports = (sequelize, DataTypes) => {

    const tester_issues = sequelize.define("tester_issues", {
        Tester_Name : {
            type: DataTypes.STRING,
            allowNull: true,
        },
        Issue_details: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        Assigned_Employee: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        Activity_ID: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        Assigned_Tester: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        Issue_Time: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        Issue_Status: {
            type: DataTypes.STRING,
            allowNull: true,
        }

    });

    return tester_issues;
};
