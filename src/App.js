import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core';

import { NotFound, Home, Login, LupaPassword, Private, Registrasi } from './pages';
import { FirebaseProvider, PrivateRoute } from './components';
import theme from './config/theme';

function App() {
  return (
    <ThemeProvider theme={theme} >
      <FirebaseProvider>
        <BrowserRouter>
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/registrasi" component={Registrasi} />
            <Route path="/login" component={Login} />
            <Route path="/lupa-password" component={LupaPassword} />
            <PrivateRoute path="/chat" component={Private} />
            <PrivateRoute path="/pengaturan" component={Private} />
            <Route component={NotFound} />
          </Switch>
        </BrowserRouter>
      </FirebaseProvider>
    </ThemeProvider>
  );
}

export default App;
