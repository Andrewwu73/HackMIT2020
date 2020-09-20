const express = require('express');
const fs = require('fs');
var parse = require('csv-parse');
const app = express();
const AWS = require('aws-sdk');
app.use(express.urlencoded({extended: true}));

app.get('/', (req, res) => {
    res.send('Data VIS API');
});

app.get('/get-sample-education-data', async (req, res)=>{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    var csvData = [];
    fs.createReadStream('education.csv')
        .pipe(parse({delimiter:':'}))
        .on('data', function(csvrow){
            //console.log(csvrow);
            csvData.push(csvrow[0].split(','));
        })
        .on('end', function(){
            //console.log(csvData);
            res.send({data:csvData});
        })

})

app.get('/get-sample-youth-mortality-data', async (req, res)=>{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    var csvData = [];
    fs.createReadStream('youth-mortality-rate.csv')
        .pipe(parse({delimiter:':'}))
        .on('data', function(csvrow){
            //console.log(csvrow);
            csvData.push(csvrow[0].split(','));
        })
        .on('end', function(){
            //console.log(csvData);
            res.send({data:csvData});
        })
})

app.get('/get-sample-hours-worked-data', async (req, res)=>{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    var csvData = [];
    fs.createReadStream('hours_worked.csv')
        .pipe(parse({delimiter:':'}))
        .on('data', function(csvrow){
            //console.log(csvrow);
            csvData.push(csvrow[0].split(','));
        })
        .on('end', function(){
            //console.log(csvData);
            res.send({data:csvData});
        })

})

app.get('/get-sample-population-data', async (req, res)=>{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    var csvData = [];
    fs.createReadStream('population.csv')
        .pipe(parse({delimiter:':'}))
        .on('data', function(csvrow){
            //console.log(csvrow);
            csvData.push(csvrow[0].split(','));
        })
        .on('end', function(){
            //console.log(csvData);
            res.send({data:csvData});
        })

})


app.get('/get-initial-sample-data', async (req, res)=>{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    var csvData = [];
    fs.createReadStream('../react-app/src/templates/FebPwtExport9192020.csv')
        .pipe(parse({delimiter:':'}))
        .on('data', function(csvrow){
            //console.log(csvrow);
            csvData.push(csvrow[0].split(','));
        })
        .on('end', function(){
            //console.log(csvData);
            res.send({data:csvData});
        })

})


