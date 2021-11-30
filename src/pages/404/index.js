import React from "react";

// material-ui
import { Container, Paper, Typography } from "@material-ui/core";
import { Link } from "react-router-dom";

// styles
import useStyles from "./styles";

function NotFound() {
  const classes = useStyles();
  return (
    <Container maxWidth="xs">
      <Paper className={classes.paper}>
        <Typography variant="subtitle1">Halaman Tidak Ditemukan</Typography>
        <Typography variant="h3">404</Typography>
        <Typography component={Link} to="/">
          Kembali ke Beranda
        </Typography>
      </Paper>
    </Container>
  );
}

export default NotFound;
