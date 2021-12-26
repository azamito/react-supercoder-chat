import { forwardRef, Fragment, useState } from "react";
import { useHistory } from 'react-router-dom';
import { Search, Close } from "@material-ui/icons";
import {
  Dialog,
  List,
  AppBar,
  Toolbar,
  IconButton,
  InputBase,
  Slide,
  ListItem,
  Divider,
  ListItemText,
  ListItemAvatar,
  Avatar
} from "@material-ui/core";

import useStyles from "./styles/AddDialog_style";
import { useData } from "../../contexts/DataProvider";
import { useFirebase } from "../../contexts/FirebaseProvider";
import { addChat } from "../../configs/firebase/firestore";
import { serverTimestamp } from "firebase/firestore";

const Transition = forwardRef((props, ref) => {
  return <Slide direction="up" ref={ref} {...props} />;
});

function AddDialog({ open, handleClose }) {
  const classes = useStyles();
  const history = useHistory()
  const [filter, setFilter] = useState("");
  const { contacts, chats } = useData();
  const { user } = useFirebase();


  const openChatRoom = contact => async () => {
    // 1. Temukan apakah sudah pernah melakukan chat?
    const findChat = chats.find((chat) => {
      return chat.user_ids.includes(contact.id);
    });

    if (findChat) {
      // [1.1] Jika sudah, kembali ke halaman chatroom sebelumnya.
      return history.push(`/chat/${findChat.id}`);
    }

    // [1.2] Jika belum, bikin chatroom yang baru.
    const profile = contacts.find((contact) => contact.id === user.uid)
    const newChatData = {
      user_ids: [user.uid, contact.id],
      last_message: {},
      unread_count: {
        [user.uid]: 0,
        [contact.id]: 0
      },
      user_profiles: {
        [user.uid]: profile,
        [contact.id]: contact
      },
      created_at: serverTimestamp(),
      updated_at: serverTimestamp()
    }

    try {
      const newChatRef = await addChat(newChatData);

      history.push(`/chat/${newChatRef.id}`);
    } catch (error) {
      console.log(error.message);
    }

  }

  const filteredContacts = contacts.filter((contact) => {
    return contact.nama.toLowerCase().includes(filter.toLowerCase());
  })

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
    >
      <AppBar className={classes.appBar}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <Close />
          </IconButton>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <Search />
            </div>
            <InputBase
              onChange={(e) => {
                setFilter(e.target.value)
              }}
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput
              }}
              inputProps={{ "aria-label": "search" }}
            />
          </div>
        </Toolbar>
      </AppBar>
      <List>
        {filteredContacts.map(contact => {
          if (contact.id === user.uid) {
            return null;
          }
          return (
            <Fragment key={contact.id}>
              <ListItem button onClick={openChatRoom(contact)}>
                <ListItemAvatar>
                  <Avatar
                    alt={contact.nama}
                    src={contact.foto}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={contact.nama}
                  secondary={contact.deskripsi || 'akun baru'}
                />
              </ListItem>
              <Divider />
            </Fragment>
          )
        })}
      </List>
    </Dialog >
  );
}

export default AddDialog;