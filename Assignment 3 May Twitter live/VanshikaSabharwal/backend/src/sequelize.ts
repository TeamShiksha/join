import { Sequelize } from "sequelize";

// Create a Sequelize instance using a single connection string (Database URL)
const sequelize = new Sequelize("postgresql://neondb_owner:npg_dnQp7visV9wZ@ep-odd-lake-a4xhl4fv-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require", {
  dialect: "postgres",
  logging: false, // Disable logging if you don’t want SQL queries logged
});

export default sequelize;
