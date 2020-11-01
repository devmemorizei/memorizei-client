import React from 'react';
import Home from './components/Home.js';
import SingUp from './components/SingUp.js';
import Login from './components/Login.js';

import { BrowserRouter, Route, Switch } from 'react-router-dom';


export default () => {
  return (
    
    <BrowserRouter>
      <div>
        <Switch>
          <Route path='/' component={Home} exact/>
          <Route path='/cadastrar' component={SingUp} exact/>
          <Route path='/login' component={Login} exact/>
        </Switch>
      </div>
    </BrowserRouter>
  );
}