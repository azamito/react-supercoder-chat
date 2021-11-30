import React from 'react';
import { Button } from "@material-ui/core";

import { logOutUser, auth } from "../../../components/Auth/FirebaseProvider";

function Chat() {
  return (
    <div>
      <h1>Halaman Chat</h1>
      <Button variant="contained" onClick={() => logOutUser(auth)}>
        Logout
      </Button>
    </div>
  )
}

export default Chat;
