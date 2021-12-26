import React from 'react';
import { Switch, Route } from "react-router-dom";

import ChatList from './ChatList';
import ChatRoom from './ChatRoom';


function Chat() {
  return (
    <Switch>
      <Route path="/chat/:chatId" component={ChatRoom} />
      <Route path="/chat" component={ChatList} />
    </Switch>
  )
}

export default Chat;
