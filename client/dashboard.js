import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import SimpleLineChart from './chart.js';

class Dashboard extends React.Component {
    render() {
      <Router>
        <Switch>
          <Route exact path='/dashboard' component={SimpleLineChart} />
          <Route exact path='/dashboard/#ff' component={Dashboard} />
        </Switch>
      </Router>
    }
  }

ReactDOM.render(<Dashboard />, document.getElementById('dashboard'));