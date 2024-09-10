module.exports = (sequelize, DataTypes) => {

    const IssueComments = sequelize.define("IssueComments", {

        Issue_Comments: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        Activity_Id: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        user_ID: {
            type: DataTypes.STRING,
            allowNull: true,
        }

    });


    return IssueComments;
};
