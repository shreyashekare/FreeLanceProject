module.exports = (sequelize, DataTypes) => {
    const activity_files = sequelize.define(
      "activity_files",
      {
        activity_file: {
          type: DataTypes.STRING,
          allowNull: false,
        },
  
        activity_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
  
      }
    );
   
    return activity_files;
  };
  