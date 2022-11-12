// Imports
const https = require('https');

// variable
let dcollector = null;
let bicycleApi = "https://kiosks.bicycletransit.workers.dev/phl";
let weatherApi = "https://api.openweathermap.org/data/2.5/weather?q=Philadelphia,US-PA,USA&appid=93e6c8e933995eaeae73f6c656bccd14";

// DB class for all queries
class DataCollector {
    static getDataCollectorServiceInstance() {
        if(dcollector==null) dcollector = new DataCollector();
        return dcollector;
    }

    async startDataCollection(db){
        this.getDataFromUrl(db,this.getBicycleData,bicycleApi);
        this.getDataFromUrl(db,this.getWeatherData,weatherApi);
    }

    async getDataFromUrl(db,callback,url){
        https.get(url, (resp) => {
            let data = '';
        
            // A chunk of data has been recieved.
            resp.on('data', (chunk) => {
                data += chunk;
            });
        
            // The whole response has been received. Print out the result.
            resp.on('end', () => {
                return callback(db,JSON.parse(data));
                // console.log(JSON.stringify(data));
            });
        
        }).on("error", (err) => {
            console.log("Error: " + err.message);
            return "";
        });
    }

    async getBicycleData(db,data){
        //console.log(JSON.stringify(data));
        const create_time = new Date();
        create_time.setMinutes(0);
        create_time.setSeconds(0);
        create_time.setMilliseconds(0);
        let res = [];
        let p=null;
        for(let i=0;i<data['features'].length;i++){
            p=data['features'][i]['properties'];
            res.push([
                create_time,
                p['id'],
                p['name'],
                p['totalDocks'],
                p['docksAvailable'],
                p['bikesAvailable']
            ]);
        }
        db.insertBicycleData(res);
        //console.log(res);
    }

    async getWeatherData(db,data){
        //console.log(JSON.stringify(data));
        let res = db.insertWeatherData(data['weather'][0]['main'],data['weather'][0]['description'],data['main']['temp'],data['main']['pressure'],data['main']['humidity']);
        //console.log(res);
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


}

module.exports = DataCollector;