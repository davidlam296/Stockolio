import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './components/App';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { BrowserRouter as Router, Route } from 'react-router-dom';

ReactDOM.render(
  <Router>
    <Route path="/login" component={Login} />
    <Route path="/register" component={Register} />
    <Route path="/home" component={App} />
  </Router>,
  document.getElementById('app')
);