app.post('/aws-gdp-forecasts', (req, res)=>{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    AWS.config = new AWS.Config();
    AWS.config.accessKeyId = "AKIA2SR5RUQBGCSF6CWJ";
    AWS.config.secretAccessKey = "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";
    AWS.config.region= 'us-east-2';
    const forecastqueryservice = new AWS.ForecastQueryService();
    //console.log(req.body);
    const countries = JSON.parse(req.body.countryCodes);
    var data = {};
    var numCompleted = 0;
    function handleQueryCallback(err, resp){
        if(err) throw err;
        console.log(resp);
        const forecast = resp.Forecast.Predictions;

        var predictions50 = {x:[], y:[]};

        for(var i in forecast['p50']){
            predictions50.x.push(forecast['p50'][i]['Timestamp']);
            predictions50.y.push(forecast['p50'][i]['Value']);
        }
        data[countries[numCompleted]] = predictions50;
        //console.log(data);
        numCompleted = numCompleted + 1;
        if(numCompleted>=countries.length){
            
            res.send(data);
        } else {
            forecastqueryservice.queryForecast({ForecastArn: "arn:aws:forecast:us-east-2:727052297218:forecast/gdp_forcaster", Filters: {'metric_name': countries[numCompleted]}}, handleQueryCallback);
        }
    }
    forecastqueryservice.queryForecast({ForecastArn: "arn:aws:forecast:us-east-2:727052297218:forecast/gdp_forcaster", Filters: {'metric_name': countries[numCompleted]}}, handleQueryCallback);
})
var allCodes = ['ABW', 'AGO', 'AIA', 'ALB', 'ARE', 'ARG', 'ARM', 'ATG', 'AUS', 'AUT', 'AZE', 'BDI', 'BEL', 'BEN', 'BFA', 'BGD', 'BGR', 'BHR', 'BHS', 'BIH', 'BLR', 'BLZ', 'BMU', 'BOL', 'BRA', 'BRB', 'BRN', 'BTN', 'BWA', 'CAF', 'CAN', 'CHE', 'CHL', 'CHN', 'CIV', 'CMR', 'COD', 'COG', 'COL', 'COM', 'CPV', 'CRI', 'CUW', 'CYM', 'CYP', 'CZE', 'DEU', 'DJI', 'DMA', 'DNK', 'DOM', 'DZA', 'ECU', 'EGY', 'ESP', 'EST', 'ETH', 'FIN', 'FJI', 'FRA', 'GAB', 'GBR', 'GEO', 'GHA', 'GIN', 'GMB', 'GNB', 'GNQ', 'GRC', 'GRD', 'GTM', 'HKG', 'HND', 'HRV', 'HTI', 'HUN', 'IDN', 'IND', 'IRL', 'IRN', 'IRQ', 'ISL', 'ISR', 'ITA', 'JAM', 'JOR', 'JPN', 'KAZ', 'KEN', 'KGZ', 'KHM', 'KNA', 'KOR', 'KWT', 'LAO', 'LBN', 'LBR', 'LCA', 'LKA', 'LSO', 'LTU', 'LUX', 'LVA', 'MAC', 'MAR', 'MDA', 'MDG', 'MDV', 'MEX', 'MKD', 'MLI', 'MLT', 'MMR', 'MNE', 'MNG', 'MOZ', 'MRT', 'MSR', 'MUS', 'MWI', 'MYS', 'NAM', 'NER', 'NGA', 'NIC', 'NLD', 'NOR', 'NPL', 'NZL', 'OMN', 'PAK', 'PAN', 'PER', 'PHL', 'POL', 'PRT', 'PRY', 'PSE', 'QAT', 'ROU', 'RUS', 'RWA', 'SAU', 'SDN', 'SEN', 'SGP', 'SLE', 'SLV', 'SRB', 'STP', 'SUR', 'SVK', 'SVN', 'SWE', 'SWZ', 'SXM', 'SYC', 'SYR', 'TCA', 'TCD', 'TGO', 'THA', 'TJK', 'TKM', 'TTO', 'TUN', 'TUR', 'TWN', 'TZA', 'UGA', 'UKR', 'URY', 'USA', 'UZB', 'VCT', 'VEN', 'VGB', 'VNM', 'YEM', 'ZAF', 'ZMB', 'ZWE'];
function processForecastData(){
    AWS.config = new AWS.Config();
    AWS.config.accessKeyId = "AKIA2SR5RUQBGCSF6CWJ";
    AWS.config.secretAccessKey = "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";
    AWS.config.region= 'us-east-2';
    const forecastqueryservice = new AWS.ForecastQueryService();
    var numCompleted = 0;
    var rawFastest = "";
    var rawFastestVal = -1;
    var percentFastest = "";
    var percentFastestVal = -1;
    var rawSlowest = "";
    var rawSlowestVal = 10**9;
    var percentSlowest = "";
    var percentSlowestVal = 10**9;
    function handleQueryCallback(err, resp){
        if(err) throw err;
        //console.log(resp);
        const forecast = resp.Forecast.Predictions;
        var firstVal = forecast['p50'][0]['Value'];
        var lastVal = forecast['p50'][forecast['p50'].length-1]['Value'];
        var change = lastVal - firstVal;
        var percentChange = change/firstVal;
        //console.log(change);
        //console.log(percentChange);
        if(change>rawFastestVal){
            rawFastestVal = change;
            rawFastest = allCodes[numCompleted];
        } else if(change<rawSlowestVal){
            rawSlowest = allCodes[numCompleted];
            rawSlowestVal = change;
        }
        if(percentChange>percentFastestVal){
            percentFastestVal = percentChange;
            percentFastest = allCodes[numCompleted];
        } else if(percentChange<percentSlowestVal && percentChange>-1){
            percentSlowestVal = percentChange;
            percentSlowest = allCodes[numCompleted];
        } else if(percentChange<-1){
            console.log("Predict Negative GDP!");
            console.log(allCodes[numCompleted]);
        }
        //console.log(data);

        numCompleted = numCompleted + 1;
        if(numCompleted>=allCodes.length){
            console.log(rawFastest);
            console.log(rawFastestVal);
            console.log(percentFastest);
            console.log(percentFastestVal);
            console.log(rawSlowest);
            console.log(rawSlowestVal);
            console.log(percentSlowest);
            console.log(percentSlowestVal);
            
        } else {
            forecastqueryservice.queryForecast({ForecastArn: "arn:aws:forecast:us-east-2:727052297218:forecast/gdp_forcaster", Filters: {'metric_name': allCodes[numCompleted]}}, handleQueryCallback);
        }
    }
    forecastqueryservice.queryForecast({ForecastArn: "arn:aws:forecast:us-east-2:727052297218:forecast/gdp_forcaster", Filters: {'metric_name': allCodes[numCompleted]}}, handleQueryCallback);

}
// Body parser for API parameters
app.use(express.urlencoded({extended: true}));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
  //processForecastData();
});