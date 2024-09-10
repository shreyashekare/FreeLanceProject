


const { employee } = require(".");

// module.exports = (sequelize, DataTypes) => {
//   const Project_planning = sequelize.define("project_planning", {
//     project_name: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     purchaseOrder_id: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//     },
   
//     client_ID: {
//       type: DataTypes.INTEGER,
//       allowNull: true,
//     }

//     // Add any additional fields you have in your "login" table
//   });

//   Project_planning.associate = (models) => {
//     Project_planning.belongsTo(models.purchaseOrder, {
//       foreignKey: "purchaseOrder_id",
//       as: "purchaseOrder",
//     });

//     Project_planning.hasMany(models.project_planning_projectFile, {
//       foreignKey: "project_planning_id",
//       as: "project_planning_files",
//     });

//     Project_planning.hasMany(models.project_planning_modules, {
//       foreignKey: "project_planning_id",
//       as: "project_planning_moduleDetails",
//     });
//   };

//   return Project_planning;
// };


module.exports = (sequelize, DataTypes) => {
  const Project_planning = sequelize.define("project_planning", {
      project_name: {
          type: DataTypes.STRING,
          allowNull: false,
      },
      purchaseOrder_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
      },
      client_ID: {
          type: DataTypes.INTEGER,
          allowNull: true,
      },
      Status: {
        type: DataTypes.STRING,
        allowNull: true
      }
  });

  Project_planning.associate = (models) => {
      Project_planning.belongsTo(models.purchaseOrder, {
          foreignKey: "purchaseOrder_id",
          as: "purchaseOrder",
      });

      Project_planning.hasMany(models.project_planning_projectFile, {
          foreignKey: "project_planning_id",
          as: "project_planning_files",
      });

      Project_planning.hasMany(models.project_planning_modules, {
          foreignKey: "project_planning_id",
          as: "project_planning_moduleDetails",
      });

      Project_planning.hasMany(models.project_planning_activities, {
          foreignKey: 'Project_ID',
          as: 'projectActivities',
      });
  };

  return Project_planning;
};