import { useState, useEffect, useRef, Fragment, useLayoutEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { ArrowBack, Send } from "@material-ui/icons";
import { useCollectionData } from "react-firebase-hooks/firestore";
import {
  addDoc,
  collection,
  doc,
  increment,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import {
  Typography,
  IconButton,
  Avatar,
  TextField,
  Grid,
  InputAdornment,
} from "@material-ui/core";
import { Check, DoneAll } from "@material-ui/icons";
import { groupBy } from "lodash";
import { animateScroll as Scroll } from "react-scroll";

import useStyles from "./styles/ChatRoom_style";
import MessageIn from "./message_in";
import { TopBar } from "../../components";
import { useData } from "../../contexts/DataProvider";
import { useFirebase } from "../../contexts/FirebaseProvider";
import { db } from "../../configs/firebase/firestore";
import { unixToTime, unixToIsoDate, isoToRelative } from "../../utils/datetime";

function ChatRoom() {
  const classes = useStyles();
  const history = useHistory();
  const params = useParams();
  const { chats, profile } = useData();
  const { user } = useFirebase();
  const textRef = useRef(null);

  const [activeChat, setActiveChat] = useState({});
  const [activeContact, setActiveContact] = useState({});
  const [isSending, setSending] = useState(false);

  const activeChatDocRef = doc(db, "chats", params.chatId);
  const messageColRef = collection(db, "chats", params.chatId, "messages");
  const [messages] = useCollectionData(query(messageColRef, orderBy("created_at", "asc")),{ idField: "id" });

  useLayoutEffect(() => {
    Scroll.scrollToBottom({
      containerId: "chatWindow",
      offset: 0,
      isDynamic: true,
      duration: 10,
    })
  },[messages]);

  useEffect(() => {
    const findChat = chats.find((chat) => chat.id === params.chatId);

    if (findChat) {
      setActiveChat(findChat);
      let findActiveContact = {};

      if (findChat.user_profiles) {
        const findContactId = Object.keys(findChat.user_profiles).find(
          (uid) => uid !== user.uid
        );
        findActiveContact =
          findContactId && findChat.user_profiles[findContactId];
        setActiveContact(findActiveContact);
      }
    }
  }, [chats, params.chatId, user.uid]);

  // Menangani form saat disubmit;
  const sendChat = async (e) => {
    e.preventDefault();

    if (isSending) {
      return null;
    }

    if (textRef.current.value) {
      try {
        setSending(true);

        await setDoc(
          activeChatDocRef,
          {
            updated_at: serverTimestamp(),
            last_message: {
              from_user_id: user.uid,
              text: textRef.current.value,
              created_at: serverTimestamp(),
            },
            unread_count: {
              [user.uid]: 0,
              [activeContact.id]: increment(1),
            },
            user_profiles: {
              [user.uid]: profile,
              [activeContact.id]: activeContact,
            },
          },
          {
            merge: true,
          }
        );

        await addDoc(messageColRef, {
          from_user_id: user.uid,
          to_user_id: activeContact.id,
          text: textRef.current.value,
          created_at: serverTimestamp(),
          is_read: false,
        });

        textRef.current.value = "";
        setSending(false);
      } catch (e) {
        console.log(e.message);
        setSending(false);
      }
    }
  };

  // Memeriksa apakah user sedang mengetik pesan?
  const setTyping = (is_typing) => async (e) => {
    await setDoc(
      activeChatDocRef,
      {
        is_typing: {
          [user.uid]: is_typing,
        },
      },
      { merge: true }
    );
  };

  const messageGroupByDate = messages && groupBy(messages, (message) => {
      return unixToIsoDate(message.created_at && message.created_at.toMillis());
    });

  return (
    <>
      <TopBar
        toolbar={
          <>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="Bact to home"
              onClick={() => {
                history.push("/chat");
              }}
            >
              <ArrowBack />
            </IconButton>
            <div className={classes.contactBox}>
              <Avatar
                className={classes.contactAvatar}
                alt={activeContact.nama}
                src={activeContact.foto}
              />
              <div className={classes.contactNameWrap}>
                <Typography
                  className={classes.contactName}
                  component="h1"
                  variant="h6"
                  color="inherit"
                  noWrap
                >
                  {activeContact.nama}
                </Typography>
                {activeChat.is_typing &&
                activeChat.is_typing[activeContact.id] ? (
                  <Typography>Sedang mengetik...</Typography>
                ) : (
                  ""
                )}
              </div>
            </div>
          </>
        }
      />

      <div id="chatWindow" className={classes.chatWindow}>
        {messageGroupByDate &&
          Object.keys(messageGroupByDate).map((dateStr) => (
            <Fragment key={dateStr}>
              <div className={classes.chatDayWrap}>
                <Typography variant="h5">{isoToRelative(dateStr)}</Typography>
              </div>
              {messageGroupByDate[dateStr].map((message) => {
                if (message.from_user_id !== user.uid) {
                  return <MessageIn key={message.id} message={message} />;
                }

                return (
                  <Fragment key={message.id}>
                    <div className={classes.myChatBubble}>
                      <div className={classes.myTextBody}>
                        {message.text.split("\n").map((text, i) => (
                          <Typography key={i} className={classes.myText}>
                            {text}
                          </Typography>
                        ))}
                        <div className={classes.deliveryDetail}>
                          <div className={classes.deliveryIcons}>
                            {message.is_read && (
                              <DoneAll className={classes.iconRead} />
                            )}
                            {!message.is_read && (
                              <Check className={classes.iconSent} />
                            )}
                          </div>
                          <div className={classes.timeStamp}>
                            <Typography variant="caption">
                              {unixToTime(
                                message.created_at &&
                                  message.created_at.toMillis()
                              )}
                            </Typography>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Fragment>
                );
              })}
            </Fragment>
          ))}
      </div>

      <div className={classes.chatInput}>
        <form onSubmit={sendChat}>
          <Grid container direction="column" spacing={3}>
            <Grid item xs={12}>
              <TextField
                inputProps={{
                  ref: textRef,
                }}
                fullWidth
                variant="outlined"
                size="medium"
                multiline
                rowsMax={2}
                placeholder="Ketik pesan"
                onKeyPress={(e) => {
                  if (e.key === "Enter" && e.shiftKey) {
                    sendChat(e);
                  }
                }}
                onFocus={setTyping(true)}
                onBlur={setTyping(false)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton type="submit" disabled={isSending}>
                        <Send color="primary" />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        </form>
      </div>
    </>
  );
}

export default ChatRoom;
