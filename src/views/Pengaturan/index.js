import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { ArrowBack as BackIcon, Edit, Info, Mail, Person, VpnKey } from '@material-ui/icons';
import {
  Typography,
  IconButton,
  Grid,
  List,
  ListItem,
  Divider,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  Container
} from '@material-ui/core';

import UploadAvatar from './avatar';
import EditDialog from './edit';
import useStyles from './styles/index'
import { TopBar } from '../../components';
import { useData } from '../../contexts/DataProvider';
import { useFirebase } from '../../contexts/FirebaseProvider';


function Pengaturan() {
  const classes = useStyles();
  const history = useHistory();
  const { profile } = useData();
  const { user } = useFirebase();
  const [editDialog, setEditDialog] = useState({
    open: false,
    fieldMode: "Nama",
  });

  return (
    <>
      <TopBar
        toolbar={
          <>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="back to home"
              onClick={() => {
                history.push("/chat");
              }}
            >
              <BackIcon />
            </IconButton>
            <Typography variant='h6'>Pengaturan</Typography>
          </>
        }
      />

      <Container maxWidth='md'>
        <Grid container>
          <Grid item xs={12}>
            <UploadAvatar />
          </Grid>
          <Grid item xs={12}>
            <List className={classes.List}>
              <ListItem alignItems='flex-start'>
                <ListItemAvatar>
                  <Person />
                </ListItemAvatar>
                <ListItemText
                  primary="Nama"
                  secondary={profile.nama}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="edit"
                    onClick={() => {
                      setEditDialog({ open: true, fieldMode: 'Nama' })
                    }}
                  >
                    <Edit />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
              <Divider variant='inset' component="li" />
              <ListItem alignItems='flex-start'>
                <ListItemAvatar>
                  <Info />
                </ListItemAvatar>
                <ListItemText
                  primary="Deskripsi"
                  secondary={profile.deskripsi || 'Belum ada deskripsi'}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="edit"
                    onClick={() => {
                      setEditDialog({ open: true, fieldMode: 'Deskripsi' })
                    }}
                  >
                    <Edit />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
              <Divider variant='inset' component="li" />
              <ListItem alignItems='flex-start'>
                <ListItemAvatar>
                  <Mail />
                </ListItemAvatar>
                <ListItemText
                  primary="Email"
                  secondary={user.email}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="edit"
                    onClick={() => {
                      setEditDialog({
                        open: true,
                        fieldMode: 'Email'
                      })
                    }}
                  >
                    <Edit />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
              <Divider variant='inset' component="li" />
              <ListItem alignItems='flex-start'>
                <ListItemAvatar>
                  <VpnKey />
                </ListItemAvatar>
                <ListItemText
                  primary="Password"
                  secondary='*********'
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="edit"
                    onClick={() => {
                      setEditDialog({
                        open: true,
                        fieldMode: 'Password'
                      })
                    }}
                  >
                    <Edit />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
              <Divider variant='inset' component="li" />
            </List>
          </Grid>
        </Grid>
      </Container>

      <EditDialog
        {...editDialog}
        handleClose={() => {
          setEditDialog((editDialog) => ({ ...editDialog, open: false }))
        }}
      />
    </>
  )
}

export default Pengaturan;
