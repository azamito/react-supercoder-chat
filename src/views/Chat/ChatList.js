import { Fragment, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Chat, ChatBubbleOutlined } from "@material-ui/icons";
import {
  Fab,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  ListItemSecondaryAction,
  Badge,
  Divider,
  Container
} from "@material-ui/core";

import useStyles from "./styles/ChatList_style";
import AddDialog from './AddDialog';
import { TopBar } from '../../components';
import { useData } from '../../contexts/DataProvider';
import { useFirebase } from '../../contexts/FirebaseProvider';


function ChatList() {
  const classes = useStyles();
  const history = useHistory();
  const [chatDialog, setChatDialog] = useState({ open: false });
  const { user } = useFirebase();
  const { chats } = useData();

  const openChatRoom = chat => () => {
    history.push(`chat/${chat.id}`);
  };

  return (
    <>
      <TopBar />
      <Container maxWidth="md">
        <List>
          {
            chats.map((chat) => {
              console.log(chat);
              const profileId = Object.keys(chat.user_profiles).find((uid) => uid !== user.uid);
              const profile = profileId ? chat.user_profiles[profileId] : {};

              return (
                <Fragment key={chat.id}>
                  <ListItem button onClick={openChatRoom(chat)}>
                    <ListItemAvatar>
                      <Avatar alt={profile.nama} src={profile.foto} className={classes.orange} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={profile.nama}
                      secondary={
                        chat.is_typing && chat.is_typing[profile.id] ? "mengetik..." :
                          chat.last_message.text || "Belum ada pesan, kirim sekarang!"
                      }
                    />
                    {chat.unread_count[user.uid] > 0 && (
                      <ListItemSecondaryAction>
                        <Badge
                          color="primary"
                          badgeContent={chat.unread_count[user.uid]}
                        >
                          <ChatBubbleOutlined />
                        </Badge>
                      </ListItemSecondaryAction>
                    )}
                  </ListItem>
                  <Divider />
                </Fragment>
              )
            })
          }
        </List>
      </Container>
      <Fab
        className={classes.fab}
        color="primary"
        onClick={() => {
          setChatDialog({ open: true })
        }}
      >
        <Chat />
      </Fab>
      <AddDialog
        {...chatDialog}
        handleClose={() => {
          setChatDialog({ open: false })
        }}
      />
    </>
  )
}

export default ChatList;
