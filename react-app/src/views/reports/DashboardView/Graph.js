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
    Radio
  } from '@material-ui/core';
const Plot = createPlotlyComponent(Plotly);

///let figure= require('../templates/3dribbon.json');


export class Graph extends Component{
    constructor(props){
        super(props);
        this.state ={selected:['USA', 'CHN', 'RUS'], dimension:2};
        //this.fetchDataFromSource = this.fetchDataFromSource.bind(this);
        //this.fetchCSVData = this.fetchCSVData.bind(this);
        this.updateHandler = this.updateHandler.bind(this);
        this.handleRadioOnClick = this.handleRadioOnClick.bind(this);
        if (window.location.host.startsWith('localhost')) {
            this.baseURL = 'http://localhost:8080';
        } else {
            this.baseURL = 'https://macrovis.ue.r.appspot.com';
        }
    } 

    handleRadioOnClick(){
        const radioButtons = document.getElementsByName('dimension');
        for (const button in radioButtons) {
            if (radioButtons[button].checked) {
                this.setState({dimension: radioButtons[button].value});
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
        fetch(this.baseURL+'/get-initial-sample-data')
            .then(res=>res.json())
            .then((results)=>{
                //results is an object mapping data: an array
                //the array is of datapoints, 
                //console.log(results);
                var toParse = results.data
                let dataByCountry = {}
                var countries = "";
                for(var i = 1;i<toParse.length;i++){
                    //console.log(toParse[i]);
                    
                    if(toParse[i][1] in dataByCountry){
                        dataByCountry[toParse[i][1]].x.push(toParse[i][2]);
                        dataByCountry[toParse[i][1]].z.push(toParse[i][3]);
                    } else {
                        dataByCountry[toParse[i][1]] = {x:[toParse[i][2]], z:[toParse[i][3]]};
                    }
                }
                //console.log(dataByCountry);
                for(let count in dataByCountry){
                    countries = countries+count+","
                }
                console.log(countries.substring(0, countries.length-1));
                this.setState({data:dataByCountry});
            });
        const formBody = new URLSearchParams();
        formBody.append('countryCodes', JSON.stringify(this.state.selected));
       // console.log(JSON.stringify(this.state.selected));
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
            body: formBody,
        };
        fetch(this.baseURL+'/aws-gdp-forecasts', requestOptions)
            .then(res=>res.json())
            .then((results)=>{
                //console.log(results);
                this.setState({awsData:results});
            })
    }

    render(){
        //console.log(this.state.data);
        if(this.state.data && this.state.awsData){
            var data = []
            var awsData = []
            if(this.state.dimension==3){
                let yLabel = 2;
                for(var selection in this.state.selected){
                    var countryCode = this.state.selected[selection];
                    var countryData = this.state.data[countryCode];
                    var predictedCountryData = this.state.awsData[this.state.selected[selection]];
                    var trace = {};
                    var tracePredict = {};
                    tracePredict.x = [];
                    tracePredict.y = [];
                    tracePredict.z = [];
                    //console.log(countryData);
                    trace.x = [];
                    trace.y = [];
                    trace.z = [];
                    for(var point in countryData.x){
                        trace.y.push([yLabel, yLabel+1]);
                        trace.x.push([countryData.x[point], countryData.x[point]]);
                        trace.z.push([countryData.z[point], countryData.z[point]]);
                    }
                    for(var point in predictedCountryData.x){
                        tracePredict.y.push([yLabel, yLabel+1]);
                        tracePredict.x.push([predictedCountryData.x[point].substring(0, 4), predictedCountryData.x[point].substring(0, 4)]);
                        tracePredict.z.push([predictedCountryData.y[point], predictedCountryData.y[point]]);

                    }
                    yLabel = yLabel + 2;
                    trace.type = 'surface';
                    trace.showscale = false;
                    tracePredict.type = 'surface';
                    tracePredict.showscale = false;
                    tracePredict.name = countryCode;
                    trace.name=countryCode;
                    //console.log(trace);
                    //console.log(tracePredict);
                    data.push(trace);
                    awsData.push(tracePredict);
                }
            } else if(this.state.dimension==2){
                for(var selection in this.state.selected){
                    var countryCode = this.state.selected[selection];
                    var countryData = this.state.data[countryCode];
                    var predictedCountryData = this.state.awsData[this.state.selected[selection]];
                    var trace = {};
                    var tracePredict = {};
                    trace.x = []
                    trace.y = []

                    tracePredict.x = [];
                    tracePredict.y = [];
                    //console.log(countryCode);
                    for(var point in countryData.x){
                        trace.x.push(countryData.x[point]);
                        trace.y.push(countryData.z[point]);
                    }
                    for(var point in predictedCountryData.x){
                        tracePredict.x.push(predictedCountryData.x[point]);
                        tracePredict.y.push(predictedCountryData.y[point]);
                    }
                    trace.type = 'scatter';
                    tracePredict.type = 'scatter';
                    tracePredict.name = countryCode;
                    trace.name=countryCode;
                    //trace.showscale = false;
                    data.push(trace);
                    awsData.push(tracePredict);
                    //console.log(trace);
                }
            }
            return (
                <div>

                    <div style={{float:"left", margin:"20px"}}>
                        <Plot
                            data={data}
                            layout = { {
                                width:500, 
                                height:540, 
                                title: 'Real GDP of certain countries over time',
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
                        
                    </div>
                    <div style = {{float:"left", margin:"20px"}}>
                        <Plot
                            data={awsData}
                            layout={ {
                                width:500, 
                                height:540, 
                                title:'ML-Predicted RGDP of certain countries over time', 
                                xaxis:{
                                    autorange: true,
                                    rangeslider:{range:['2018-01-01', '2027-01-01']},
                                    type:'date'
                                },
                                yaxis:{
                                    autorange: true,
                                    type:'linear'
                                }
                            }}
                        />
                    </div>
                    <div style = {{float:"left", margin:"20px"}}>
                        <SearchBar updateHandler= {this.updateHandler}/>
                        <div style={{position: "relative", top:"180px"}}>
                            <FormControl component="fieldset">
                                <RadioGroup aria-label="dimension" name="dimension" value={this.state.dimension} onChange={this.handleRadioOnClick}>
                                    <FormControlLabel value="2" control={<Radio />} label="2D" />
                                    <FormControlLabel value="3" control={<Radio />} label="3D" />
                                </RadioGroup>
                            </FormControl>
                        </div>
                    </div>
                </div>
            );
        } else {
            return null;
        }
    }

}