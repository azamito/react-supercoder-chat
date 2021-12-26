import React from 'react';
import { Container, LinearProgress, Typography } from "@material-ui/core";

import useStyles from './styles/AppLoading_style';

function AppLoading() {
  const classess = useStyles();

  return (
    <Container className={classess.loadingBlock} maxWidth="xs">
      <div className={classess.loadingBox}>
        <Typography variant="h6" component="h2" className={classess.title}>
          Chat App
        </Typography>
        <LinearProgress />
      </div>
    </Container>
  )
}

export default AppLoading;
