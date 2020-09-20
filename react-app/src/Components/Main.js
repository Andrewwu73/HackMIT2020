import React, {Component} from 'react';
import {Breadcrumbs, Link} from '@material-ui/core';
import {Graph} from './Graph';
import 'fontsource-roboto';
export class Main extends Component{
    constructor(props){
        super(props);
    }

    render(){
        return (
            <div>
                <Breadcrumbs color = 'white' aria-label="breadcrumb">
                    <Link color="inherit" href="/" >
                        Main
                    </Link>
                    <Link color="inherit" href="/about">
                        About
                    </Link>
                </Breadcrumbs>
                <Graph/>
            </div>
        );
        //<Graph/>;
    }


}