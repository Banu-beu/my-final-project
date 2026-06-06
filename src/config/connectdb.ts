import { Sequelize } from "sequelize";


const config = {
    db: {
        host: "localhost",
        user: "root",
        password: "",
        database: "finalproject"

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