module.exports = (sequelize, DataTypes) => {

    const user_access_rights = sequelize.define("user_access_rights", {
        Module_Name : {
            type: DataTypes.STRING,
            allowNull: true,
        },
      
    });
    
    user_access_rights.associate = (models) => {
        user_access_rights.hasMany(models.user_access_designations, {
          foreignKey: "user_access_rights_id",
          as: "userAccess",
        });
      };
    

    return user_access_rights;
};
