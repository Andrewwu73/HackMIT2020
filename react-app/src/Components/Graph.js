import React, {Component} from 'react';
//import Plot from 'react-plotly.js';
import {SearchBar} from './SearchBar';
import createPlotlyComponent from 'react-plotly.js/factory';
import Plotly from 'plotly.js-gl3d-dist';
const Plot = createPlotlyComponent(Plotly);
let figure= require('../templates/3dribbon.json');


export class Graph extends Component{
    constructor(props){
        super(props);
        this.state ={selected:['ABW', 'AGO', 'AIA']};
        //this.fetchDataFromSource = this.fetchDataFromSource.bind(this);
        //this.fetchCSVData = this.fetchCSVData.bind(this);
        if (window.location.host.startsWith('localhost')) {
            this.baseURL = 'http://localhost:8080';
        }
    } 

    // fetchDataFromSource(){
    //     var trace1 = {
    //         x:figure.data[0].x, y:figure.data[0].y, z:figure.data[0].z,
    //         name: '',
    //         colorscale: figure.data[0].colorscale,
    //         type: 'surface',
    //         showscale: false
    //     }
    //     var trace2 = {
    //         x:figure.data[1].x, y:figure.data[1].y, z:figure.data[1].z,
    //         name: '',
    //         colorscale: figure.data[1].colorscale,
    //         type: 'surface',
    //         showscale: false
    //     }
    //     var trace3 = {
    //         x:figure.data[2].x, y:figure.data[2].y, z:figure.data[2].z,
    //         colorscale: figure.data[2].colorscale,
    //         type: 'surface',
    //         showscale: false
    //     }
    //     var trace4 = {
    //         x:figure.data[3].x, y:figure.data[3].y, z:figure.data[3].z,
    //         colorscale: figure.data[3].colorscale,
    //         type: 'surface',
    //         showscale: false
    //     }
    //     var trace5 = {
    //         x:figure.data[4].x, y:figure.data[4].y, z:figure.data[4].z,
    //         colorscale: figure.data[4].colorscale,
    //         type: 'surface',
    //         showscale: false
    //     }
    //     var trace6 = {
    //         x:figure.data[5].x, y:figure.data[5].y, z:figure.data[5].z,
    //         colorscale: figure.data[5].colorscale,
    //         type: 'surface',
    //         showscale: false
    //     }
    //     var trace7 = {
    //         x:figure.data[6].x, y:figure.data[6].y, z:figure.data[6].z,
    //         name: '',
    //         colorscale: figure.data[6].colorscale,
    //         type: 'surface',
    //         showscale: false
    //     }
    //     this.setState({data:[trace1, trace2, trace3, trace4, trace5, trace6, trace7]});

    // }


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
                this.setState({data:dataByCountry});
            });
    }

    render(){
        console.log(this.state.data);
        if(this.state.data){
            var data = []
            let yLabel = 2;
            for(var selection in this.state.selected){
                var countryCode = this.state.selected[selection];
                var countryData = this.state.data[countryCode];
                var trace = {};
                console.log(countryData);
                trace.x = [];
                trace.y = [];
                trace.z = []
                for(var point in countryData.x){
                    trace.y.push([yLabel, yLabel+1]);
                    trace.x.push([countryData.x[point], countryData.x[point]]);
                    trace.z.push([countryData.z[point], countryData.z[point]]);
                }
                yLabel = yLabel + 2;
                trace.type = 'surface';
                trace.showscale = false;
                trace.colorscale = [
                    [
                        "0", 
                        "rgb(31,31,255)"
                    ], 
                    [
                        "0.1", 
                        "rgb(31,31,255)"
                    ], 
                    [
                        "0.2", 
                        "rgb(31,31,255)"
                    ], 
                    [
                        "0.3", 
                        "rgb(31,31,255)"
                    ], 
                    [
                        "0.4", 
                        "rgb(31,31,255)"
                    ], 
                    [
                        "0.5", 
                        "rgb(31,31,255)"
                    ], 
                    [
                        "0.6", 
                        "rgb(31,31,255)"
                    ], 
                    [
                        "0.7", 
                        "rgb(31,31,255)"
                    ], 
                    [
                        "0.8", 
                        "rgb(31,31,255)"
                    ], 
                    [
                        "0.9", 
                        "rgb(31,31,255)"
                    ], 
                    [
                        "1", 
                        "rgb(31,31,255)"
                    ]
                ];
                data.push(trace);
            }
            return (
                <div>
                    <div style={{float:"left"}}>
                        <Plot
                            data={data}
                            layout = { {width:600, height:640, title: 'A basic plot'}}
                        />
                    </div>
                    <div style = {{float:"left"}}>
                        <SearchBar/>
                    </div>
                </div>
            );
        } else {
            return null;
        }
    }

}