import { Sequelize } from "sequelize";

const config = {
    db: {
        host: process.env.DB_HOST || "localhost",
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : "",
        database: process.env.DB_NAME || "finalproject"
    }
}

const sequelize = new Sequelize(config.db.database, config.db.user, config.db.password, {
    host: config.db.host,
    dialect: "mysql",
    define: {
        timestamps: true
    }
});

const connect = async function () {
    try {
        await sequelize.authenticate();
        console.log("mysql connection is successfully");
    } catch (error) {
        console.log(error);
    }
}
connect();

export default sequelize;