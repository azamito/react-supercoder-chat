import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core';
import { SnackbarProvider } from 'notistack';
import { CssBaseline } from '@material-ui/core'

import theme from './configs/theme';
import { NotFound, LandingPage, Login, LupaPassword, Registrasi } from './views/pages';
import { Chat, Pengaturan } from './views';
import { PrivateRoute } from './components';
import { FirebaseProvider } from './contexts'

function App() {
  return (
    <ThemeProvider theme={theme} >
      <SnackbarProvider maxSnack={3}>
        <CssBaseline />
        <FirebaseProvider>
          <BrowserRouter>
            <Switch>
              <Route path="/" exact component={LandingPage} />
              <Route path="/registrasi" component={Registrasi} />
              <Route path="/login" component={Login} />
              <Route path="/lupa-password" component={LupaPassword} />
              <PrivateRoute path="/chat" component={Chat} />
              <PrivateRoute path="/pengaturan" component={Pengaturan} />
              <Route component={NotFound} />
            </Switch>
          </BrowserRouter>
        </FirebaseProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
