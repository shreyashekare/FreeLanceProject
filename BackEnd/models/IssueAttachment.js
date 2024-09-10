
module.exports = (sequelize, DataTypes) => {
    const IssueAttachment = sequelize.define("IssueAttachment", {

        File_Name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        activity_ID: {
            type: DataTypes.STRING,
            allowNull: true,
        },

    });



    return IssueAttachment;
};