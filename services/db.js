// Imports
const mysql = require('mysql');
const dotenv = require('dotenv');

// Declare variables
let dbInstance = null;

// load .env file
dotenv.config();

// Create db connection
const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.DB_PORT
});


// Connect to db
connection.connect((err) => {
    if (err) {
        console.log(err.message);
    }
    console.log('db ' + connection.state);
});


// DB class for all queries
class DbService {
    static getDbServiceInstance() {
        if(dbInstance==null) dbInstance = new DbService();
        return dbInstance;
    }

    async getAllData() {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM test;";

                connection.query(query, (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });
            // console.log(response);
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async insertWeatherData(main,description,temp,pressure,humidity) {
        try {
        	// console.log(main);
        	// console.log(description);
        	// console.log(temp);
        	// console.log(pressure);
            const create_time = new Date();
            create_time.setMinutes(0);
            create_time.setSeconds(0);
            create_time.setMilliseconds(0);
            const res = await new Promise((resolve, reject) => {
                const query = "INSERT INTO weather (create_time, main, description, temp, pressure, humidity) VALUES (?,?,?,?,?,?);";

                connection.query(query, [create_time,main,description,temp,pressure,humidity] , (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve("Success");
                })
            });
            return {"messgae":"Success"};
        } catch (error) {
            console.log(error);
            return {"messgae":"Failes"};
        }
    }

    async insertBicycleData(result) {
        try {
        	// console.log(result);            
            const res = await new Promise((resolve, reject) => {
                const query = "INSERT INTO bicycles (create_time,id,name,total_docks,docks_available,bikes_available) VALUES ?;";

                connection.query(query, [result] , (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve("Success");
                })
            });
            return {"messgae":"Success"};
        } catch (error) {
            console.log(error);
            return {"messgae":"Failed"};
        }
    }

    async getStations(at) {
        try {
        	const response1 = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM bicycles WHERE create_time=?;";

                connection.query(query, [at],(err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });
            const response2 = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM weather WHERE create_time=?;";

                connection.query(query, [at],(err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });
            // console.log(response);
            return [response1,response2];
        } catch (error) {
            console.log(error);
            return {};
        }
    }

    async getStationById(id,at) {
        try {
        	const response1 = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM bicycles WHERE id=? AND create_time=?;";

                connection.query(query, [id,at],(err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });
            const response2 = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM weather WHERE create_time=?;";

                connection.query(query, [at],(err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });
            // console.log(response);
            return [response1,response2];
        } catch (error) {
            console.log(error);
            return {};
        }
    }

}

module.exports = DbService;