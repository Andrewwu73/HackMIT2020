import React, {Component} from 'react';
//import Plot from 'react-plotly.js';
import {SearchBar} from './SearchBar';
import createPlotlyComponent from 'react-plotly.js/factory';
import Plotly from 'plotly.js-gl3d-dist';
import {
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    FormGroup,
    Checkbox
  } from '@material-ui/core';
const Plot = createPlotlyComponent(Plotly);

///let figure= require('../templates/3dribbon.json');


export class Graph extends Component{
    constructor(props){
        super(props);
        this.state ={selected:['USA', 'CHN', 'RUS'], dataSelected:'Education',
            checkedA: true,
            checkedB: true,
            checkedC: true,
            checkedD: true
        };
        //this.fetchDataFromSource = this.fetchDataFromSource.bind(this);
        //this.fetchCSVData = this.fetchCSVData.bind(this);
        this.handleRadioOnClick = this.handleRadioOnClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
        if (window.location.host.startsWith('localhost')) {
            this.baseURL = 'http://localhost:8080';
        }
    } 

    handleChange(event) {
        
        var indexOfCSV = 0;
        if(this.state.checkedA && event.target.name!='checkedA'){
            indexOfCSV = indexOfCSV + 1;
        }
        if(this.state.checkedB && event.target.name!='checkedB'){
            indexOfCSV = indexOfCSV + 2;
        }
        if(this.state.checkedC && event.target.name!='checkedC'){
            indexOfCSV = indexOfCSV + 4;
        }
        if(this.state.checkedD && event.target.name!='checkedD'){
            indexOfCSV = indexOfCSV + 8;
        }

        if(event.target.name=='checkedA'){
            indexOfCSV = indexOfCSV + 1*(event.target.checked);
        } else if(event.target.name=='checkedB'){
            indexOfCSV = indexOfCSV + 2*(event.target.checked);
        } else if(event.target.name=='checkedC'){
            indexOfCSV = indexOfCSV + 4*(event.target.checked);
        } else if(event.target.name=='checkedD'){
            indexOfCSV = indexOfCSV + 8*(event.target.checked);
        }
        //console.log(indexOfCSV);
        const formBody = new URLSearchParams();
        formBody.append('index', indexOfCSV);
        // console.log(JSON.stringify(this.state.selected));
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
            body: formBody,
        };
        fetch(this.baseURL+'/get-ML-correlations', requestOptions)
            .then(res=>res.json())
            .then((results)=>{
                var toParse = results.data
                let dataByCountry = {}
                for(var i = 1;i<toParse.length;i++){
                    
                    if(toParse[i][0] in dataByCountry){
                        dataByCountry[toParse[i][0]].x.push(toParse[i][1]);
                        dataByCountry[toParse[i][0]].z.push(toParse[i][2]);
                    } else {
                        dataByCountry[toParse[i][0]] = {x:[toParse[i][1]], z:[toParse[i][2]]};
                    }
                }
                
                this.setState({data:dataByCountry});
            });
        this.setState({[event.target.name]: event.target.checked});
        
    };
    handleRadioOnClick(){
        const radioButtons = document.getElementsByName('dataset');
        for (const button in radioButtons) {
            if (radioButtons[button].checked) {
                this.setState({dataSelected: radioButtons[button].value});
            }
        }
    }

    updateHandler(countryCode){
        
        if(this.state.selected.includes(countryCode)){
            let newSelected = []
            for(var currentCode in this.state.selected){
                if(this.state.selected[currentCode]!=countryCode){
                    newSelected.push(this.state.selected[currentCode]);
                }
            }
            this.setState({selected:newSelected});
        } else if(countryCode in this.state.data){
            let newSelected = [countryCode];
            for(var currentCode in this.state.selected){
                newSelected.push(this.state.selected[currentCode]);
            }
            const formBody = new URLSearchParams();
            formBody.append('countryCodes', JSON.stringify(newSelected));
            // console.log(JSON.stringify(this.state.selected));
            const requestOptions = {
                method: 'POST',
                headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
                body: formBody,
            };
            fetch(this.baseURL+'/aws-gdp-forecasts', requestOptions)
                .then(res=>res.json())
                .then((results)=>{
                    console.log(results);
                    this.setState({awsData:results, selected:newSelected});
            })
        } else {
            alert('No data found for that country.');
        }
    }

    componentDidMount(){
        //this.fetchDataFromSource();
        //this.fetchCSVData();
        fetch(this.baseURL+'/get-sample-education-data')
            .then(res=>res.json())
            .then((results)=>{
                //console.log(results);
                //results is an object mapping data: an array
                //the array is of datapoints, 
                //console.log(results);
                var toParse = results.data
                let dataByCountry = {}
                for(var i = 1;i<toParse.length;i++){
                    //console.log(toParse[i]);
                    
                    if(toParse[i][0] in dataByCountry){
                        dataByCountry[toParse[i][0]].x.push(toParse[i][1]);
                        dataByCountry[toParse[i][0]].z.push(toParse[i][2]);
                    } else {
                        dataByCountry[toParse[i][0]] = {x:[toParse[i][1]], z:[toParse[i][2]]};
                    }
                }
                this.setState({educationData:dataByCountry});
        });
        fetch(this.baseURL+'/get-sample-youth-mortality-data')
            .then(res=>res.json())
            .then((results)=>{

            var toParse = results.data
            let dataByCountry = {}
            for(var i = 1;i<toParse.length;i++){
                
                if(toParse[i][0] in dataByCountry){
                    dataByCountry[toParse[i][0]].x.push(toParse[i][1]);
                    dataByCountry[toParse[i][0]].z.push(toParse[i][2]);
                } else {
                    dataByCountry[toParse[i][0]] = {x:[toParse[i][1]], z:[toParse[i][2]]};
                }
            }

            this.setState({youthMortalityData:dataByCountry});
        });
        fetch(this.baseURL+'/get-sample-hours-worked-data')
            .then(res=>res.json())
            .then((results)=>{

            var toParse = results.data
            let dataByCountry = {}
            for(var i = 1;i<toParse.length;i++){
                
                if(toParse[i][0] in dataByCountry){
                    dataByCountry[toParse[i][0]].x.push(toParse[i][1]);
                    dataByCountry[toParse[i][0]].z.push(toParse[i][2]);
                } else {
                    dataByCountry[toParse[i][0]] = {x:[toParse[i][1]], z:[toParse[i][2]]};
                }
            }

            this.setState({hoursWorkedData:dataByCountry});
        });

        fetch(this.baseURL+'/get-sample-population-data')
            .then(res=>res.json())
            .then((results)=>{

            var toParse = results.data
            let dataByCountry = {}
            for(var i = 1;i<toParse.length;i++){
                
                if(toParse[i][0] in dataByCountry){
                    dataByCountry[toParse[i][0]].x.push(toParse[i][1]);
                    dataByCountry[toParse[i][0]].z.push(toParse[i][2]);
                } else {
                    dataByCountry[toParse[i][0]] = {x:[toParse[i][1]], z:[toParse[i][2]]};
                }
            }

            this.setState({populationData:dataByCountry});
        });
        var indexOfCSV = 0;
        if(this.state.checkedA){
            indexOfCSV = indexOfCSV + 1;
        }
        if(this.state.checkedB){
            indexOfCSV = indexOfCSV + 2;
        }
        if(this.state.checkedC){
            indexOfCSV = indexOfCSV + 4;
        }
        if(this.state.checkedD){
            indexOfCSV = indexOfCSV + 8;
        }
        const formBody = new URLSearchParams();
        formBody.append('index', indexOfCSV);
        // console.log(JSON.stringify(this.state.selected));
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
            body: formBody,
        };
        fetch(this.baseURL+'/get-ML-correlations', requestOptions)
            .then(res=>res.json())
            .then((results)=>{
                var toParse = results.data
                let dataByCountry = {}
                for(var i = 1;i<toParse.length;i++){
                    
                    if(toParse[i][0] in dataByCountry){
                        dataByCountry[toParse[i][0]].x.push(toParse[i][1]);
                        dataByCountry[toParse[i][0]].z.push(toParse[i][2]);
                    } else {
                        dataByCountry[toParse[i][0]] = {x:[toParse[i][1]], z:[toParse[i][2]]};
                    }
                }
                
                this.setState({data:dataByCountry});
            });
    }

    render(){
        //console.log(this.state.data);
        if(this.state.data && this.state.educationData && this.state.youthMortalityData && this.state.hoursWorkedData && this.state.populationData){
            var data = [];
            var mlDataCorrelated = [];
            console.log(this.state);
            for(var selection in this.state.selected){
                var countryCode = this.state.selected[selection];
                var mldata = this.state.data[countryCode];
                if(this.state.dataSelected=='Education'){
                    var countryData = this.state.educationData[countryCode];
                } else if(this.state.dataSelected=='Youth Mortality'){
                    var countryData = this.state.youthMortalityData[countryCode];
                } else if(this.state.dataSelected=='Hours Worked'){
                    var countryData = this.state.hoursWorkedData[countryCode];
                } else if(this.state.dataSelected=='Population'){
                    var countryData = this.state.populationData[countryCode];
                }
                //console.log(countryData);
                var trace = {};
                var mltrace = {};
                trace.x = [];
                mltrace.x = [];
                trace.y = [];
                mltrace.y =[];
                //console.log(countryCode);
                for(var point in countryData.x){
                    trace.x.push(countryData.x[point]);
                    trace.y.push(countryData.z[point]);
                }
                for(var point in mldata.x){
                    mltrace.x.push(mldata.x[point]);
                    mltrace.y.push(mldata.z[point]);
                }
                mltrace.type = 'scatter';
                mltrace.name = countryCode;
                trace.type = 'scatter';
                trace.name=countryCode;
                //trace.showscale = false;
                data.push(trace);
                mlDataCorrelated.push(mltrace);
                //console.log(trace);
            }

            return (
                <div>

                    <div style={{float:"left", margin:"20px"}}>
                        <Plot
                            data={data}
                            layout = { {
                                width:500, 
                                height:540, 
                                title: this.state.dataSelected+' of certain countries over time',
                                xaxis:{
                                    autorange: true,
                                    rangeslider:{range:['1950-01-01', '2017-01-01']},
                                    type:'date'
                                },
                                yaxis:{
                                    autorange: true,
                                    type:'linear'
                                }
                            }}
                        />
                        <div style={{position: "relative", top:"20px"}}>
                            <FormControl component="fieldset">
                                <RadioGroup aria-label="dataset" name="dataset" value={this.state.dataSelected} onChange={this.handleRadioOnClick} row>
                                    <FormControlLabel value="Education" control={<Radio />} label="Education" />
                                    <FormControlLabel value="Youth Mortality" control={<Radio />} label="Youth Mortality" />
                                    <FormControlLabel value="Hours Worked" control={<Radio />} label="Hours Worked" />
                                    <FormControlLabel value="Population" control={<Radio />} label="Population" />

                                </RadioGroup>
                            </FormControl>
                        </div>
                        
                    </div>
                    <div style = {{float:"left", margin:"20px"}}>
                        <Plot
                            data={mlDataCorrelated}
                            layout={ {
                                width:500, 
                                height:540, 
                                title:'ML-Predicted Correlated RGDP Over Time', 
                                xaxis:{
                                    autorange: true,
                                    rangeslider:{range:['2017-01-01', '2040-01-01']},
                                    type:'date'
                                },
                                yaxis:{
                                    autorange: true,
                                    type:'linear'
                                }
                            }}
                        />
                        <FormGroup row>
                            <FormControlLabel
                                control={<Checkbox checked={this.state.checkedA} onChange={this.handleChange} name="checkedA" value="Education"/>}
                                label="Education"
                            />
                            <FormControlLabel
                                control={<Checkbox checked={this.state.checkedB} onChange={this.handleChange} name="checkedB" value="Youth Mortality"/>}
                                label="Hours Worked"
                            />
                            <FormControlLabel
                                control={<Checkbox checked={this.state.checkedC} onChange={this.handleChange} name="checkedC" value="Hours Worked"/>}
                                label="Youth Mortality"
                            />
                            <FormControlLabel
                                control={<Checkbox checked={this.state.checkedD} onChange={this.handleChange} name="checkedD" value="Population"/>}
                                label="Population"
                            />
                            
                        </FormGroup>
                    </div>
                    <div style = {{float:"left", margin:"20px"}}>
                        <SearchBar updateHandler= {this.updateHandler}/>
                    </div>
                </div>
            );
        } else {
            return null;
        }
    }

}