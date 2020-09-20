import React, {Component} from 'react';
//import Plot from 'react-plotly.js';
import {SearchBar} from './SearchBar';
import createPlotlyComponent from 'react-plotly.js/factory';
import Plotly from 'plotly.js-gl3d-dist';
const Plot = createPlotlyComponent(Plotly);
///let figure= require('../templates/3dribbon.json');


export class Graph extends Component{
    constructor(props){
        super(props);
        this.state ={selected:['ABW', 'AGO', 'AIA'], dimension:2};
        //this.fetchDataFromSource = this.fetchDataFromSource.bind(this);
        //this.fetchCSVData = this.fetchCSVData.bind(this);
        this.updateHandler = this.updateHandler.bind(this);
        this.handleRadioOnClick = this.handleRadioOnClick.bind(this);
        if (window.location.host.startsWith('localhost')) {
            this.baseURL = 'http://localhost:8080';
        }
    } 

    handleRadioOnClick(){
        const radioButtons = document.getElementsByName('dim');
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
            this.setState({selected:newSelected});
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
            if(this.state.dimension==3){
                let yLabel = 2;
                for(var selection in this.state.selected){
                    var countryCode = this.state.selected[selection];
                    var countryData = this.state.data[countryCode];
                    var trace = {};
                    //console.log(countryData);
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
                    data.push(trace);
                }
            } else if(this.state.dimension==2){
                for(var selection in this.state.selected){
                    var countryCode = this.state.selected[selection];
                    var countryData = this.state.data[countryCode];
                    var trace = {};

                    trace.x = []
                    trace.y = []
                    console.log(countryCode);
                    for(var point in countryData.x){
                        trace.x.push(countryData.x[point]);
                        trace.y.push(countryData.z[point]);
                    }
                    trace.type = 'scatter';
                    trace.name=countryCode;
                    //trace.showscale = false;
                    data.push(trace);
                    console.log(trace);
                }
            }
            return (
                <div>

                    <div style={{float:"left"}}>
                        <Plot
                            data={data}
                            layout = { {width:600, height:640, title: 'GDP of certain countries over time'}}
                        />
                        <div className="form-group radio_input">
                            <label>Graph Dimension: </label>
                            <label className="container_radio">2D
                            <input type="radio" id="dim_1" name="dim" value="2" onChange={this.handleRadioOnClick} required defaultChecked/>
                            <span className="checkmark"></span>
                            </label>
                            <label className="container_radio">3D
                            <input type="radio" id="dim_2" name="dim" value="3" onChange={this.handleRadioOnClick} required />
                            <span className="checkmark"></span>
                            </label>
                        </div>
                    </div>
                    <div style = {{float:"left"}}>
                        <SearchBar updateHandler= {this.updateHandler}/>
                    </div>
                </div>
            );
        } else {
            return null;
        }
    }

}