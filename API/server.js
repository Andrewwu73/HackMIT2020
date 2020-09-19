const express = require('express');
const fs = require('fs');
var parse = require('csv-parse');
const app = express();
app.get('/', (req, res) => {
    res.send('Data VIS API');
});

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

// Body parser for API parameters
app.use(express.urlencoded({extended: true}));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});