import React from 'react';
import { Link } from "react-router-dom";
import { Container, Paper, Grid, Button, TextField, Typography } from '@material-ui/core';

import useStyle from './style';
import logo from '../../images/logo.png';

function Login(props) {
  const classess = useStyle();

  return (
    <div className={classess.loginBlock}>
      <div className={classess.loginBox}>
        <div className={classess.logoBox}>
          <img src={logo} alt="logo" />
        </div>
        <Container maxWidth="xs">
          <Paper className={classess.paper}>
            <Typography variant="h5" component="h1" className={classess.title}>
              Login
            </Typography>
            <form noValidate>
              <TextField
                id="email"
                type="email"
                name="email"
                label="Alamat email"
                margin="normal"
                fullWidth
                required
                variant="outlined"
              />
              <TextField
                id="password"
                type="password"
                name="password"
                label="Password"
                autoComplete="new-password"
                margin="normal"
                fullWidth
                required
                variant="outlined"
              />
              <Grid container className={classess.button}>
                <Grid item xs>
                  <Button type="submit" color="primary" variant='contained' size="large">
                    Login
                  </Button>
                </Grid>
                <Grid item>
                  <Button variant='contained' size="large">
                    Daftar
                  </Button>
                </Grid>
              </Grid>
            </form>
            <Link to="/lupa-password">Lupa Password?</Link>
          </Paper>
        </Container>
      </div>
    </div>
  );
}

export default Login;
