module.exports = (sequelize, DataTypes) => {

    const activity_change_log = sequelize.define("activity_change_log", {

     
        assigned_Employee: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        unassigned_Employee: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        Client: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        Assigned_To_Tester: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        Change_Time: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        Activity_ID: {
            type: DataTypes.STRING,
            allowNull: true,
        }
        
    });

    return activity_change_log;
};
