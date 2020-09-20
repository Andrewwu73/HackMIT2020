import React from 'react';
import logo from './logo.svg';
import './App.css';
import {Main} from './Components/Main';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import {About} from './Components/About';
function App() {
  return (
    <Router>
        <Switch> {/* renders first route that matches url */}
          <Route exact path="/" render={(props) => (
            <div>
              <br /><br />
              <Main> </Main>
            </div>
          )} />

          <Route exact path="/about" component={About}/>

        </Switch>
      </Router>
  );
}

export default App;
