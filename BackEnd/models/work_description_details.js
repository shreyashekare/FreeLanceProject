module.exports = (sequelize, DataTypes) => {
    const work_description_details = sequelize.define("work_description_details1", {
        Name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Task_Date: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Task_Time: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Work_Description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        activity_ID: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        userDesignation: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        AddedBy_EmployeeID: {
            type: DataTypes.STRING,
            allowNull:true
        },
        Activity_Status: {
            type: DataTypes.STRING,
            allowNull: true
        },
    });

    return work_description_details;
};
