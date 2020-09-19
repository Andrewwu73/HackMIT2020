import React, {Component} from 'react';

import {Graph} from './Graph';
import {SearchBar} from './SearchBar';
export class Main extends Component{
    constructor(props){
        super(props);
    }

    render(){
        return (
            <div>
                <SearchBar/>
                <Graph/>
            </div>
        );
        //<Graph/>;
    }


}