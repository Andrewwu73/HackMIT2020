import React, {Component} from 'react';

import {Graph} from './Graph';
export class Main extends Component{
    constructor(props){
        super(props);
    }

    render(){
        return (
            <div>
                <Graph/>
            </div>
        );
        //<Graph/>;
    }


}