import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Chat from './Chat';
import Pengaturan from './Pengaturan';

function Private() {
  return (
    <Switch>
      <Route path="/chat" component={Chat} />
      <Route path="/pengaturan" component={Pengaturan} />
    </Switch>
  )
}

export default Private
