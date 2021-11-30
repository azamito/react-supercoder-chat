import React from 'react';
import { Container, Paper, Grid, Button, TextField, Typography } from '@material-ui/core';

import useStyle from './style';
import logo from '../../images/logo.png';

function LupaPassword(props) {
  const classess = useStyle();

  return (
    <div className={classess.lupaPasswordBlock}>
      <div className={classess.lupaPasswordBox}>
        <div className={classess.logoBox}>
          <img src={logo} alt="logo" />
        </div>
        <Container maxWidth="xs">
          <Paper className={classess.paper}>
            <Typography variant="h5" component="h1" className={classess.title}>
              Lupa Password
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
              <Grid container className={classess.button}>
                <Grid item xs>
                  <Button type="submit" color="primary" variant='contained' size="large">
                    Kirim
                  </Button>
                </Grid>
                <Grid item>
                  <Button variant='contained' size="large">
                    Login
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Container>
      </div>
    </div>
  );
}

export default LupaPassword;

