module.exports = (sequelize, DataTypes) => {

    const user_access_designations = sequelize.define("user_access_designations", {

        user_access_rights_id: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        Assigned_DesignationID: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        Status: {
            type: DataTypes.STRING,
            allowNull: true,
        }

    });

    user_access_designations.associate = (models) => {
        user_access_designations.belongsTo(models.user_access_rights, {
            foreignKey: "user_access_rights_id",
            as: "userAccessRights",
        });
    }

    return user_access_designations;
};
