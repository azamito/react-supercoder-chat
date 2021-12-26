import React from "react";

import Button from "@material-ui/core/Button";
import { Link, Redirect } from "react-router-dom";
import { useFirebase } from "../../contexts/FirebaseProvider";

// import styles
import useStyles from "./styles/LandingPage_style";

// import logo
import logo from "../../images/logo.png";

function LandingPage() {
  const { user } = useFirebase();
  const classes = useStyles();

  if (user) {
    return <Redirect to="/chat" />;
  }

  return (
    <div className={classes.landingPageBlock}>
      <div className={classes.landingPageBox}>
        <div className={classes.logoBox}>
          <img src={logo} alt="logo" />
        </div>
        <div className={classes.btnBox}>
          <Button className={classes.btnDaftar} variant="contained" component={Link} to="/registrasi">
            Daftar
          </Button>
          <Button className={classes.btnLogin} component={Link} to="/login">
            Login
          </Button>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;