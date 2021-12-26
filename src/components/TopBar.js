import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { MoreVert } from "@material-ui/icons";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  MenuItem,
  Menu
} from "@material-ui/core";

import useStyles from "./styles/TopBar_style";
import { logOutUser } from "../configs/firebase/auth";


function TopBar({ toolbar }) {
  const classes = useStyles();
  const history = useHistory();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  }

  const handleClose = () => {
    setAnchorEl(null);
  }

  return (
    <AppBar position="static">
      <Toolbar className={classes.toolbar}>
        {toolbar ? toolbar : <Typography variant="h6">Chat App</Typography>}
        <IconButton
          className={classes.menulist}
          aria-controls="simple-menu"
          aria-haspopup="true"
          onClick={handleClick}
        >
          <MoreVert />
        </IconButton>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={() => {
            handleClose()
            history.push("/pengaturan")
          }}>Profile</MenuItem>
          <MenuItem onClick={() => {
            handleClose()
            logOutUser()
          }}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  )
}

export default TopBar;